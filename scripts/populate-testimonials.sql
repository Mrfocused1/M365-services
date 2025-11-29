-- Populate testimonials table with default data
INSERT INTO testimonials (author_name, author_role, author_company, text, position, is_active) VALUES
  ('Sarah L.', 'Operations Director', 'London Design Co.', 'M365 IT Services completely transformed how our remote team works — fast, secure, and seamless!', 1, true),
  ('James T.', 'CEO', 'TechStart Solutions', 'Their expertise in Microsoft 365 helped us scale efficiently without the IT headaches. Highly recommended!', 2, true),
  ('Emma R.', 'Managing Partner', 'Brighton Consultancy', 'Finally, an IT partner that understands SMBs. Professional, responsive, and cost-effective.', 3, true)
ON CONFLICT DO NOTHING;
