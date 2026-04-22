-- Surfaces which (conference, year) combinations currently have papers loaded.
-- Used by the public /coverage page so visitors can see corpus breadth.

CREATE OR REPLACE VIEW public.vw_venue_coverage AS
SELECT
    v.abbrev,
    v.year,
    COUNT(p.id)::int AS paper_count
FROM public.venues v
LEFT JOIN public.papers p ON p.venue_id = v.id
GROUP BY v.abbrev, v.year
ORDER BY v.abbrev, v.year;

-- Match the security posture of the other public views.
ALTER VIEW public.vw_venue_coverage SET (security_invoker = on);
