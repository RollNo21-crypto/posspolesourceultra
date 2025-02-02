-- Drop triggers first
DROP TRIGGER IF EXISTS set_request_reference_number_trigger ON requests;
DROP TRIGGER IF EXISTS set_seller_reference_number_trigger ON seller_requests;

-- Now we can safely drop functions
DROP FUNCTION IF EXISTS generate_reference_number(text);
DROP FUNCTION IF EXISTS set_request_reference_number();
DROP FUNCTION IF EXISTS set_seller_reference_number();
DROP FUNCTION IF EXISTS search_reference_numbers(text);
DROP FUNCTION IF EXISTS search_requests(text);

-- Drop existing indexes
DROP INDEX IF EXISTS idx_requests_reference_number;
DROP INDEX IF EXISTS idx_seller_requests_reference_number;
DROP INDEX IF EXISTS idx_requests_reference_number_search;
DROP INDEX IF EXISTS idx_seller_requests_reference_number_search;

-- Drop existing constraints
ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_reference_number_unique;
ALTER TABLE seller_requests DROP CONSTRAINT IF EXISTS seller_requests_reference_number_unique;

-- Drop reference_number columns
ALTER TABLE requests DROP COLUMN IF EXISTS reference_number;
ALTER TABLE seller_requests DROP COLUMN IF EXISTS reference_number;

-- Add search function for requests
CREATE OR REPLACE FUNCTION search_requests(search_query text)
RETURNS TABLE (
  id uuid,
  type text,
  created_at timestamptz,
  source text,
  user_name text,
  user_email text,
  user_phone text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.type,
    r.created_at,
    'request'::text as source,
    r.user_name,
    r.user_email,
    r.user_phone,
    r.status
  FROM requests r
  WHERE 
    r.id::text ILIKE '%' || search_query || '%'
    OR r.user_name ILIKE '%' || search_query || '%'
    OR r.user_email ILIKE '%' || search_query || '%'
    OR r.user_phone ILIKE '%' || search_query || '%'
  UNION ALL
  SELECT 
    s.id,
    'seller'::text,
    s.created_at,
    'seller'::text,
    s.contact_name,
    s.email,
    s.phone,
    s.status
  FROM seller_requests s
  WHERE 
    s.id::text ILIKE '%' || search_query || '%'
    OR s.contact_name ILIKE '%' || search_query || '%'
    OR s.email ILIKE '%' || search_query || '%'
    OR s.phone ILIKE '%' || search_query || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;