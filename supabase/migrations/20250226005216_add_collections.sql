-- Collections table (simple approach)
create table "public"."collections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now(),
    primary key (id),
    foreign key (user_id) references auth.users(id) on delete cascade,
    unique (user_id, name)
);

-- Collection items table (papers in collections)
create table "public"."collection_papers" (
    "collection_id" uuid not null,
    "paper_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    primary key (collection_id, paper_id),
    foreign key (collection_id) references collections(id) on delete cascade,
    foreign key (paper_id) references papers(id) on delete cascade
);

-- Create indexes for better performance
CREATE INDEX collection_papers_paper_id_idx ON public.collection_papers USING btree (paper_id);
CREATE INDEX collections_user_id_idx ON public.collections USING btree (user_id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    -- Create the "Liked" collection for the new user
    insert into public.collections (user_id, name)
    values (NEW.id, 'Liked');
    
    return NEW;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

grant all privileges on table "public"."collections" to authenticated, service_role;
grant all privileges on table "public"."collection_papers" to authenticated, service_role;

alter table public.collections enable row level security;
alter table public.collection_papers enable row level security;


-- Policies for collections
create policy "Users can view their own collections"
on collections for select
using ( (select auth.uid()) = user_id );

create policy "Users can create a collection."
on collections for insert
to authenticated                          -- the Postgres Role (recommended)
with check ( (select auth.uid()) = user_id );      -- the actual Policy

create policy "Users can update their own collections."
on collections for update
to authenticated                    -- the Postgres Role (recommended)
using ( (select auth.uid()) = user_id )       -- checks if the existing row complies with the policy expression
with check ( (select auth.uid()) = user_id ); -- checks if the new row complies with the policy expression

create policy "Users can delete a collection."
on collections for delete
to authenticated                     -- the Postgres Role (recommended)
using ( (select auth.uid()) = user_id );      -- the actual Policy


-- Policies for collection_papers
CREATE POLICY "Users can view papers in their collections"
ON collection_papers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM collections 
    WHERE collections.id = collection_papers.collection_id 
    AND collections.user_id = auth.uid()
  )
);

-- Users can add papers to collections they own
CREATE POLICY "Users can add papers to their collections"
ON collection_papers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM collections 
    WHERE collections.id = collection_papers.collection_id 
    AND collections.user_id = auth.uid()
  )
);

-- Users can delete papers from collections they own
CREATE POLICY "Users can remove papers from their collections"
ON collection_papers FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM collections 
    WHERE collections.id = collection_papers.collection_id 
    AND collections.user_id = auth.uid()
  )
);

-- No update policy needed for collection_papers since there are no fields to update
-- (only collection_id and paper_id which are the primary key)
