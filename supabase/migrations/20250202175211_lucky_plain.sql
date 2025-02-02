-- Drop existing constraints if they exist
ALTER TABLE requests
DROP CONSTRAINT IF EXISTS requests_reference_number_unique;

ALTER TABLE seller_requests
DROP CONSTRAINT IF EXISTS seller_requests_reference_number_unique;

-- Update existing records with new reference numbers
UPDATE requests
SET reference_number = CASE
  WHEN type = 'buy' THEN 'BUY-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6))
  WHEN type = 'donate' THEN 'DON-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6))
  ELSE 'REQ-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6))
END
WHERE reference_number IS NULL;

UPDATE seller_requests
SET reference_number = 'SEL-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6))
WHERE reference_number IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_requests_reference_number 
ON requests(reference_number);

CREATE INDEX IF NOT EXISTS idx_seller_requests_reference_number 
ON seller_requests(reference_number);

-- Add unique constraints
ALTER TABLE requests
ADD CONSTRAINT requests_reference_number_unique UNIQUE (reference_number);

ALTER TABLE seller_requests
ADD CONSTRAINT seller_requests_reference_number_unique UNIQUE (reference_number);