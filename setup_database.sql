-- 1. Drop existing table if it exists (so you can run this clean)
DROP TABLE IF EXISTS public.rbi_nbfc_registry CASCADE;

-- 2. Create the table for RBI registered NBFCs with all columns
CREATE TABLE public.rbi_nbfc_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sl_no TEXT,
    company_name TEXT UNIQUE NOT NULL,
    regional_office TEXT,
    accepts_public_deposits TEXT,
    classification TEXT,
    cin TEXT,
    layer TEXT,
    address TEXT,
    email_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable the pg_trgm extension for advanced fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. Create a custom function (RPC) to perform fuzzy searching
-- This function takes a search term and returns the closest matches
-- based on similarity. It's much more reliable than simple ILIKE.
CREATE OR REPLACE FUNCTION search_nbfc(search_term TEXT)
RETURNS SETOF public.rbi_nbfc_registry AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.rbi_nbfc_registry
  WHERE company_name % search_term -- The '%' operator uses pg_trgm similarity
  ORDER BY similarity(company_name, search_term) DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Set a similarity threshold (default is 0.3, we can make it stricter to 0.4)
SET pg_trgm.similarity_threshold = 0.4;
