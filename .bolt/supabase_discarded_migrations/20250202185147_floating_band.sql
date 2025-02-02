-- Test search by reference number
SELECT * FROM search_requests('BUY-');

-- Test search by name/email
SELECT * FROM search_requests('Test User');

-- Test search by phone
SELECT * FROM search_requests('1234567890');

-- Test search by ID
SELECT id FROM requests ORDER BY created_at DESC LIMIT 1 \gset
SELECT * FROM search_requests(:'id');