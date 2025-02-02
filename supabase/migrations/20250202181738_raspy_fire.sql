-- Add quantity column to request_products if not exists
ALTER TABLE request_products 
ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

-- Drop existing constraint if it exists
ALTER TABLE request_products
DROP CONSTRAINT IF EXISTS request_products_quantity_check;

-- Add check constraint for quantity
ALTER TABLE request_products
ADD CONSTRAINT request_products_quantity_check 
CHECK (quantity > 0);

-- Create index for quantity
CREATE INDEX IF NOT EXISTS idx_request_products_quantity 
ON request_products(quantity);

-- Create pagination helper function
CREATE OR REPLACE FUNCTION paginate_results(
  table_name text,
  page_number integer,
  page_size integer,
  sort_column text,
  sort_direction text,
  where_clause text DEFAULT NULL
) RETURNS TABLE (
  items jsonb,
  total_count bigint
) AS $$
DECLARE
  offset_val integer;
  query text;
BEGIN
  offset_val := (page_number - 1) * page_size;
  
  -- Build the query
  query := format(
    'WITH counted AS (
      SELECT COUNT(*) OVER() as total_count, t.*
      FROM %I t
      WHERE 1=1 %s
      ORDER BY %I %s
      LIMIT %s OFFSET %s
    )
    SELECT 
      jsonb_agg(counted.*) as items,
      MAX(total_count) as total_count
    FROM counted',
    table_name,
    COALESCE(where_clause, ''),
    sort_column,
    sort_direction,
    page_size,
    offset_val
  );
  
  RETURN QUERY EXECUTE query;
END;
$$ LANGUAGE plpgsql;