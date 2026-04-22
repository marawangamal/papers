-- Enable RLS on every public table and add policies that reflect the intended
-- access model: papers/venues are public-read, user-owned tables are scoped by
-- auth.uid(), search_logs is append-only for anon. The service role bypasses
-- RLS (used by scripts/supabase_import.py).

-- ─── public-read reference data ──────────────────────────────────────────────
alter table public.papers            enable row level security;
alter table public.venues            enable row level security;

create policy "papers: public read"
    on public.papers for select
    using (true);

create policy "venues: public read"
    on public.venues for select
    using (true);

-- ─── user-owned: collections ────────────────────────────────────────────────
alter table public.collections       enable row level security;
alter table public.collection_papers enable row level security;

create policy "collections: owner all"
    on public.collections for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- collection_papers has no user_id; gate through the parent collection.
create policy "collection_papers: owner select"
    on public.collection_papers for select
    using (exists (
        select 1 from public.collections c
        where c.id = collection_papers.collection_id and c.user_id = auth.uid()
    ));

create policy "collection_papers: owner insert"
    on public.collection_papers for insert
    with check (exists (
        select 1 from public.collections c
        where c.id = collection_papers.collection_id and c.user_id = auth.uid()
    ));

create policy "collection_papers: owner delete"
    on public.collection_papers for delete
    using (exists (
        select 1 from public.collections c
        where c.id = collection_papers.collection_id and c.user_id = auth.uid()
    ));

-- ─── event_log: anon/user can log their own events, no reads from anon ──────
alter table public.event_log         enable row level security;

-- event_log.user_id is nullable. Accept inserts where user_id is null (anon
-- event, or the caller simply didn't populate the field) or matches the
-- authenticated user. This prevents one user from logging events as another.
create policy "event_log: insert own or null"
    on public.event_log for insert
    with check (user_id is null or user_id = auth.uid());

create policy "event_log: owner select"
    on public.event_log for select
    using (auth.uid() is not null and user_id = auth.uid());

-- ─── search_logs: anon may insert, but nobody reads via API (service role only)
alter table public.search_logs       enable row level security;

create policy "search_logs: anyone insert"
    on public.search_logs for insert
    with check (true);
