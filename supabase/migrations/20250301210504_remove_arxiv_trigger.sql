

-- Create extension for HTTP requests (if not already created)
-- This enables PostgreSQL functions to make HTTP calls
DROP TRIGGER IF EXISTS cross_reference_arxiv_trigger ON papers;
DROP FUNCTION IF EXISTS public.call_arxiv_cross_reference();