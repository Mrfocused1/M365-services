-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_testimonials BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (show_testimonials) VALUES (true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON site_settings;
DROP POLICY IF EXISTS "Allow all operations" ON site_settings;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

-- Create policy to allow all operations (for admin dashboard)
CREATE POLICY "Allow all operations" ON site_settings
  FOR ALL USING (true);
