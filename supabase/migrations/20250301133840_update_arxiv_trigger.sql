-- Make the arxiv trigger be after the update to avoid interruptions

DROP TRIGGER IF EXISTS cross_reference_arxiv_trigger ON papers;
CREATE TRIGGER cross_reference_arxiv_trigger
AFTER INSERT OR UPDATE OF title ON papers  -- Changed BEFORE to AFTER
FOR EACH ROW
EXECUTE FUNCTION public.call_arxiv_cross_reference();