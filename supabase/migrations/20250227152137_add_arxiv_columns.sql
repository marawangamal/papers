-- Add the ArXiv columns to the papers table
ALTER TABLE public.papers
ADD COLUMN IF NOT EXISTS arxiv_id TEXT,
ADD COLUMN IF NOT EXISTS arxiv_url TEXT;

-- Add descriptions to the columns
COMMENT ON COLUMN public.papers.arxiv_id IS 'ArXiv paper identifier';
COMMENT ON COLUMN public.papers.arxiv_url IS 'URL to the ArXiv paper';

-- Add an index for performance
CREATE INDEX IF NOT EXISTS idx_papers_arxiv_id ON public.papers (arxiv_id);
