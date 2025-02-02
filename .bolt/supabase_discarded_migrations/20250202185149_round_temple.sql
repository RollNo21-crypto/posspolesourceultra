-- Test index usage for reference number searches
EXPLAIN ANALYZE
SELECT * FROM requests WHERE reference_number ILIKE 'BUY-%';

-- Test index usage for user searches
EXPLAIN ANALYZE
SELECT * FROM requests WHERE user_name ILIKE '%Test%';

-- Test index usage for seller searches
EXPLAIN ANALYZE
SELECT * FROM seller_requests WHERE contact_name ILIKE '%Test%';