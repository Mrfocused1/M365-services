-- Populate M365 Features
INSERT INTO m365_features (title, description, icon_name, image_url, position, is_active) VALUES
  ('Seamless Migration', 'Move emails, files, and data from your old systems to Microsoft 365. Done in a way that avoids downtime, so your business keeps running.', 'Cloud', '/cloud.jpeg', 1, true),
  ('M365 Setup & Domain Verification', 'Set up Microsoft 365 accounts for your team. Connect and verify your business domain (so your email looks professional, e.g. yourname@yourcompany.com).', 'Shield', '/support.jpeg', 2, true),
  ('Teams, SharePoint & OneDrive Setup', 'Configure Teams for chat, calls, and meetings. Set up SharePoint for document sharing and team sites. Configure OneDrive for personal file storage and access from anywhere.', 'Headphones', '/training.jpeg', 3, true),
  ('Security & Compliance', 'Apply Microsoft 365 security features (MFA, threat protection, encryption). Configure compliance settings to meet regulations (GDPR-ready). Protects your data and builds customer trust.', 'Shield', '/security.jpeg', 4, true)
ON CONFLICT DO NOTHING;

-- Populate Cloud Solutions
INSERT INTO cloud_solutions (title, description, icon_name, position, is_active) VALUES
  ('Secure Backups & Disaster Recovery', 'Use Microsoft 365 Backup to keep business data safe. Quick recovery options in case of data loss or system failure.', 'Cloud', 1, true),
  ('Remote & Secure Access', 'Enable staff to work from anywhere. Protected sign-ins and secure connections for remote work.', 'Lock', 2, true),
  ('Endpoint Deployment & Management (via Intune)', 'Install and manage business apps across all company devices. Keep devices updated and secure from a single dashboard.', 'Smartphone', 3, true),
  ('Email Security & Collaboration', 'Apply Defender 365 email policies. Reduce phishing, spam, and malware risks. Ensure safe, reliable business communication.', 'Mail', 4, true),
  ('Endpoint Cybersecurity (via Defender for Endpoint)', 'Protect laptops, PCs, and mobile devices from cyber threats. Monitor and respond quickly to security issues.', 'Shield', 5, true),
  ('Microsoft Teams Telephony', 'Set up Auto Attendants (virtual receptionists) and Call Queues (direct calls to the right team). Implement Teams Calling Plans or Operator Connect for business phone systems.', 'Phone', 6, true),
  ('Single Sign-On (SSO) for External Apps', 'One login for Microsoft 365 and external services. Simplifies access for users and boosts security.', 'Key', 7, true)
ON CONFLICT DO NOTHING;

-- Populate Cybersecurity Services
INSERT INTO cybersecurity_services (title, description, icon_name, position, is_active) VALUES
  ('24/7 Threat Detection & Rapid Response', '24/7 threat detection and rapid response to cyber incidents via MS Defender', 'Shield', 1, true),
  ('Advanced Email Protection', 'Advanced email protection against phishing and spam.', 'Mail', 2, true),
  ('Staff Training', 'Staff training to stop attacks before they happen.', 'GraduationCap', 3, true)
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT 'M365 Features' as table_name, COUNT(*) as count FROM m365_features
UNION ALL
SELECT 'Cloud Solutions', COUNT(*) FROM cloud_solutions
UNION ALL
SELECT 'Cybersecurity Services', COUNT(*) FROM cybersecurity_services;
