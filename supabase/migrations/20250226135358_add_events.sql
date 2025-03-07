
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
    FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL
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
    declare
        collection_name text;
    begin

        select c.name INTO collection_name
        from public.collections c
        where c.id = NEW.collection_id;

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
                'collection_id', NEW.collection_id,
                'collection_name', collection_name
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
    declare
        collection_name text;
    begin

        select c.name INTO collection_name
        from public.collections c
        where c.id = NEW.collection_id;

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
                'collection_id', OLD.collection_id,
                'collection_name', collection_name
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