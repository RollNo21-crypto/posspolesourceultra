-- Update existing records
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

-- Drop existing constraints if they exist
ALTER TABLE requests
DROP CONSTRAINT IF EXISTS requests_reference_number_unique;

ALTER TABLE seller_requests
DROP CONSTRAINT IF EXISTS seller_requests_reference_number_unique;

-- Add unique constraints after dropping existing ones
ALTER TABLE requests
ADD CONSTRAINT requests_reference_number_unique UNIQUE (reference_number);

ALTER TABLE seller_requests
ADD CONSTRAINT seller_requests_reference_number_unique UNIQUE (reference_number);