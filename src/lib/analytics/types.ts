export type AnalyticsCollectPayload = {
  site: string;
  path: string;
  title?: string | null;
  referrer?: string | null;
  url?: string | null;
  language?: string | null;
  screen?: string | null;
  tz?: string | null;
  device_type?: string | null;
  os?: string | null;
  browser?: string | null;
  country?: string | null;
};

export type AnalyticsOverviewResponse = {
  pageviews: number;
  visitors: number;
  visits: number;
  events: number;
};

export type AnalyticsEventPayload = {
  site: string;
  name: string;
  data?: Record<string, unknown> | null;
} & AnalyticsCollectPayload;
