PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS umami_session (
  session_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  device TEXT,
  screen TEXT,
  language TEXT,
  country TEXT,
  distinct_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_created ON umami_session(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_browser ON umami_session(site_id, created_at, browser);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_os ON umami_session(site_id, created_at, os);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_device ON umami_session(site_id, created_at, device);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_country ON umami_session(site_id, created_at, country);
CREATE INDEX IF NOT EXISTS idx_umami_session_site_distinct ON umami_session(site_id, distinct_id);

CREATE TABLE IF NOT EXISTS umami_event (
  event_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  visit_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  url_path TEXT NOT NULL,
  url_query TEXT,
  referrer_domain TEXT,
  page_title TEXT,
  hostname TEXT,
  event_type INTEGER NOT NULL,
  event_name TEXT,
  data_json TEXT,
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (session_id) REFERENCES umami_session(session_id)
);
CREATE INDEX IF NOT EXISTS idx_umami_event_site_created ON umami_event(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_umami_event_site_path ON umami_event(site_id, created_at, url_path);
CREATE INDEX IF NOT EXISTS idx_umami_event_site_ref ON umami_event(site_id, created_at, referrer_domain);
CREATE INDEX IF NOT EXISTS idx_umami_event_site_event ON umami_event(site_id, created_at, event_name);
CREATE INDEX IF NOT EXISTS idx_umami_event_site_visit ON umami_event(site_id, visit_id, created_at);

CREATE TABLE IF NOT EXISTS comment_event (
  event_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  comment_id TEXT,
  created_at INTEGER NOT NULL,
  url_path TEXT NOT NULL,
  referrer_domain TEXT,
  device TEXT,
  os TEXT,
  browser TEXT,
  country TEXT,
  event_type INTEGER NOT NULL,
  event_name TEXT,
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (thread_id) REFERENCES c_threads(id),
  FOREIGN KEY (comment_id) REFERENCES c_comments(id)
);
CREATE INDEX IF NOT EXISTS idx_comment_event_site_created ON comment_event(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comment_event_site_path ON comment_event(site_id, created_at, url_path);
CREATE INDEX IF NOT EXISTS idx_comment_event_site_event ON comment_event(site_id, created_at, event_type);
