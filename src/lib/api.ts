const normalizeBaseUrl = (value: string) => {
  if (!value) return '';
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.ccy.asia'
);

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
