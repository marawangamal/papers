-- Create extension for HTTP requests (if not already created)
-- This enables PostgreSQL functions to make HTTP calls
CREATE EXTENSION IF NOT EXISTS http;

-- Create the function that will call our Edge Function
CREATE OR REPLACE FUNCTION public.call_arxiv_cross_reference()
RETURNS TRIGGER AS $$
DECLARE
  result json;
  edge_function_url text := 'http://host.docker.internal:54321/functions/v1/cross-reference-arxiv';
  -- For production, use: 'https://[YOUR-PROJECT-REF].supabase.co/functions/v1/cross-reference-arxiv'
  anon_key text;
BEGIN
  -- Get the key from the vault
  SELECT decrypted_secret INTO anon_key
  FROM vault.decrypted_secrets
  WHERE name = 'supabase_anon_key';

  BEGIN
    -- Call the Edge Function with the paper title
    SELECT content::json INTO result
    FROM http((
      'POST',
      edge_function_url,
      ARRAY[
        http_header('Content-Type', 'application/json'),
        http_header('Authorization', 'Bearer ' || anon_key)
      ],
      'application/json',
      json_build_object('paperTitle', NEW.title)::text
    )::http_request);

    -- Check if the request was successful and update the paper record
    IF result->>'success' = 'true' THEN
      NEW.arxiv_id := (result->'arxivInfo'->>'arxivId');
      NEW.arxiv_url := (result->'arxivInfo'->>'url');
    ELSE
      -- Set default values if the request failed
      NEW.arxiv_id := NULL;
      NEW.arxiv_url := NULL;
    END IF;

  EXCEPTION
    WHEN others THEN
      -- Handle any exception, such as a timeout
      RAISE NOTICE 'An error occurred: %', SQLERRM;
      NEW.arxiv_id := NULL;
      NEW.arxiv_url := NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the papers table
-- Adjust the table name and columns as needed for your schema
CREATE TRIGGER cross_reference_arxiv_trigger
BEFORE INSERT OR UPDATE OF created_at, title ON papers  -- Trigger when created_at or title changes
FOR EACH ROW
EXECUTE FUNCTION public.call_arxiv_cross_reference();

-- Add comments for documentation
COMMENT ON FUNCTION public.call_arxiv_cross_reference() IS 'Trigger function that calls the ArXiv cross-reference Edge Function';
COMMENT ON TRIGGER cross_reference_arxiv_trigger ON papers IS 'Calls ArXiv API via Edge Function when a paper is created or updated';