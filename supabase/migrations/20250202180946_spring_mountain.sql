-- Drop existing search function
DROP FUNCTION IF EXISTS search_requests(text);

-- Create improved search function
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
    r.user_name ILIKE '%' || search_query || '%'
    OR r.user_email ILIKE '%' || search_query || '%'
    OR r.user_phone ILIKE '%' || search_query || '%'
    OR r.id::text = search_query
  UNION ALL
  SELECT 
    s.id,
    'seller'::text as type,
    s.created_at,
    'seller'::text as source,
    s.contact_name as user_name,
    s.email as user_email,
    s.phone as user_phone,
    s.status
  FROM seller_requests s
  WHERE 
    s.contact_name ILIKE '%' || search_query || '%'
    OR s.email ILIKE '%' || search_query || '%'
    OR s.phone ILIKE '%' || search_query || '%'
    OR s.id::text = search_query
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;