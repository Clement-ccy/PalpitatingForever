export type D1Result<T> = {
  results: T[];
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<{ success: boolean }>;
  first: () => Promise<unknown | null>;
  all: () => Promise<D1Result<unknown>>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

export type Env = {
  DATABASE: D1Database;
  ADMIN_EMAIL: string;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  SITE_SLUG: string;
  ALLOWED_ORIGINS: string;
  ADMIN_SESSION_SECRET: string;
  DATA_SECRET: string;
  COMMENTS_AUTO_APPROVE: string;
  ADMIN_SETUP_TOKEN: string;
  DEV_MODE: string;
};

export type CollectPayload = {
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

export type EventPayload = {
  site: string;
  name: string;
  data?: Record<string, unknown> | null;
} & CollectPayload;

export type CommentSubmitPayload = {
  site: string;
  pageKey: string;
  url: string;
  title?: string | null;
  parentId?: string | null;
  author: {
    name: string;
    url?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
  content: string;
  meta?: {
    os?: string | null;
    browser?: string | null;
    device?: string | null;
    country?: string | null;
  };
};

export type AdminLoginPayload = {
  username: string;
  password: string;
};
