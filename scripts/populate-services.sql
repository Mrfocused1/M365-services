-- Populate Services table with default data
INSERT INTO services (title, description, is_active) VALUES
  ('24/7 Threat Detection & Rapid Response', 'Advanced monitoring and protection via Microsoft Defender to keep your business safe around the clock.', true),
  ('Advanced Email Protection', 'Comprehensive phishing and spam filtering to protect your team from email-based threats and attacks.', true),
  ('Staff Training', 'Empower your team with security awareness training to stop cyber attacks before they happen.', true)
ON CONFLICT DO NOTHING;

-- Verify
SELECT title FROM services ORDER BY created_at;
