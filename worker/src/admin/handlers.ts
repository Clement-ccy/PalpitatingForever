import type { AdminLoginPayload, Env } from '../core/types';
import { jsonResponse, withCors } from '../core/http';
import { parseBody, parseCookies, getClientIp } from '../core/request';
import { hashString, generatePasswordHash, encodeBase64 } from '../core/crypto';
import { nowSec } from '../core/time';
import { readSetting, writeSetting } from '../core/settings';

const buildAdminSession = async (env: Env, userId: string, ip: string, ua: string) => {
  const sessionToken = crypto.randomUUID();
  const csrfToken = crypto.randomUUID();
  const tokenHash = await hashString(sessionToken, env.ADMIN_SESSION_SECRET);
  const csrfHash = await hashString(csrfToken, env.ADMIN_SESSION_SECRET);
  const sessionId = crypto.randomUUID();
  const timestamp = nowSec();
  return {
    sessionId,
    sessionToken,
    csrfToken,
    tokenHash,
    csrfHash,
    userId,
    createdAt: timestamp,
    expiresAt: timestamp + 60 * 60 * 24 * 7,
    ipPlain: ip,
    uaPlain: ua,
  };
};

const requireAdminSession = async (request: Request, env: Env) => {
  const cookies = parseCookies(request.headers.get('Cookie'));
  const token = cookies['pf_admin_session'];
  const csrf = request.headers.get('X-CSRF-Token') ?? '';
  if (!token || !csrf) return null;
  const tokenHash = await hashString(token, env.ADMIN_SESSION_SECRET);
  const csrfHash = await hashString(csrf, env.ADMIN_SESSION_SECRET);
  const row = await env.DATABASE.prepare(
    'SELECT id, user_id, expires_at FROM admin_sessions WHERE token_hash = ? AND csrf_hash = ?'
  ).bind(tokenHash, csrfHash).first();
  const session = row as { id: string; user_id: string; expires_at: number } | null;
  if (!session || session.expires_at < nowSec()) return null;
  return session;
};

const hasAdminUser = async (db: Env['DATABASE']) => {
  const row = await db.prepare('SELECT id FROM admin_users LIMIT 1').first();
  return Boolean(row);
};

const hasValidSetupToken = (request: Request, env: Env) => {
  if (!env.ADMIN_SETUP_TOKEN) return false;
  const auth = request.headers.get('Authorization') ?? '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  const token = bearer || request.headers.get('X-Setup-Token') || '';
  return token === env.ADMIN_SETUP_TOKEN;
};

export const handleAdminLogin = async (request: Request, env: Env) => {
  const payload = await parseBody<AdminLoginPayload>(request);
  if (!payload?.username || !payload.password) {
    return withCors(request, env, jsonResponse({ error: 'Invalid payload' }, 400));
  }
  const row = await env.DATABASE.prepare(
    'SELECT id, pw_hash, pw_salt, pw_iters, disabled_at FROM admin_users WHERE username = ?'
  ).bind(payload.username).first();
  const user = row as { id: string; pw_hash: string; pw_salt: string; pw_iters: number; disabled_at?: number | null } | null;
  if (!user || user.disabled_at) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const encoder = new TextEncoder();
  const saltBytes = Uint8Array.from(atob(user.pw_salt), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', encoder.encode(payload.password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: user.pw_iters, hash: 'SHA-256' }, key, 256);
  const hash = encodeBase64(derived);
  if (hash !== user.pw_hash) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }

  const session = await buildAdminSession(env, user.id, getClientIp(request, env), request.headers.get('User-Agent') ?? '');
  await env.DATABASE.prepare(
    'INSERT INTO admin_sessions (id, user_id, token_hash, csrf_hash, created_at, expires_at, last_seen_at, ip_plain, ua_plain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    session.sessionId,
    session.userId,
    session.tokenHash,
    session.csrfHash,
    session.createdAt,
    session.expiresAt,
    session.createdAt,
    session.ipPlain,
    session.uaPlain
  ).run();

  const cookie = `pf_admin_session=${encodeURIComponent(session.sessionToken)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`;
  return withCors(request, env, jsonResponse({ ok: true, csrf: session.csrfToken }, 200, {
    'Set-Cookie': cookie,
  }));
};

export const handleAdminSetup = async (request: Request, env: Env) => {
  const setupDisabled = (await readSetting(env.DATABASE, 'admin.setup_disabled')) === 'true';
  if (setupDisabled) {
    return withCors(request, env, jsonResponse({ error: 'Setup disabled' }, 403));
  }
  if (!hasValidSetupToken(request, env)) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  if (await hasAdminUser(env.DATABASE)) {
    return withCors(request, env, jsonResponse({ error: 'Admin already exists' }, 409));
  }
  const payload = await parseBody<AdminLoginPayload>(request);
  if (!payload?.username || !payload.password) {
    return withCors(request, env, jsonResponse({ error: 'Invalid payload' }, 400));
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 120000;
  const hash = await generatePasswordHash(payload.password, salt, iterations);
  const saltBase64 = encodeBase64(salt.buffer);
  await env.DATABASE.prepare(
    'INSERT INTO admin_users (id, username, pw_hash, pw_salt, pw_iters, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(
    crypto.randomUUID(),
    payload.username,
    hash,
    saltBase64,
    iterations,
    nowSec()
  ).run();
  await writeSetting(env.DATABASE, 'admin.setup_disabled', 'true');
  return withCors(request, env, jsonResponse({ ok: true }));
};

export const handleAdminSetupStatus = async (request: Request, env: Env) => {
  const setupDisabled = (await readSetting(env.DATABASE, 'admin.setup_disabled')) === 'true';
  return withCors(request, env, jsonResponse({ setupDisabled }));
};

export const handleAdminMe = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  return withCors(request, env, jsonResponse({ ok: true, user_id: session.user_id }));
};

export const handleAdminComments = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const status = url.searchParams.get('status') ?? 'pending';
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '50')));
  const rows = await env.DATABASE.prepare(
    'SELECT c_comments.id, c_threads.page_key, c_comments.author_name, c_comments.author_url, c_comments.avatar_url, c_comments.content_md, c_comments.created_at, c_comments.status, c_comments.email_plain, c_comments.ip_plain, c_comments.ua_plain, c_comments.os, c_comments.browser, c_comments.device, c_comments.country '
    + 'FROM c_comments JOIN c_threads ON c_comments.thread_id = c_threads.id '
    + 'WHERE c_comments.status = ? ORDER BY c_comments.created_at DESC LIMIT ?'
  ).bind(status, limit).all();
  return withCors(request, env, jsonResponse({ comments: rows.results }));
};

export const handleAdminCommentAction = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const commentId = parts[4];
  const action = parts[5];
  if (!commentId || !action) {
    return withCors(request, env, jsonResponse({ error: 'Invalid action' }, 400));
  }
  const allowed = ['approve', 'hide', 'delete'];
  if (!allowed.includes(action)) {
    return withCors(request, env, jsonResponse({ error: 'Invalid action' }, 400));
  }
  const status = action === 'approve' ? 'approved' : action === 'hide' ? 'hidden' : 'deleted';
  await env.DATABASE.prepare(
    'UPDATE c_comments SET status = ?, approved_at = ?, updated_at = ? WHERE id = ?'
  ).bind(status, action === 'approve' ? nowSec() : null, nowSec(), commentId).run();
  const commentRow = await env.DATABASE.prepare(
    'SELECT c_comments.thread_id, c_comments.os, c_comments.browser, c_comments.device, c_comments.country, c_threads.url '
    + 'FROM c_comments JOIN c_threads ON c_comments.thread_id = c_threads.id WHERE c_comments.id = ?'
  ).bind(commentId).first();
  const comment = commentRow as { thread_id: string; os: string | null; browser: string | null; device: string | null; country: string | null; url: string } | null;
  if (comment) {
    const urlPath = comment.url ? new URL(comment.url).pathname : comment.thread_id;
    const siteRow = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
      .bind(env.SITE_SLUG ?? 'main')
      .first();
    const site = siteRow as { id: string } | null;
    if (site) {
      await env.DATABASE.prepare(
        'INSERT INTO comment_event (event_id, site_id, thread_id, comment_id, created_at, url_path, referrer_domain, device, os, browser, country, event_type, event_name) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        site.id,
        comment.thread_id,
        commentId,
        nowSec(),
        urlPath ?? comment.thread_id,
        null,
        comment.device ?? null,
        comment.os ?? null,
        comment.browser ?? null,
        comment.country ?? null,
        action === 'approve' ? 2 : action === 'hide' ? 3 : 4,
        `comment_${action}`
      ).run();
    }
  }
  await env.DATABASE.prepare(
    'INSERT INTO c_moderation_log (id, comment_id, action, actor_user_id, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), commentId, action, session.user_id, nowSec()).run();
  return withCors(request, env, jsonResponse({ ok: true }));
};

export const handleAdminSettingsGet = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const rows = await env.DATABASE.prepare('SELECT key, value_json, is_secret FROM settings').all();
  return withCors(request, env, jsonResponse({ settings: rows.results }));
};

export const handleAdminSettingsPost = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const payload = await parseBody<{ key: string; value: unknown }>(request);
  if (!payload?.key) {
    return withCors(request, env, jsonResponse({ error: 'Invalid payload' }, 400));
  }
  await env.DATABASE.prepare(
    'UPDATE settings SET value_json = ?, updated_at = ? WHERE key = ?'
  ).bind(JSON.stringify(payload.value), nowSec(), payload.key).run();
  return withCors(request, env, jsonResponse({ ok: true }));
};

export const handleAdminCommentAnalyticsOverview = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const rows = await env.DATABASE.prepare(
    'SELECT COUNT(*) AS total, '
    + 'SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) AS approved, '
    + 'SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) AS pending, '
    + 'SUM(CASE WHEN status = "hidden" THEN 1 ELSE 0 END) AS hidden '
    + 'FROM c_comments JOIN c_threads ON c_comments.thread_id = c_threads.id '
    + 'WHERE c_threads.site_id = ? AND c_comments.created_at BETWEEN ? AND ?'
  ).bind(siteRow.id, startTs, endTs).first();
  const result = rows as { total?: number; approved?: number; pending?: number; hidden?: number } | null;
  return withCors(request, env, jsonResponse({ overview: {
    total: result?.total ?? 0,
    approved: result?.approved ?? 0,
    pending: result?.pending ?? 0,
    hidden: result?.hidden ?? 0,
  } }));
};

export const handleAdminCommentAnalyticsPages = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT url_path AS name, COUNT(*) AS count '
    + 'FROM comment_event WHERE site_id = ? AND event_type = 1 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY url_path ORDER BY count DESC LIMIT ?'
  ).bind(siteRow.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminCommentAnalyticsReferrers = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT COALESCE(referrer_domain, "direct") AS name, COUNT(*) AS count '
    + 'FROM comment_event WHERE site_id = ? AND event_type = 1 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY referrer_domain ORDER BY count DESC LIMIT ?'
  ).bind(siteRow.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminCommentAnalyticsTimeseries = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const rows = await env.DATABASE.prepare(
    'SELECT date(datetime(created_at, "unixepoch")) AS day, COUNT(*) AS count '
    + 'FROM comment_event WHERE site_id = ? AND event_type = 1 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY day ORDER BY day ASC'
  ).bind(siteRow.id, startTs, endTs).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminCommentAnalyticsBreakdown = async (request: Request, env: Env, dimension: 'device' | 'os' | 'browser' | 'country') => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const column = dimension === 'device' ? 'device' : dimension === 'os' ? 'os' : dimension === 'browser' ? 'browser' : 'country';
  const rows = await env.DATABASE.prepare(
    `SELECT COALESCE(${column}, "unknown") AS name, COUNT(*) AS count FROM comment_event WHERE site_id = ? AND created_at BETWEEN ? AND ? GROUP BY ${column} ORDER BY count DESC LIMIT ?`
  ).bind(siteRow.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminCommentAnalyticsEvents = async (request: Request, env: Env) => {
  const session = await requireAdminSession(request, env);
  if (!session) {
    return withCors(request, env, jsonResponse({ error: 'Unauthorized' }, 401));
  }
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await env.DATABASE.prepare('SELECT id FROM sites WHERE slug = ?')
    .bind(siteSlug).first();
  const siteRow = site as { id: string } | null;
  if (!siteRow) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT event_name AS name, COUNT(*) AS count FROM comment_event WHERE site_id = ? AND created_at BETWEEN ? AND ? GROUP BY event_name ORDER BY count DESC LIMIT ?'
  ).bind(siteRow.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};
