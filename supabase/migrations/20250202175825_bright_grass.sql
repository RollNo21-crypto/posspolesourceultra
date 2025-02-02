-- Enable text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Add indexes for reference number search
CREATE INDEX IF NOT EXISTS idx_requests_reference_number_search 
ON requests USING btree(reference_number);

CREATE INDEX IF NOT EXISTS idx_seller_requests_reference_number_search 
ON seller_requests USING btree(reference_number);

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
CREATE OR REPLACE FUNCTION search_reference_numbers(search_query text)
RETURNS TABLE (
  reference_number text,
  type text,
  created_at timestamptz,
  source text
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.reference_number, r.type, r.created_at, 'request'::text as source
  FROM requests r
  WHERE r.reference_number ILIKE '%' || search_query || '%'
  UNION ALL
  SELECT s.reference_number, 'seller'::text, s.created_at, 'seller'::text
  FROM seller_requests s
  WHERE s.reference_number ILIKE '%' || search_query || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;