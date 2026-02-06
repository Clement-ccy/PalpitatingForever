import type { Env } from './types';

export const jsonResponse = (data: unknown, status = 200, headers: HeadersInit = {}) => (
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  })
);

export const parseOrigins = (value: string | undefined): string[] => (
  value
    ? value.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []
);

export const withCors = (request: Request, env: Env, response: Response) => {
  const origin = request.headers.get('Origin') ?? '';
  const allowedOrigins = parseOrigins(env.ALLOWED_ORIGINS);
  const requestHost = new URL(request.url).hostname;
  const isLocalHost = requestHost === '127.0.0.1' || requestHost === 'localhost';
  const allowOrigin = origin
    ? (env.DEV_MODE === 'true' || isLocalHost || allowedOrigins.includes(origin))
      ? origin
      : ''
    : (env.DEV_MODE === 'true' ? '*' : (allowedOrigins.length === 0 ? '*' : ''));

  const headers = new Headers(response.headers);
  if (allowOrigin) {
    headers.set('Access-Control-Allow-Origin', allowOrigin);
    headers.set('Vary', 'Origin');
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

export const handleOptions = (request: Request, env: Env) => (
  withCors(request, env, new Response(null, { status: 204 }))
);
