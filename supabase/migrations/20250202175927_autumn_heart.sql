-- Enable text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add indexes for reference number search
CREATE INDEX IF NOT EXISTS idx_requests_reference_number_search 
ON requests USING btree(reference_number);

CREATE INDEX IF NOT EXISTS idx_seller_requests_reference_number_search 
ON seller_requests USING btree(reference_number);

-- Add indexes for other searchable fields
CREATE INDEX IF NOT EXISTS idx_requests_user_name_search
ON requests USING btree(user_name);

CREATE INDEX IF NOT EXISTS idx_requests_user_email_search
ON requests USING btree(user_email);

CREATE INDEX IF NOT EXISTS idx_requests_user_phone_search
ON requests USING btree(user_phone);

-- Update reference number format function
CREATE OR REPLACE FUNCTION generate_reference_number(prefix text)
RETURNS text AS $$
DECLARE
  timestamp_part text;
  random_part text;
BEGIN
  timestamp_part := to_char(now(), 'YYYYMMDD');
  random_part := upper(substring(md5(random()::text) from 1 for 6));
  RETURN prefix || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Add search function for reference numbers
CREATE OR REPLACE FUNCTION search_requests(search_query text)
RETURNS TABLE (
  reference_number text,
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
    r.reference_number,
    r.type,
    r.created_at,
    'request'::text as source,
    r.user_name,
    r.user_email,
    r.user_phone,
    r.status
  FROM requests r
  WHERE 
    r.reference_number ILIKE '%' || search_query || '%'
    OR r.user_name ILIKE '%' || search_query || '%'
    OR r.user_email ILIKE '%' || search_query || '%'
    OR r.user_phone ILIKE '%' || search_query || '%'
  UNION ALL
  SELECT 
    s.reference_number,
    'seller'::text,
    s.created_at,
    'seller'::text,
    s.contact_name,
    s.email,
    s.phone,
    s.status
  FROM seller_requests s
  WHERE 
    s.reference_number ILIKE '%' || search_query || '%'
    OR s.contact_name ILIKE '%' || search_query || '%'
    OR s.email ILIKE '%' || search_query || '%'
    OR s.phone ILIKE '%' || search_query || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;