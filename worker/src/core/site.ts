import type { D1Database, Env } from './types';
import { parseOrigins } from './http';

export const normalizeHost = (value: string | null) => (value ? value.replace(/^https?:\/\//, '').split('/')[0] : null);

export const isAllowedHost = (host: string | null, allowedHosts: string[]) => (
  host ? allowedHosts.includes(host) : false
);

export const readSiteBySlug = async (db: D1Database, slug: string) => {
  const row = await db.prepare(
    'SELECT id, slug, primary_host, allowed_hosts_json FROM sites WHERE slug = ?'
  ).bind(slug).first();
  return row as { id: string; slug: string; primary_host: string; allowed_hosts_json: string } | null;
};

export const parseJsonArray = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getAllowedHosts = (site: { allowed_hosts_json: string }) => (
  parseJsonArray(site.allowed_hosts_json)
);

export const getAllowedOriginHosts = (env: Env) => (
  parseOrigins(env.ALLOWED_ORIGINS)
    .map((origin) => normalizeHost(origin))
    .filter((origin): origin is string => Boolean(origin))
);

export const isOriginAllowed = (request: Request, env: Env, site: { allowed_hosts_json: string }) => {
  const originHost = normalizeHost(request.headers.get('Origin'));
  if (!originHost) return true;
  const allowedHosts = getAllowedHosts(site);
  const allowedOriginHosts = getAllowedOriginHosts(env);
  return allowedHosts.includes(originHost) || allowedOriginHosts.includes(originHost);
};
