PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  primary_host TEXT NOT NULL,
  allowed_hosts_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  is_secret INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  pw_hash TEXT NOT NULL,
  pw_salt TEXT NOT NULL,
  pw_iters INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  disabled_at INTEGER
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  csrf_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  ip_plain TEXT,
  ua_plain TEXT,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_expires ON admin_sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_tokenhash ON admin_sessions(token_hash);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO sites (id, slug, primary_host, allowed_hosts_json, created_at, updated_at)
VALUES (
  'site_main',
  'main',
  'ccy.asia',
  '["ccy.asia","www.ccy.asia"]',
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR IGNORE INTO settings (key, value_json, is_secret, updated_at)
VALUES
  ('analytics.retention_days', '90', 0, strftime('%s','now')),
  ('comments.rate_limit_per_10min', '5', 0, strftime('%s','now')),
  ('comments.placeholder', '"Write your comment..."', 0, strftime('%s','now')),
  ('comments.images_enabled', 'false', 0, strftime('%s','now')),
  ('comments.emoji_enabled', 'false', 0, strftime('%s','now')),
  ('comments.katex_enabled', 'false', 0, strftime('%s','now')),
  ('comments.code_enabled', 'false', 0, strftime('%s','now')),
  ('comments.auto_approve', 'false', 0, strftime('%s','now')),
  ('comments.mail_notify', 'true', 0, strftime('%s','now')),
  ('comments.mail_notify_reply', 'true', 0, strftime('%s','now')),
  ('admin.setup_disabled', 'false', 0, strftime('%s','now'));
