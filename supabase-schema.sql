-- M365 IT Services Website Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hero Section Content
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  video_url TEXT,
  cta_text TEXT DEFAULT 'Get Started',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Navigation Menu
CREATE TABLE navigation_menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About/M365 Partner Features
CREATE TABLE m365_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cloud Solutions (Accordion Items)
CREATE TABLE cloud_solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cybersecurity Protection Services
CREATE TABLE cybersecurity_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Why Choose Us Features
CREATE TABLE why_choose_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benefits (for Why Choose section)
CREATE TABLE benefits (
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
CREATE TABLE testimonials (
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

-- Services (General Services Section)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Information
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT,
  email TEXT,
  address TEXT,
  business_hours TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Content
CREATE TABLE footer_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT,
  tagline TEXT,
  copyright_text TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Links
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL, -- 'company', 'services', 'support', 'legal'
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL, -- 'linkedin', 'twitter', 'facebook', etc.
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form Submissions
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Library
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video'
  alt_text TEXT,
  used_in TEXT[], -- Array of component names where this media is used
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data for Hero Section
INSERT INTO hero_content (headline, subheadline, video_url) VALUES (
  'Professional IT Services & Microsoft 365 Solutions',
  'Transform your business with expert IT support, cloud migration, and comprehensive M365 implementation',
  '/video.mp4'
);

-- Insert default navigation menu
INSERT INTO navigation_menu (label, href, position) VALUES
  ('Home', '#home', 1),
  ('Services', '#services', 2),
  ('About', '#about', 3),
  ('Contact', '#contact', 4);

-- Insert default contact info
INSERT INTO contact_info (phone_number, email, business_hours) VALUES (
  '020 4582 5950',
  'info@m365itservices.com',
  'Mon-Fri: 9AM-6PM'
);

-- Insert default footer content
INSERT INTO footer_content (company_name, tagline, copyright_text) VALUES (
  'M365 IT Services',
  'Your trusted partner for Microsoft 365 solutions and IT support',
  '© 2024 M365 IT Services. All rights reserved.'
);

-- Create indexes for better query performance
CREATE INDEX idx_navigation_position ON navigation_menu(position);
CREATE INDEX idx_m365_features_position ON m365_features(position);
CREATE INDEX idx_cloud_solutions_position ON cloud_solutions(position);
CREATE INDEX idx_cybersecurity_position ON cybersecurity_services(position);
CREATE INDEX idx_why_choose_position ON why_choose_features(position);
CREATE INDEX idx_benefits_position ON benefits(position);
CREATE INDEX idx_testimonials_position ON testimonials(position);
CREATE INDEX idx_footer_links_section ON footer_links(section, position);
CREATE INDEX idx_form_submissions_created ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_read ON form_submissions(is_read);

-- Enable Row Level Security (RLS) - We'll keep it disabled for the admin to work freely
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE m365_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybersecurity_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access and admin write access
-- For public read access (everyone can read)
CREATE POLICY "Allow public read" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON navigation_menu FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON m365_features FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON cloud_solutions FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON cybersecurity_services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON why_choose_features FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON benefits FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON footer_content FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON footer_links FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON media_library FOR SELECT USING (true);

-- For admin access (allow all operations from admin)
CREATE POLICY "Allow all operations" ON hero_content FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON navigation_menu FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON m365_features FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON cloud_solutions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON cybersecurity_services FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON why_choose_features FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON benefits FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contact_info FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON footer_content FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON footer_links FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON social_links FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON form_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON media_library FOR ALL USING (true);
