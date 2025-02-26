
-- First drop all views that might have dependencies
DROP VIEW IF EXISTS public.vw_final_papers CASCADE;
DROP VIEW IF EXISTS public.vw_final_venues CASCADE;
DROP VIEW IF EXISTS public.vw_final_collection_papers CASCADE;
DROP VIEW IF EXISTS public.vw_derived_event_log_summary CASCADE;

CREATE OR REPLACE VIEW vw_derived_event_log_summary AS
WITH cte_event_log_summary AS NOT MATERIALIZED (
SELECT 
    paper_id,
    COUNT(*) FILTER (WHERE event = 'view') AS view_count,
    COUNT(*) FILTER (WHERE event = 'like') AS like_count,
    COUNT(*) FILTER (WHERE event = 'unlike') AS unlike_count,
    COUNT(*) AS total_events,
    MAX(created_at) FILTER (WHERE event = 'view') AS last_viewed,
    MAX(created_at) FILTER (WHERE event = 'like') AS last_liked
FROM 
    event_log
WHERE 
    paper_id IS NOT NULL
GROUP BY 
    paper_id
)
SELECT 
  *, 
  like_count - unlike_count as net_like_count
FROM cte_event_log_summary;


-- -- *********************************************************
-- -- Final Views
-- -- *********************************************************



CREATE OR REPLACE VIEW vw_final_venues AS
SELECT DISTINCT abbrev
FROM venues;


CREATE OR REPLACE VIEW vw_final_papers AS
SELECT 
    p.*,
    v.abbrev,
    v.year,
    COALESCE(el.view_count, 0) as view_count,
    COALESCE(el.net_like_count, 0)  as like_count
FROM papers p
JOIN venues v ON p.venue_id = v.id
LEFT JOIN vw_derived_event_log_summary el ON p.id = el.paper_id;


CREATE OR REPLACE VIEW public.vw_final_collection_papers AS
SELECT 
    p.*, 
    c.name as collection_name, 
    c.id as collection_id, 
    c.user_id 
FROM collection_papers cp 
LEFT JOIN collections c ON c.id = cp.collection_id
LEFT JOIN vw_final_papers p ON p.id = cp.paper_id;