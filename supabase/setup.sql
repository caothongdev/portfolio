-- =============================================================================
-- SUPABASE DATABASE SETUP SCRIPT
-- =============================================================================
-- Run this script in your Supabase SQL Editor
-- Project: peomrgwnmaqbsvumtcws
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- BLOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  image_alt VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time INTEGER DEFAULT 0,
  date VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ACTIVITIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- VIEWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blog_slug VARCHAR(500) UNIQUE NOT NULL,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_views_blog_slug ON views(blog_slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================================================
-- TRIGGER FUNCTION FOR UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- APPLY TRIGGERS
-- =============================================================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON blogs
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_views_updated_at ON views;
CREATE TRIGGER update_views_updated_at 
  BEFORE UPDATE ON views
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON blogs;
DROP POLICY IF EXISTS "Activities viewable by authenticated users" ON activities;
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON activities;
DROP POLICY IF EXISTS "Views are viewable by everyone" ON views;
DROP POLICY IF EXISTS "Views can be updated by anyone" ON views;
DROP POLICY IF EXISTS "Views can be inserted by anyone" ON views;

-- Blogs policies
CREATE POLICY "Public blogs are viewable by everyone"
  ON blogs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role can do everything on blogs"
  ON blogs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Activities policies
CREATE POLICY "Service role can do everything on activities"
  ON activities FOR ALL
  USING (true)
  WITH CHECK (true);

-- Views policies (public can read and update view counts)
CREATE POLICY "Views are viewable by everyone"
  ON views FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update view counts"
  ON views FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert view counts"
  ON views FOR INSERT
  WITH CHECK (true);

-- Users policies (only service role)
CREATE POLICY "Service role can do everything on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- CREATE ADMIN USER
-- =============================================================================
-- Email: admin@portfolio.com
-- Password: Admin123!
-- You should change this password after first login

INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@portfolio.com',
  '$2b$10$/cwdaL0MgWyPTZhFcjGFVOQNebLIrh.oKY55Q3gG1.3p8jm0aevSS',
  'Admin User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check if admin user exists
SELECT email, name, role, created_at 
FROM users 
WHERE role = 'admin';

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================
-- Next steps:
-- 1. Get your Supabase API keys from Settings > API
-- 2. Update .env.local with the actual keys
-- 3. Test the connection with: npm run dev
-- =============================================================================
