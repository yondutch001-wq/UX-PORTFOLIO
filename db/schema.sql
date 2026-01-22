CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client TEXT,
  year TEXT,
  category TEXT,
  role TEXT,
  duration TEXT,
  tools JSONB NOT NULL DEFAULT '[]',
  team TEXT,
  summary TEXT,
  overview TEXT,
  problem TEXT,
  goals JSONB NOT NULL DEFAULT '[]',
  responsibilities JSONB NOT NULL DEFAULT '[]',
  approach JSONB NOT NULL DEFAULT '[]',
  solution TEXT,
  outcome TEXT,
  highlights JSONB NOT NULL DEFAULT '[]',
  metrics JSONB NOT NULL DEFAULT '[]',
  tags JSONB NOT NULL DEFAULT '[]',
  cover JSONB NOT NULL DEFAULT '{"background": "#0f172a", "foreground": "#ffffff"}',
  cover_image_url TEXT,
  figma_embed TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
