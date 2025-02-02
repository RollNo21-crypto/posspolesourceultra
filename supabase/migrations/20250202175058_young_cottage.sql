-- Create triggers
DROP TRIGGER IF EXISTS set_request_reference_number_trigger ON requests;
CREATE TRIGGER set_request_reference_number_trigger
  BEFORE INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_reference_number();

DROP TRIGGER IF EXISTS set_seller_reference_number_trigger ON seller_requests;
CREATE TRIGGER set_seller_reference_number_trigger
  BEFORE INSERT ON seller_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_seller_reference_number();