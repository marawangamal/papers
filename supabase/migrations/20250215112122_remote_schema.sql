create extension if not exists "vector" with schema "extensions";


create table "public"."papers" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "normalized_title" text generated always as (lower(TRIM(BOTH FROM title))) stored,
    "abstract" text,
    "authors" text[],
    "venue_id" uuid,
    "status" text default 'submitted'::text,
    "pdf_url" text,
    "code_url" text,
    "created_at" timestamp with time zone default now(),
    "abstract_embedding" vector(384)
);


create table "public"."search_logs" (
    "id" bigint generated always as identity not null,
    "search_query" text not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."venues" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "abbrev" text,
    "year" integer not null,
    "created_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX papers_pkey ON public.papers USING btree (id);

CREATE INDEX papers_title_venue_idx ON public.papers USING btree (venue_id, normalized_title);

CREATE UNIQUE INDEX papers_venue_id_normalized_title_key ON public.papers USING btree (venue_id, normalized_title);

CREATE UNIQUE INDEX search_logs_pkey ON public.search_logs USING btree (id);

CREATE UNIQUE INDEX venues_abbrev_year_key ON public.venues USING btree (abbrev, year);

CREATE UNIQUE INDEX venues_pkey ON public.venues USING btree (id);

alter table "public"."papers" add constraint "papers_pkey" PRIMARY KEY using index "papers_pkey";

alter table "public"."search_logs" add constraint "search_logs_pkey" PRIMARY KEY using index "search_logs_pkey";

alter table "public"."venues" add constraint "venues_pkey" PRIMARY KEY using index "venues_pkey";

alter table "public"."papers" add constraint "papers_status_check" CHECK ((status = ANY (ARRAY['submitted'::text, 'accepted'::text, 'rejected'::text, 'other'::text]))) not valid;

alter table "public"."papers" validate constraint "papers_status_check";

alter table "public"."papers" add constraint "papers_venue_id_fkey" FOREIGN KEY (venue_id) REFERENCES venues(id) not valid;

alter table "public"."papers" validate constraint "papers_venue_id_fkey";

alter table "public"."papers" add constraint "papers_venue_id_normalized_title_key" UNIQUE using index "papers_venue_id_normalized_title_key";

alter table "public"."venues" add constraint "venues_abbrev_year_key" UNIQUE using index "venues_abbrev_year_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.query_embeddings(embedding vector, match_threshold double precision)
 RETURNS SETOF papers
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select *
  from papers

  -- The inner product is negative, so we negate match_threshold
  where papers.abstract_embedding <#> embedding < -match_threshold

  -- Our embeddings are normalized to length 1, so cosine similarity
  -- and inner product will produce the same query results.
  -- Using inner product which can be computed faster.
  --
  -- For the different distance functions, see https://github.com/pgvector/pgvector
  order by papers.abstract_embedding <#> embedding;
end;
$function$
;

grant delete on table "public"."papers" to "anon";

grant insert on table "public"."papers" to "anon";

grant references on table "public"."papers" to "anon";

grant select on table "public"."papers" to "anon";

grant trigger on table "public"."papers" to "anon";

grant truncate on table "public"."papers" to "anon";

grant update on table "public"."papers" to "anon";

grant delete on table "public"."papers" to "authenticated";

grant insert on table "public"."papers" to "authenticated";

grant references on table "public"."papers" to "authenticated";

grant select on table "public"."papers" to "authenticated";

grant trigger on table "public"."papers" to "authenticated";

grant truncate on table "public"."papers" to "authenticated";

grant update on table "public"."papers" to "authenticated";

grant delete on table "public"."papers" to "service_role";

grant insert on table "public"."papers" to "service_role";

grant references on table "public"."papers" to "service_role";

grant select on table "public"."papers" to "service_role";

grant trigger on table "public"."papers" to "service_role";

grant truncate on table "public"."papers" to "service_role";

grant update on table "public"."papers" to "service_role";

grant delete on table "public"."search_logs" to "anon";

grant insert on table "public"."search_logs" to "anon";

grant references on table "public"."search_logs" to "anon";

grant select on table "public"."search_logs" to "anon";

grant trigger on table "public"."search_logs" to "anon";

grant truncate on table "public"."search_logs" to "anon";

grant update on table "public"."search_logs" to "anon";

grant delete on table "public"."search_logs" to "authenticated";

grant insert on table "public"."search_logs" to "authenticated";

grant references on table "public"."search_logs" to "authenticated";

grant select on table "public"."search_logs" to "authenticated";

grant trigger on table "public"."search_logs" to "authenticated";

grant truncate on table "public"."search_logs" to "authenticated";

grant update on table "public"."search_logs" to "authenticated";

grant delete on table "public"."search_logs" to "service_role";

grant insert on table "public"."search_logs" to "service_role";

grant references on table "public"."search_logs" to "service_role";

grant select on table "public"."search_logs" to "service_role";

grant trigger on table "public"."search_logs" to "service_role";

grant truncate on table "public"."search_logs" to "service_role";

grant update on table "public"."search_logs" to "service_role";

grant delete on table "public"."venues" to "anon";

grant insert on table "public"."venues" to "anon";

grant references on table "public"."venues" to "anon";

grant select on table "public"."venues" to "anon";

grant trigger on table "public"."venues" to "anon";

grant truncate on table "public"."venues" to "anon";

grant update on table "public"."venues" to "anon";

grant delete on table "public"."venues" to "authenticated";

grant insert on table "public"."venues" to "authenticated";

grant references on table "public"."venues" to "authenticated";

grant select on table "public"."venues" to "authenticated";

grant trigger on table "public"."venues" to "authenticated";

grant truncate on table "public"."venues" to "authenticated";

grant update on table "public"."venues" to "authenticated";

grant delete on table "public"."venues" to "service_role";

grant insert on table "public"."venues" to "service_role";

grant references on table "public"."venues" to "service_role";

grant select on table "public"."venues" to "service_role";

grant trigger on table "public"."venues" to "service_role";

grant truncate on table "public"."venues" to "service_role";

grant update on table "public"."venues" to "service_role";

