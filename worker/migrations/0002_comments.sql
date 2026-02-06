PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS c_threads (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  page_key TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  comment_count_approved INTEGER NOT NULL DEFAULT 0,
  comment_count_total INTEGER NOT NULL DEFAULT 0,
  last_commented_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_c_threads_site_pagekey ON c_threads(site_id, page_key);

CREATE TABLE IF NOT EXISTS c_comments (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  parent_id TEXT,
  status TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_url TEXT,
  avatar_url TEXT,
  email_plain TEXT,
  ip_plain TEXT,
  ua_plain TEXT,
  os TEXT,
  browser TEXT,
  device TEXT,
  country TEXT,
  content_md TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  approved_at INTEGER,
  reply_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (thread_id) REFERENCES c_threads(id)
);
CREATE INDEX IF NOT EXISTS idx_c_comments_thread_status_created ON c_comments(thread_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_c_comments_parent ON c_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_c_comments_email_created ON c_comments(email_plain, created_at);
CREATE INDEX IF NOT EXISTS idx_c_comments_ip_created ON c_comments(ip_plain, created_at);

CREATE TABLE IF NOT EXISTS c_moderation_log (
  id TEXT PRIMARY KEY,
  comment_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_user_id TEXT NOT NULL,
  reason TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (comment_id) REFERENCES c_comments(id),
  FOREIGN KEY (actor_user_id) REFERENCES admin_users(id)
);
CREATE INDEX IF NOT EXISTS idx_c_modlog_comment_created ON c_moderation_log(comment_id, created_at);
