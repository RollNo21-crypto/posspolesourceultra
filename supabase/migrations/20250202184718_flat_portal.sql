-- Drop existing triggers first
DROP TRIGGER IF EXISTS set_request_reference_number_trigger ON requests;
DROP TRIGGER IF EXISTS set_seller_reference_number_trigger ON seller_requests;

-- Drop existing functions
DROP FUNCTION IF EXISTS generate_reference_number(text);
DROP FUNCTION IF EXISTS set_request_reference_number();
DROP FUNCTION IF EXISTS set_seller_reference_number();
DROP FUNCTION IF EXISTS search_requests(text);

-- Add reference_number column to requests and seller_requests tables
ALTER TABLE requests
DROP COLUMN IF EXISTS reference_number;

ALTER TABLE seller_requests
DROP COLUMN IF EXISTS reference_number;

ALTER TABLE requests
ADD COLUMN reference_number text UNIQUE;

ALTER TABLE seller_requests
ADD COLUMN reference_number text UNIQUE;

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

-- Create indexes for better search performance
DROP INDEX IF EXISTS idx_requests_reference_number;
DROP INDEX IF EXISTS idx_seller_requests_reference_number;

CREATE INDEX idx_requests_reference_number 
ON requests(reference_number);

CREATE INDEX idx_seller_requests_reference_number 
ON seller_requests(reference_number);

-- Update existing records with reference numbers
UPDATE requests
SET reference_number = CASE
  WHEN type = 'buy' THEN generate_reference_number('BUY')
  WHEN type = 'donate' THEN generate_reference_number('DON')
  ELSE generate_reference_number('REQ')
END
WHERE reference_number IS NULL;

UPDATE seller_requests
SET reference_number = generate_reference_number('SEL')
WHERE reference_number IS NULL;

-- Create search function
CREATE OR REPLACE FUNCTION search_requests(search_query text)
RETURNS TABLE (
  id uuid,
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
    r.id,
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
    OR r.id::text = search_query
  UNION ALL
  SELECT 
    s.id,
    s.reference_number,
    'seller'::text as type,
    s.created_at,
    'seller'::text as source,
    s.contact_name as user_name,
    s.email as user_email,
    s.phone as user_phone,
    s.status
  FROM seller_requests s
  WHERE 
    s.reference_number ILIKE '%' || search_query || '%'
    OR s.contact_name ILIKE '%' || search_query || '%'
    OR s.email ILIKE '%' || search_query || '%'
    OR s.phone ILIKE '%' || search_query || '%'
    OR s.id::text = search_query
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;