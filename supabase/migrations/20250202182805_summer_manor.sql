-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS set_request_reference_number_trigger ON requests;
DROP TRIGGER IF EXISTS set_seller_reference_number_trigger ON seller_requests;
DROP FUNCTION IF EXISTS generate_reference_number(text);
DROP FUNCTION IF EXISTS set_request_reference_number();
DROP FUNCTION IF EXISTS set_seller_reference_number();
DROP FUNCTION IF EXISTS search_requests(text);
DROP FUNCTION IF EXISTS search_reference_numbers(text);

-- Create function to generate reference numbers
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

-- Create trigger functions
CREATE OR REPLACE FUNCTION set_request_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := CASE
      WHEN NEW.type = 'buy' THEN generate_reference_number('BUY')
      WHEN NEW.type = 'donate' THEN generate_reference_number('DON')
      ELSE generate_reference_number('REQ')
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_seller_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_reference_number('SEL');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_request_reference_number_trigger
  BEFORE INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_reference_number();

CREATE TRIGGER set_seller_reference_number_trigger
  BEFORE INSERT ON seller_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_seller_reference_number();

-- Create search function
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