CREATE VIEW vw_final_venues AS
SELECT DISTINCT abbrev
FROM venues;

CREATE VIEW vw_final_papers AS
SELECT 
    p.*,
    v.abbrev,
    v.year
FROM papers p
JOIN venues v ON p.venue_id = v.id;