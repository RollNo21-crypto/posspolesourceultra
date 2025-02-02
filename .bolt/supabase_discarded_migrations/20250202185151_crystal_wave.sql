-- Remove test data
DELETE FROM requests WHERE user_email = 'test@example.com';
DELETE FROM seller_requests WHERE email = 'test@company.com';