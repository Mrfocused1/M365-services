-- Add new tables for benefits and testimonials

-- Benefits (for Why Choose section)
CREATE TABLE IF NOT EXISTS benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_company TEXT NOT NULL,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_benefits_position ON benefits(position);
CREATE INDEX IF NOT EXISTS idx_testimonials_position ON testimonials(position);

-- Enable Row Level Security
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON benefits;
DROP POLICY IF EXISTS "Allow public read" ON testimonials;
DROP POLICY IF EXISTS "Allow all operations" ON benefits;
DROP POLICY IF EXISTS "Allow all operations" ON testimonials;

-- Create policies
CREATE POLICY "Allow public read" ON benefits FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON benefits FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON testimonials FOR ALL USING (true);

-- Insert default data
INSERT INTO benefits (title, description, image_url, position, is_active) VALUES
  ('Scalability', 'Pay only for what you need and grow later', '/scalability.jpeg', 1, true),
  ('Secure', 'Enterprise-grade security for your business', '/secure.jpeg', 2, true),
  ('Cost-Effective', 'Reduce IT costs with cloud solutions', '/cost.jpeg', 3, true),
  ('Productivity-Boosting', 'Empower your team to work smarter', '/productivity.jpeg', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (author_name, author_role, author_company, text, position, is_active) VALUES
  ('Sarah L.', 'Operations Director', 'London Design Co.', 'M365 IT Services completely transformed how our remote team works — fast, secure, and seamless!', 1, true),
  ('James T.', 'CEO', 'TechStart Solutions', 'Their expertise in Microsoft 365 helped us scale efficiently without the IT headaches. Highly recommended!', 2, true),
  ('Emma R.', 'Managing Partner', 'Brighton Consultancy', 'Finally, an IT partner that understands SMBs. Professional, responsive, and cost-effective.', 3, true)
ON CONFLICT DO NOTHING;
