-- Supabase analytics tables (run in Supabase SQL editor)

CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug TEXT NOT NULL,
  project_id TEXT,
  event_type TEXT NOT NULL,
  session_id TEXT,
  pathname TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS engagement_events_project_slug_idx
  ON engagement_events (project_slug);
CREATE INDEX IF NOT EXISTS engagement_events_event_type_idx
  ON engagement_events (event_type);
CREATE INDEX IF NOT EXISTS engagement_events_created_at_idx
  ON engagement_events (created_at DESC);

ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx
  ON inquiries (created_at DESC);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
