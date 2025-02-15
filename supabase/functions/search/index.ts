// Setup type definitions for built-in Supabase Runtime APIs
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const model = new Supabase.ai.Session("gte-small");

type SearchParams = {
  search: string;
  page: number;
  per_page: number;
  venue_abbrevs?: string[];
  year_min?: number;
  year_max?: number;
};

Deno.serve(async (req) => {
  const { search, venue_abbrevs, year_min, year_max, page, per_page }:
    SearchParams = await req.json();

  if (!search) return new Response("Please provide a search param!");

  // Generate embedding for search term.
  const embedding = await model.run(search, {
    mean_pool: true,
    normalize: true,
  });

  // Query embeddings.
  let query = supabase
    .rpc("query_embeddings", {
      embedding: JSON.stringify(embedding),
      match_threshold: 0.8,
    })
    .select("*");

  // Apply venue filter if provided
  if (venue_abbrevs && venue_abbrevs.length > 0) {
    query = query.in("abbrev", venue_abbrevs);
  }

  // Apply year range filters if provided
  if (year_min !== undefined) {
    query = query.gte("year", year_min);
  }
  if (year_max !== undefined) {
    query = query.lte("year", year_max);
  }

  // Apply pagination
  query = query
    .range((page - 1) * per_page, page * per_page - 1);

  const { data: result, error } = await query;

  if (error) {
    return Response.json(error);
  }

  return Response.json({ search, result });
});

/* To invoke locally:
  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Run `supabase functions serve`
  3. Make an HTTP request:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/search' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"search":"vehicles", "venue_ids": ["venue1", "venue2"], "year_min": 2020, "year_max": 2023}'
*/
