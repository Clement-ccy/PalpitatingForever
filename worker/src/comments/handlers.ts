import type { CommentSubmitPayload, D1Database, Env } from '../core/types';
import { jsonResponse, withCors } from '../core/http';
import { getCountry, getClientIp, parseBody } from '../core/request';
import { nowSec } from '../core/time';
import { hashString } from '../core/crypto';
import { readSetting } from '../core/settings';
import { isOriginAllowed, readSiteBySlug, normalizeHost } from '../core/site';

const resolveUrlPath = (value?: string | null) => {
  if (!value) return null;
  try {
    return new URL(value, 'https://local.invalid').pathname || null;
  } catch {
    return null;
  }
};

const ensureThread = async (db: D1Database, siteId: string, pageKey: string, url: string, title?: string | null) => {
  const row = await db.prepare(
    'SELECT id FROM c_threads WHERE site_id = ? AND page_key = ?'
  ).bind(siteId, pageKey).first();
  const existing = row as { id: string } | null;
  if (existing) {
    await db.prepare('UPDATE c_threads SET url = ?, title = ?, updated_at = ? WHERE id = ?')
      .bind(url, title ?? null, nowSec(), existing.id)
      .run();
    return existing.id;
  }
  const threadId = crypto.randomUUID();
  const timestamp = nowSec();
  await db.prepare(
    'INSERT INTO c_threads (id, site_id, page_key, url, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(threadId, siteId, pageKey, url, title ?? null, timestamp, timestamp).run();
  return threadId;
};

const incrementThreadCounts = async (db: D1Database, threadId: string, approved: boolean) => {
  await db.prepare(
    'UPDATE c_threads SET comment_count_total = comment_count_total + 1, '
    + 'comment_count_approved = comment_count_approved + ?, last_commented_at = ?, updated_at = ? WHERE id = ?'
  ).bind(approved ? 1 : 0, nowSec(), nowSec(), threadId).run();
};

const updateReplyCount = async (db: D1Database, parentId: string) => {
  await db.prepare('UPDATE c_comments SET reply_count = reply_count + 1 WHERE id = ?')
    .bind(parentId)
    .run();
};

const rateLimitKey = async (env: Env, siteId: string, ip: string, windowStart: number) => {
  const ipHash = await hashString(ip, env.DATA_SECRET);
  return `comment:${siteId}:${ipHash}:${windowStart}`;
};

const checkRateLimit = async (db: D1Database, env: Env, siteId: string, ip: string, limit: number) => {
  const windowStart = Math.floor(nowSec() / 600) * 600;
  const key = await rateLimitKey(env, siteId, ip, windowStart);
  const row = await db.prepare('SELECT count FROM rate_limits WHERE key = ?')
    .bind(key)
    .first();
  const result = row as { count?: number } | null;
  if (result?.count && result.count >= limit) return { allowed: false, key };

  await db.prepare(
    'INSERT INTO rate_limits (key, window_start, count, updated_at) VALUES (?, ?, 1, ?) '
    + 'ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = ?'
  ).bind(key, windowStart, nowSec(), nowSec()).run();
  return { allowed: true, key };
};

export const handleCommentsThread = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const pageKey = url.searchParams.get('pageKey');
  if (!pageKey) {
    return withCors(request, env, jsonResponse({ error: 'Missing pageKey' }, 400));
  }
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const thread = await env.DATABASE.prepare(
    'SELECT id, comment_count_approved, comment_count_total, last_commented_at FROM c_threads WHERE site_id = ? AND page_key = ?'
  ).bind(site.id, pageKey).first();
  const threadRow = thread as { id: string; comment_count_approved: number; comment_count_total: number; last_commented_at: number } | null;
  if (!threadRow) {
    return withCors(request, env, jsonResponse({ thread: null, comments: [] }));
  }
  const commentsRows = await env.DATABASE.prepare(
    'SELECT id, parent_id, author_name, author_url, avatar_url, content_md, created_at, reply_count FROM c_comments WHERE thread_id = ? AND status = ? ORDER BY created_at ASC'
  ).bind(threadRow.id, 'approved').all();
  return withCors(request, env, jsonResponse({
    thread: {
      id: threadRow.id,
      comment_count_approved: threadRow.comment_count_approved,
      comment_count_total: threadRow.comment_count_total,
      last_commented_at: threadRow.last_commented_at,
    },
    comments: commentsRows.results,
  }));
};

export const handleCommentsSubmit = async (request: Request, env: Env) => {
  const payload = await parseBody<CommentSubmitPayload>(request);
  if (!payload || !payload.site || !payload.pageKey || !payload.url || !payload.author?.name || !payload.content) {
    return withCors(request, env, jsonResponse({ error: 'Invalid payload' }, 400));
  }
  const site = await readSiteBySlug(env.DATABASE, payload.site);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  if (!isOriginAllowed(request, env, site)) {
    return withCors(request, env, jsonResponse({ error: 'Origin not allowed' }, 403));
  }
  const ip = getClientIp(request, env);
  if (!ip) {
    return withCors(request, env, jsonResponse({ error: 'IP required' }, 400));
  }
  const rateLimitRaw = await readSetting(env.DATABASE, 'comments.rate_limit_per_10min');
  const rateLimit = rateLimitRaw ? Number(rateLimitRaw) : 5;
  const rateResult = await checkRateLimit(env.DATABASE, env, site.id, ip, Number.isNaN(rateLimit) ? 5 : rateLimit);
  if (!rateResult.allowed) {
    return withCors(request, env, jsonResponse({ error: 'Rate limit exceeded' }, 429));
  }
  const threadId = await ensureThread(env.DATABASE, site.id, payload.pageKey, payload.url, payload.title);
  const commentId = crypto.randomUUID();
  const now = nowSec();
  const autoApprove = (await readSetting(env.DATABASE, 'comments.auto_approve')) === 'true'
    || env.COMMENTS_AUTO_APPROVE === 'true';
  const status = autoApprove ? 'approved' : 'pending';

  await env.DATABASE.prepare(
    'INSERT INTO c_comments (id, thread_id, parent_id, status, author_name, author_url, avatar_url, email_plain, ip_plain, ua_plain, os, browser, device, country, content_md, created_at, updated_at, approved_at) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    commentId,
    threadId,
    payload.parentId ?? null,
    status,
    payload.author.name,
    payload.author.url ?? null,
    payload.author.avatarUrl ?? null,
    payload.author.email ?? null,
    ip,
    request.headers.get('User-Agent') ?? null,
    payload.meta?.os ?? null,
    payload.meta?.browser ?? null,
    payload.meta?.device ?? null,
    payload.meta?.country ?? getCountry(request),
    payload.content,
    now,
    now,
    autoApprove ? now : null
  ).run();

  const urlPath = resolveUrlPath(payload.url);
  const referrer = request.headers.get('Referer');
  await env.DATABASE.prepare(
    'INSERT INTO comment_event (event_id, site_id, thread_id, comment_id, created_at, url_path, referrer_domain, device, os, browser, country, event_type, event_name) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    crypto.randomUUID(),
    site.id,
    threadId,
    commentId,
    now,
    urlPath ?? payload.pageKey,
    referrer ? normalizeHost(referrer) : null,
    payload.meta?.device ?? null,
    payload.meta?.os ?? null,
    payload.meta?.browser ?? null,
    payload.meta?.country ?? getCountry(request),
    1,
    'comment_submit'
  ).run();

  if (payload.parentId) {
    await updateReplyCount(env.DATABASE, payload.parentId);
  }

  await incrementThreadCounts(env.DATABASE, threadId, autoApprove);

  return withCors(request, env, jsonResponse({ id: commentId, status }));
};

export const handleCommentsCounts = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const pageKeys = url.searchParams.get('pageKeys');
  if (!pageKeys) {
    return withCors(request, env, jsonResponse({ error: 'Missing pageKeys' }, 400));
  }
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const keys = pageKeys.split(',').map((key) => key.trim()).filter(Boolean);
  if (keys.length === 0) {
    return withCors(request, env, jsonResponse({ counts: {} }));
  }
  const placeholders = keys.map(() => '?').join(',');
  const rows = await env.DATABASE.prepare(
    `SELECT page_key, comment_count_approved FROM c_threads WHERE site_id = ? AND page_key IN (${placeholders})`
  ).bind(site.id, ...keys).all();
  const counts: Record<string, number> = {};
  keys.forEach((key) => { counts[key] = 0; });
  rows.results.forEach((row) => {
    const typed = row as { page_key: string; comment_count_approved: number };
    counts[typed.page_key] = typed.comment_count_approved ?? 0;
  });
  return withCors(request, env, jsonResponse({ counts }));
};

export const handleCommentsLatest = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const limitRaw = url.searchParams.get('limit') ?? '5';
  const limit = Math.min(50, Math.max(1, Number(limitRaw)));
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const rows = await env.DATABASE.prepare(
    'SELECT c_comments.id, c_threads.page_key, c_comments.author_name, c_comments.avatar_url, c_comments.content_md, c_comments.created_at '
    + 'FROM c_comments JOIN c_threads ON c_comments.thread_id = c_threads.id '
    + 'WHERE c_threads.site_id = ? AND c_comments.status = ? '
    + 'ORDER BY c_comments.created_at DESC LIMIT ?'
  ).bind(site.id, 'approved', limit).all();
  return withCors(request, env, jsonResponse({ comments: rows.results }));
};

export const handleCommentsTotal = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const row = await env.DATABASE.prepare(
    'SELECT COUNT(*) AS total '
    + 'FROM c_comments '
    + 'JOIN c_threads ON c_comments.thread_id = c_threads.id '
    + 'WHERE c_threads.site_id = ? AND c_comments.status = ?'
  ).bind(site.id, 'approved').first();
  const result = row as { total?: number } | null;
  return withCors(request, env, jsonResponse({ total: result?.total ?? 0 }));
};
