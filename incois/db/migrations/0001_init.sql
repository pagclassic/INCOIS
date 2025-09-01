-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citizen','volunteer','official','analyst','admin')),
  phone TEXT,
  email TEXT,
  language TEXT,
  reputation_score DOUBLE PRECISION DEFAULT 0,
  verified_volunteer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  geom geometry(Point, 4326) NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('tsunami','high_waves','flood','unusual_tide','debris','distress','other')),
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'unverified' CHECK (status IN ('unverified','community_confirmed','verified','false','duplicate','escalated')),
  verification_score DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_geom ON reports USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_reports_time ON reports (timestamp);

-- media
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image','video')),
  thumbnail TEXT,
  hash TEXT
);

-- verifications
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  verifier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('official','community')),
  decision TEXT NOT NULL CHECK (decision IN ('verified','false','escalated','duplicate')),
  comment TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- social_posts
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  user_handle TEXT,
  text TEXT,
  geom geometry(Point, 4326),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  sentiment DOUBLE PRECISION,
  classification_tags TEXT[]
);
CREATE INDEX IF NOT EXISTS idx_social_geom ON social_posts USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_social_time ON social_posts (timestamp);

-- hotspots
CREATE TABLE IF NOT EXISTS hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geom geometry(Polygon, 4326) NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  related_reports UUID[]
);
CREATE INDEX IF NOT EXISTS idx_hotspots_geom ON hotspots USING GIST (geom);

-- events (aggregated incidents)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  geom geometry(Polygon, 4326),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  report_ids UUID[],
  social_ids UUID[]
);

