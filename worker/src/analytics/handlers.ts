import type { CollectPayload, D1Database, Env, EventPayload } from '../core/types';
import { getCountry, getClientIp, isDntEnabled, parseBody, resolveClientInfo } from '../core/request';
import { nowSec } from '../core/time';
import { jsonResponse, withCors } from '../core/http';
import { normalizeHost, readSiteBySlug, isOriginAllowed } from '../core/site';
import { readSetting } from '../core/settings';
import { hashString } from '../core/crypto';

const normalizePath = (value: string) => (value.startsWith('/') ? value : `/${value}`);

const parseUrlQuery = (value: string | null | undefined) => {
  if (!value) return null;
  const queryStart = value.indexOf('?');
  if (queryStart >= 0) return value.slice(queryStart + 1) || null;
  return null;
};

const getVisitId = (sessionId: string, timestamp: number) => {
  const hour = Math.floor(timestamp / 3600);
  return `${sessionId}:${hour}`;
};

const ensureUmamiSession = async (
  db: D1Database,
  siteId: string,
  sessionId: string,
  timestamp: number,
  info: {
    browser: string | null;
    os: string | null;
    device: string | null;
    screen: string | null;
    language: string | null;
    country: string | null;
    distinctId: string | null;
  }
) => {
  await db.prepare(
    'INSERT OR IGNORE INTO umami_session (session_id, site_id, browser, os, device, screen, language, country, distinct_id, created_at) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    sessionId,
    siteId,
    info.browser,
    info.os,
    info.device,
    info.screen,
    info.language,
    info.country,
    info.distinctId,
    timestamp
  ).run();
};

const writeUmamiEvent = async (
  db: D1Database,
  siteId: string,
  sessionId: string,
  visitId: string,
  timestamp: number,
  payload: CollectPayload,
  params: {
    hostname: string | null;
    referrerDomain: string | null;
    urlPath: string;
    urlQuery: string | null;
    pageTitle: string | null;
    eventType: number;
    eventName?: string | null;
    dataJson?: string | null;
  }
) => {
  await db.prepare(
    'INSERT INTO umami_event (event_id, site_id, session_id, visit_id, created_at, url_path, url_query, referrer_domain, page_title, hostname, event_type, event_name, data_json) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    crypto.randomUUID(),
    siteId,
    sessionId,
    visitId,
    timestamp,
    params.urlPath,
    params.urlQuery,
    params.referrerDomain,
    params.pageTitle,
    params.hostname,
    params.eventType,
    params.eventName ?? null,
    params.dataJson ?? null
  ).run();
};
const getSessionId = async (db: D1Database, siteId: string, distinctId: string) => {
  const row = await db.prepare(
    'SELECT session_id, created_at FROM umami_session WHERE site_id = ? AND distinct_id = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(siteId, distinctId).first();
  const result = row as { session_id: string; created_at: number } | null;
  if (!result) return null;
  const inactive = nowSec() - result.created_at > 1800;
  return inactive ? null : result.session_id;
};

const upsertSession = async (
  db: D1Database,
  payload: CollectPayload,
  siteId: string,
  distinctId: string
) => {
  const sessionId = crypto.randomUUID();
  const timestamp = nowSec();
  await db.prepare(
    'INSERT INTO umami_session (session_id, site_id, browser, os, device, screen, language, country, distinct_id, created_at) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    sessionId,
    siteId,
    payload.browser ?? null,
    payload.os ?? null,
    payload.device_type ?? null,
    payload.screen ?? null,
    payload.language ?? null,
    payload.country ?? null,
    distinctId,
    timestamp
  ).run();
  return sessionId;
};

export const handleAnalyticsCollect = async (request: Request, env: Env) => {
  if (isDntEnabled(request)) {
    return withCors(request, env, jsonResponse({ ok: true }));
  }
  const payload = await parseBody<CollectPayload>(request);
  if (!payload || !payload.path || !payload.site) {
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
  const clientInfo = resolveClientInfo(request, payload);
  const devicePlain = `${ip}|${clientInfo.ua}`;
  const distinctId = await hashString(`${site.id}:${devicePlain}`, env.DATA_SECRET);
  const existingSession = await getSessionId(env.DATABASE, site.id, distinctId);
  const sessionId = existingSession ?? await upsertSession(
    env.DATABASE,
    {
      ...payload,
      device_type: clientInfo.device_type,
      os: clientInfo.os,
      browser: clientInfo.browser,
      language: clientInfo.language,
      country: payload.country ?? getCountry(request),
    },
    site.id,
    distinctId
  );

  const hostname = new URL(request.url).hostname;
  const urlPath = normalizePath(payload.path);
  const urlQuery = parseUrlQuery(payload.url);
  const referrerDomain = payload.referrer ? normalizeHost(payload.referrer) : null;
  const timestamp = nowSec();
  const visitId = getVisitId(sessionId, timestamp);
  await ensureUmamiSession(env.DATABASE, site.id, sessionId, timestamp, {
    browser: clientInfo.browser,
    os: clientInfo.os,
    device: clientInfo.device_type,
    screen: payload.screen ?? null,
    language: clientInfo.language,
    country: payload.country ?? getCountry(request),
    distinctId,
  });
  await writeUmamiEvent(env.DATABASE, site.id, sessionId, visitId, timestamp, payload, {
    hostname,
    referrerDomain,
    urlPath,
    urlQuery,
    pageTitle: payload.title ?? null,
    eventType: 1,
  });

  return withCors(request, env, jsonResponse({ ok: true }));
};

export const handleAnalyticsEvent = async (request: Request, env: Env) => {
  if (isDntEnabled(request)) {
    return withCors(request, env, jsonResponse({ ok: true }));
  }
  const payload = await parseBody<EventPayload>(request);
  if (!payload || !payload.site || !payload.name || !payload.path) {
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
  const clientInfo = resolveClientInfo(request, payload);
  const devicePlain = `${ip}|${clientInfo.ua}`;
  const distinctId = await hashString(`${site.id}:${devicePlain}`, env.DATA_SECRET);
  const existingSession = await getSessionId(env.DATABASE, site.id, distinctId);
  const sessionId = existingSession ?? await upsertSession(
    env.DATABASE,
    {
      ...payload,
      device_type: clientInfo.device_type,
      os: clientInfo.os,
      browser: clientInfo.browser,
      language: clientInfo.language,
      country: payload.country ?? getCountry(request),
    },
    site.id,
    distinctId
  );
  const hostname = new URL(request.url).hostname;
  const urlPath = normalizePath(payload.path);
  const urlQuery = parseUrlQuery(payload.url);
  const referrerDomain = payload.referrer ? normalizeHost(payload.referrer) : null;
  const timestamp = nowSec();
  const visitId = getVisitId(sessionId, timestamp);
  await ensureUmamiSession(env.DATABASE, site.id, sessionId, timestamp, {
    browser: clientInfo.browser,
    os: clientInfo.os,
    device: clientInfo.device_type,
    screen: payload.screen ?? null,
    language: clientInfo.language,
    country: payload.country ?? getCountry(request),
    distinctId,
  });
  await writeUmamiEvent(env.DATABASE, site.id, sessionId, visitId, timestamp, payload, {
    hostname,
    referrerDomain,
    urlPath,
    urlQuery,
    pageTitle: payload.title ?? null,
    eventType: 2,
    eventName: payload.name,
    dataJson: payload.data ? JSON.stringify(payload.data) : null,
  });
  return withCors(request, env, jsonResponse({ ok: true }));
};

export const handleAdminAnalyticsOverview = async (request: Request, env: Env) => {
  const siteSlug = new URL(request.url).searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const tzOffset = 8 * 3600;
  const day = new Date((nowSec() + tzOffset) * 1000).toISOString().slice(0, 10);
  const rows = await env.DATABASE.prepare(
    'SELECT COUNT(*) AS views, COUNT(DISTINCT visit_id) AS visits, COUNT(DISTINCT session_id) AS visitors, SUM(CASE WHEN event_type = 2 THEN 1 ELSE 0 END) AS events '
    + 'FROM umami_event WHERE site_id = ? AND date(datetime(created_at, "unixepoch")) = ?'
  ).bind(site.id, day).first();
  const result = rows as { views?: number; visits?: number; visitors?: number; events?: number } | null;
  return withCors(request, env, jsonResponse({ overview: {
    pageviews: result?.views ?? 0,
    visits: result?.visits ?? 0,
    visitors: result?.visitors ?? 0,
    events: result?.events ?? 0,
  } }));
};

export const handleAdminUmamiOverview = async (request: Request, env: Env) => {
  const siteSlug = new URL(request.url).searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const start = new URL(request.url).searchParams.get('start');
  const end = new URL(request.url).searchParams.get('end');
  const startTs = start ? Number(start) : nowSec() - 86400 * 30;
  const endTs = end ? Number(end) : nowSec();

  const viewsRow = await env.DATABASE.prepare(
    'SELECT COUNT(*) AS views, COUNT(DISTINCT visit_id) AS visits, COUNT(DISTINCT session_id) AS visitors, SUM(CASE WHEN event_type = 2 THEN 1 ELSE 0 END) AS events '
    + 'FROM umami_event WHERE site_id = ? AND created_at BETWEEN ? AND ?'
  ).bind(site.id, startTs, endTs).first();
  const result = viewsRow as { views?: number; visits?: number; visitors?: number; events?: number } | null;
  return withCors(request, env, jsonResponse({
    overview: {
      pageviews: result?.views ?? 0,
      visits: result?.visits ?? 0,
      visitors: result?.visitors ?? 0,
      events: result?.events ?? 0,
    },
  }));
};

export const handleAdminUmamiPages = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT url_path AS name, COUNT(*) AS views, COUNT(DISTINCT session_id) AS visitors '
    + 'FROM umami_event WHERE site_id = ? AND event_type = 1 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY url_path ORDER BY views DESC LIMIT ?'
  ).bind(site.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminUmamiReferrers = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT COALESCE(referrer_domain, "direct") AS name, COUNT(*) AS views '
    + 'FROM umami_event WHERE site_id = ? AND event_type = 1 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY referrer_domain ORDER BY views DESC LIMIT ?'
  ).bind(site.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminUmamiEvents = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const rows = await env.DATABASE.prepare(
    'SELECT event_name AS name, COUNT(*) AS count '
    + 'FROM umami_event WHERE site_id = ? AND event_type = 2 AND created_at BETWEEN ? AND ? '
    + 'GROUP BY event_name ORDER BY count DESC LIMIT ?'
  ).bind(site.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminUmamiBreakdown = async (request: Request, env: Env, dimension: 'device' | 'os' | 'browser' | 'country') => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '10')));
  const column = dimension === 'device' ? 'device' : dimension === 'os' ? 'os' : dimension === 'browser' ? 'browser' : 'country';
  const rows = await env.DATABASE.prepare(
    `SELECT COALESCE(${column}, "unknown") AS name, COUNT(*) AS count FROM umami_session WHERE site_id = ? AND created_at BETWEEN ? AND ? GROUP BY ${column} ORDER BY count DESC LIMIT ?`
  ).bind(site.id, startTs, endTs, limit).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminUmamiTimeseries = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const rows = await env.DATABASE.prepare(
    'SELECT date(datetime(created_at, "unixepoch")) AS day, '
    + 'COUNT(*) AS pageviews, '
    + 'COUNT(DISTINCT session_id) AS visitors, '
    + 'COUNT(DISTINCT visit_id) AS visits, '
    + 'SUM(CASE WHEN event_type = 2 THEN 1 ELSE 0 END) AS events '
    + 'FROM umami_event WHERE site_id = ? AND created_at BETWEEN ? AND ? '
    + 'GROUP BY day ORDER BY day ASC'
  ).bind(site.id, startTs, endTs).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const handleAdminUmamiRetention = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get('site') ?? env.SITE_SLUG ?? 'main';
  const site = await readSiteBySlug(env.DATABASE, siteSlug);
  if (!site) {
    return withCors(request, env, jsonResponse({ error: 'Unknown site' }, 404));
  }
  const startTs = Number(url.searchParams.get('start') ?? nowSec() - 86400 * 30);
  const endTs = Number(url.searchParams.get('end') ?? nowSec());
  const rows = await env.DATABASE.prepare(
    'SELECT date(datetime(created_at, "unixepoch")) AS day, COUNT(DISTINCT distinct_id) AS visitors '
    + 'FROM umami_session WHERE site_id = ? AND created_at BETWEEN ? AND ? '
    + 'GROUP BY day ORDER BY day ASC'
  ).bind(site.id, startTs, endTs).all();
  return withCors(request, env, jsonResponse({ items: rows.results }));
};

export const runAnalyticsRetention = async (env: Env): Promise<void> => {
  const retentionRaw = await readSetting(env.DATABASE, 'analytics.retention_days');
  const retentionDays = retentionRaw ? Number(retentionRaw) : 90;
  const retentionSec = (Number.isNaN(retentionDays) ? 90 : retentionDays) * 86400;
  const cutoff = nowSec() - retentionSec;

  await env.DATABASE.prepare('DELETE FROM umami_event WHERE created_at < ?').bind(cutoff).run();
  await env.DATABASE.prepare('DELETE FROM comment_event WHERE created_at < ?').bind(cutoff).run();
  await env.DATABASE.prepare('DELETE FROM umami_session WHERE created_at < ?').bind(cutoff).run();
};
