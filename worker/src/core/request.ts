import type { Env, CollectPayload } from './types';

export const getClientIp = (request: Request, env: Env) => {
  const header = request.headers.get('CF-Connecting-IP')
    ?? request.headers.get('X-Forwarded-For')
    ?? request.headers.get('X-Real-IP')
    ?? '';
  const value = header.split(',')[0].trim();
  if (value) return value;
  const host = new URL(request.url).hostname;
  if (env.DEV_MODE === 'true' || host === 'localhost' || host === '127.0.0.1') {
    return 'local';
  }
  return '';
};

export const getCountry = (request: Request) => request.headers.get('CF-IPCountry') ?? null;

export const parseCookies = (header: string | null) => {
  const result: Record<string, string> = {};
  if (!header) return result;
  header.split(';').forEach((part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return;
    result[key] = decodeURIComponent(rest.join('='));
  });
  return result;
};

export const parseBody = async <T>(request: Request): Promise<T | null> => {
  try {
    return await request.json() as T;
  } catch {
    return null;
  }
};

export const isDntEnabled = (request: Request) => {
  const dnt = request.headers.get('DNT');
  return dnt === '1';
};

export const parseUserAgent = (ua: string) => {
  const value = ua.toLowerCase();
  let browser = 'unknown';
  if (value.includes('edg/')) browser = 'Edge';
  else if (value.includes('opr/') || value.includes('opera')) browser = 'Opera';
  else if (value.includes('chrome/')) browser = 'Chrome';
  else if (value.includes('safari/')) browser = 'Safari';
  else if (value.includes('firefox/')) browser = 'Firefox';

  let os = 'unknown';
  if (value.includes('windows nt')) os = 'Windows';
  else if (value.includes('android')) os = 'Android';
  else if (value.includes('iphone') || value.includes('ipad') || value.includes('ios')) os = 'iOS';
  else if (value.includes('mac os x')) os = 'macOS';
  else if (value.includes('linux')) os = 'Linux';

  const deviceType = value.includes('mobi') || value.includes('android') || value.includes('iphone') || value.includes('ipad')
    ? 'mobile'
    : 'desktop';

  return { browser, os, deviceType };
};

export const resolveClientInfo = (request: Request, payload: CollectPayload) => {
  const ua = request.headers.get('User-Agent') ?? '';
  const parsed = parseUserAgent(ua);
  const language = payload.language ?? request.headers.get('Accept-Language')?.split(',')[0] ?? null;
  return {
    ua,
    device_type: payload.device_type ?? parsed.deviceType,
    os: payload.os ?? parsed.os,
    browser: payload.browser ?? parsed.browser,
    language,
  };
};
