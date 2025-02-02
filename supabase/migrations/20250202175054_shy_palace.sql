-- Add reference_number columns if they don't exist
ALTER TABLE requests
ADD COLUMN IF NOT EXISTS reference_number text;

ALTER TABLE seller_requests
ADD COLUMN IF NOT EXISTS reference_number text;

-- Create function for generating reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number(prefix text)
RETURNS text AS $$
BEGIN
  RETURN prefix || '-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));
END;
$$ LANGUAGE plpgsql;