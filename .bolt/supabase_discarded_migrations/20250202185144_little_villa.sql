-- Test reference number generation for requests
INSERT INTO requests (
  user_name,
  user_email,
  user_phone,
  type,
  status
) VALUES (
  'Test User',
  'test@example.com',
  '1234567890',
  'buy',
  'pending'
);

-- Test reference number generation for seller requests
INSERT INTO seller_requests (
  company_name,
  contact_name,
  email,
  phone,
  business_description,
  product_categories,
  status
) VALUES (
  'Test Company',
  'Test Contact',
  'test@company.com',
  '1234567890',
  'Test Description',
  'Test Categories',
  'pending'
);

-- Verify reference numbers were generated
SELECT id, reference_number, type FROM requests ORDER BY created_at DESC LIMIT 1;
SELECT id, reference_number FROM seller_requests ORDER BY created_at DESC LIMIT 1;