
CREATE TYPE t_event AS ENUM (
  'view',       -- User viewed a paper
  'like',       -- User liked a paper
  'unlike',     -- User unliked a paper
  'share'       -- User shared a paper
);

-- Central events/logs table for all user activity
CREATE TABLE "public"."event_log" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "event" t_event NOT NULL, 
    "user_id" uuid,  -- Can be NULL for anonymous events
    "created_at" timestamp with time zone DEFAULT now(),
    -- References to various entities (all nullable)
    "paper_id" uuid,  
    "metadata" jsonb,
    -- Foreign key constraints
    PRIMARY KEY ("id"),
    FOREIGN KEY ("paper_id") REFERENCES papers(id) ON DELETE SET NULL,
    FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL,
);



-- *********************************************************
-- Define triggers
-- *********************************************************


DROP TRIGGER IF EXISTS on_collection_paper_insert ON public.collection_papers;
DROP TRIGGER IF EXISTS on_collection_paper_delete ON public.collection_papers;
DROP TRIGGER IF EXISTS after_collection_paper_insert ON public.collection_papers;
DROP TRIGGER IF EXISTS after_collection_paper_delete ON public.collection_papers;
DROP FUNCTION IF EXISTS handle_collection_paper_insert;
DROP FUNCTION IF EXISTS handle_collection_paper_delete;


create function public.handle_collection_paper_insert()
    returns trigger
    language plpgsql
    security definer set search_path = ''
    as $$
    begin

        INSERT INTO public.event_log (
            event,
            user_id,
            paper_id,
            metadata
        )
        SELECT
            'like'::public.t_event,
            c.user_id,
            NEW.paper_id,
            jsonb_build_object(
                'collection_id', NEW.collection_id
            )
        FROM public.collections c
        WHERE c.id = NEW.collection_id;
        
        return NEW;
    end;
    $$;


create function public.handle_collection_paper_delete()
    returns trigger
    language plpgsql
    security definer set search_path = ''
    as $$
    begin
        -- Insert an 'unlike' event into the event log
        INSERT INTO public.event_log (
            event,
            user_id,
            paper_id,
            metadata
        )
        SELECT
            'unlike'::public.t_event,
            c.user_id,
            OLD.paper_id,
            jsonb_build_object(
                'collection_id', OLD.collection_id
            )
        FROM public.collections c
        WHERE c.id = OLD.collection_id;

        return NEW;
    end;
    $$;


create trigger on_collection_paper_insert
  after insert on public.collection_papers
  for each row execute procedure public.handle_collection_paper_insert();


create trigger on_collection_paper_delete
  after delete on public.collection_papers
  for each row execute procedure public.handle_collection_paper_delete();





-- -- Function to handle the automatic logging of 'like' events
-- CREATE OR REPLACE FUNCTION public.log_paper_like()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = ''
-- AS $$
-- DECLARE
--     collection_name text;
-- BEGIN
--     -- Get the collection name
--     SELECT c.name INTO collection_name
--     FROM public.collection c
--     WHERE c.id = NEW.collection_id;
    
--     -- Only log 'like' events for the "Liked" collection
--     IF collection_name = 'Liked' THEN
--         -- Insert a 'like' event into the event log
--         INSERT INTO public.event_log (
--             event,
--             user_id,
--             paper_id,
--             metadata
--         )
--         SELECT
--             'like'::t_event,
--             c.user_id,
--             NEW.paper_id,
--             jsonb_build_object(
--                 'collection_id', NEW.collection_id,
--                 'collection_name', collection_name
--             )
--         FROM public.collections c
--         WHERE c.id = NEW.collection_id;
--     END IF;
    
--     RETURN NEW;
-- END;
-- $$;

-- -- Function to handle the automatic logging of 'unlike' events
-- CREATE OR REPLACE FUNCTION public.log_paper_unlike()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = ''
-- AS $$
-- DECLARE
--     collection_name text;
-- BEGIN
--     -- Get the collection name
--     SELECT c.name INTO collection_name
--     FROM public.collections c
--     WHERE c.id = OLD.collection_id;
    
--     -- Only log 'unlike' events for the "Liked" collection
    -- IF collection_name = 'Liked' THEN
    --     -- Insert an 'unlike' event into the event log
    --     INSERT INTO public.event_log (
    --         event,
    --         user_id,
    --         paper_id,
    --         metadata
    --     )
    --     SELECT
    --         'unlike'::t_event,
    --         c.user_id,
    --         OLD.paper_id,
    --         jsonb_build_object(
    --             'collection_id', OLD.collection_id,
    --             'collection_name', collection_name,
    --             'previous_action', 'like'
    --         )
    --     FROM public.collections c
    --     WHERE c.id = OLD.collection_id;
    -- END IF;
    
--     RETURN OLD;
-- END;
-- $$;

-- Trigger to automatically log 'like' events when papers are added to collections
-- CREATE TRIGGER after_collection_paper_insert
-- AFTER INSERT ON public.collection_papers
-- FOR EACH ROW
-- EXECUTE PROCEDURE public.log_paper_like();


-- CREATE TRIGGER after_collection_paper_delete
-- AFTER DELETE ON public.collection_papers
-- FOR EACH ROW
-- EXECUTE PROCEDURE public.log_paper_unlike();



CREATE OR REPLACE VIEW vw_final_event_log_summary AS
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
FROM cte_event_log_summary