-- Add quantity column to request_products table
ALTER TABLE request_products
ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

-- Add check constraint to ensure quantity is positive
ALTER TABLE request_products
ADD CONSTRAINT request_products_quantity_check CHECK (quantity > 0);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_request_products_quantity 
ON request_products(quantity);

-- Update RLS policies
ALTER TABLE request_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public request products creation" ON request_products;
DROP POLICY IF EXISTS "Request products viewing" ON request_products;
DROP POLICY IF EXISTS "Admin request products management" ON request_products;

-- Recreate policies with quantity support
CREATE POLICY "Public request products creation"
  ON request_products
  FOR INSERT
  TO public
  WITH CHECK (
    quantity > 0 AND
    quantity <= 100  -- Reasonable maximum quantity per item
  );

CREATE POLICY "Request products viewing"
  ON request_products
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_products.request_id
      AND (
        requests.user_email = coalesce(auth.jwt()->>'email', requests.user_email)
        OR (auth.role() = 'authenticated' AND is_admin())
      )
    )
  );

CREATE POLICY "Admin request products management"
  ON request_products
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());