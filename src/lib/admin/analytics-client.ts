import type { AnalyticsItem, AnalyticsOverview, CommentOverview } from './types';
export type { AnalyticsItem, AnalyticsOverview, CommentOverview };

export type TimeseriesPoint = {
  day: string;
  pageviews: number;
  visitors: number;
  visits: number;
  events: number;
};

export type RetentionPoint = {
  day: string;
  visitors: number;
};

export type CommentTimeseriesPoint = {
  day: string;
  count: number;
};

const csrfHeader = (csrf: string) => ({ 'X-CSRF-Token': csrf });

const buildQuery = (params?: { start?: number; end?: number; limit?: number }) => {
  if (!params) return '';
  const search = new URLSearchParams();
  if (params.start) search.set('start', params.start.toString());
  if (params.end) search.set('end', params.end.toString());
  if (params.limit) search.set('limit', params.limit.toString());
  const query = search.toString();
  return query ? `?${query}` : '';
};

export async function fetchUmamiOverview(csrf: string, params?: { start?: number; end?: number }): Promise<AnalyticsOverview | null> {
  const response = await fetch(`/api/admin/analytics/umami/overview${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return null;
  const data = await response.json() as { overview?: AnalyticsOverview };
  return data.overview ?? null;
}

export async function fetchUmamiPages(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/pages${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiReferrers(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/referrers${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiEvents(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/events${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiDevices(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/devices${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiOs(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/os${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiBrowsers(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/browsers${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiCountries(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/analytics/umami/countries${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiTimeseries(csrf: string, params?: { start?: number; end?: number }): Promise<TimeseriesPoint[]> {
  const response = await fetch(`/api/admin/analytics/umami/timeseries${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: TimeseriesPoint[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchUmamiRetention(csrf: string, params?: { start?: number; end?: number }): Promise<RetentionPoint[]> {
  const response = await fetch(`/api/admin/analytics/umami/retention${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: RetentionPoint[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentReferrers(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/referrers${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentTimeseries(csrf: string, params?: { start?: number; end?: number }): Promise<CommentTimeseriesPoint[]> {
  const response = await fetch(`/api/admin/comments/analytics/timeseries${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: CommentTimeseriesPoint[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentOverview(csrf: string, params?: { start?: number; end?: number }): Promise<CommentOverview | null> {
  const response = await fetch(`/api/admin/comments/analytics/overview${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return null;
  const data = await response.json() as { overview?: CommentOverview };
  return data.overview ?? null;
}

export async function fetchCommentPages(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/pages${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentDevices(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/devices${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentOs(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/os${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentBrowsers(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/browsers${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentCountries(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/countries${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchCommentEvents(csrf: string, params?: { start?: number; end?: number; limit?: number }): Promise<AnalyticsItem[]> {
  const response = await fetch(`/api/admin/comments/analytics/events${buildQuery(params)}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { items?: AnalyticsItem[] };
  return Array.isArray(data.items) ? data.items : [];
}
