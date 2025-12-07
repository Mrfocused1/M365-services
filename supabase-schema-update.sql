-- =============================================
-- M365 IT Services - Schema Update
-- Run this in your Supabase SQL Editor
-- =============================================

-- Team Members (Meet the Team Section)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Section Settings (visibility toggles for sections)
CREATE TABLE IF NOT EXISTS section_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Content
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Your Perfect IT M365 Partner',
  hero_subtitle TEXT NOT NULL DEFAULT 'I help small and medium-sized businesses transform the way they work by making technology simple, secure, and productive.',
  hero_description TEXT,
  section_title TEXT DEFAULT 'Your Perfect IT M365 Partner',
  section_subtitle TEXT DEFAULT 'We help small and medium-sized businesses transform the way they work by making technology simple, secure, and productive.',
  cta_title TEXT DEFAULT 'Ready to Transform Your Business?',
  cta_subtitle TEXT DEFAULT 'Let''s discuss how our M365 solutions can help you work smarter, safer, and more efficiently.',
  cta_button_text TEXT DEFAULT 'Get Started Today',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats/Metrics Section
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value DECIMAL NOT NULL,
  suffix TEXT DEFAULT '',
  decimals INTEGER DEFAULT 0,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Values (Client-Focused, Security First, etc.)
CREATE TABLE IF NOT EXISTS about_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Create Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_team_members_position ON team_members(position);
CREATE INDEX IF NOT EXISTS idx_site_stats_position ON site_stats(position);
CREATE INDEX IF NOT EXISTS idx_about_values_position ON about_values(position);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create Policies (Public Read + Admin Write)
-- =============================================
-- Public read access
CREATE POLICY "Allow public read" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON section_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON site_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON about_values FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Allow all operations" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON section_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON about_content FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON site_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON about_values FOR ALL USING (true);

-- =============================================
-- Insert Default Data
-- =============================================

-- Default section settings
INSERT INTO section_settings (section_key, is_visible) VALUES ('team', true)
ON CONFLICT (section_key) DO NOTHING;

-- Default about content
INSERT INTO about_content (hero_title, hero_subtitle, hero_description) VALUES (
  'Your Perfect IT M365 Partner',
  'I help small and medium-sized businesses transform the way they work by making technology simple, secure, and productive.',
  'From moving your emails and files to the cloud, to securing your business from cyber threats, to giving your team the tools they need to work from anywhere — I handle it all so you can focus on running your business, not your IT via M365 Services.'
) ON CONFLICT DO NOTHING;

-- Default stats
INSERT INTO site_stats (label, value, suffix, decimals, position) VALUES
  ('Happy Clients', 150, '+', 0, 1),
  ('Uptime', 99.9, '%', 1, 2),
  ('Support', 24, '/7', 0, 3)
ON CONFLICT DO NOTHING;

-- Default about values
INSERT INTO about_values (title, description, icon_name, position) VALUES
  ('Client-Focused', 'Your success is our priority. We tailor every solution to fit your unique business needs.', 'Users', 1),
  ('Security First', 'Protecting your data and business with enterprise-grade security measures.', 'Shield', 2),
  ('Cloud Experts', 'Specializing in Microsoft 365 cloud solutions that scale with your business.', 'Cloud', 3),
  ('Always Available', '24/7 support to ensure your business never stops running smoothly.', 'HeartHandshake', 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- Done! Your new tables are ready.
-- =============================================
