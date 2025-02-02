-- Part 2: Create trigger functions
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