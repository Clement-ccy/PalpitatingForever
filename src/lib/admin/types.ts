export type AdminOverview = {
  pageviews: number;
  visitors: number;
  visits: number;
  events: number;
};

export type AdminComment = {
  id: string;
  page_key: string;
  author_name: string;
  author_url: string | null;
  avatar_url: string | null;
  content_md: string;
  created_at: number;
  status: string;
  email_plain?: string | null;
  ip_plain?: string | null;
  ua_plain?: string | null;
  os?: string | null;
  browser?: string | null;
  device?: string | null;
  country?: string | null;
};

export type AdminSettingsItem = {
  key: string;
  value_json: string;
  is_secret: number;
};

export type AdminSetupStatus = {
  setupDisabled: boolean;
};

export type AdminLoginResponse = {
  csrf?: string;
};

export type AdminCommentAction = 'approve' | 'hide' | 'delete';

export type AnalyticsItem = {
  name: string;
  views?: number;
  visitors?: number;
  count?: number;
};

export type AnalyticsOverview = {
  pageviews: number;
  visits: number;
  visitors: number;
  events: number;
};

export type CommentOverview = {
  total: number;
  approved: number;
  pending: number;
  hidden: number;
};
