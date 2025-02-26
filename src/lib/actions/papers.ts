"use server";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
const PER_PAGE = 50;

// utils/supabase-server.ts
export async function getPapers({
  venue_id,
}: {
  venue_id: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .eq("venue_id", venue_id);
  if (error) {
    throw error;
  }
  return data;
}

export async function getTrendingPapers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_final_papers")
    .select("*")
    .order("like_count", { ascending: false })
    .order("view_count", { ascending: false })
    .limit(5);
  if (error) {
    throw error;
  }
  return data;
}

export type PaperSearchParams = {
  venue_abbrevs: string[]; // abbrev column
  search?: string;
  page?: string;
  year_min?: string;
  year_max?: string;
  has_code?: boolean;
};

export async function getMatchingPapers(
  { search, page, venue_abbrevs, year_max, year_min, has_code }:
    PaperSearchParams,
) {
  const pageInt = parseInt(page || "1", 10);
  const supabase = await createClient();

  if (!search) {
    let query = supabase.from("vw_final_papers").select("*").range(
      (pageInt - 1) * PER_PAGE,
      pageInt * PER_PAGE - 1,
    );
    if (venue_abbrevs && venue_abbrevs.length > 0) {
      query = query.in("abbrev", venue_abbrevs);
    }

    if (year_min) {
      query = query.gte("year", year_min);
    }
    if (year_max) {
      query = query.lte("year", year_max);
    }

    if (has_code) {
      query = query.not("code_url", "is", null);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data;
  }
  const { data, error } = await supabase.functions.invoke(
    "search",
    {
      body: {
        search,
        page: page || "1",
        per_page: PER_PAGE,
        venue_abbrevs,
        year_min,
        year_max,
        has_code,
      },
    },
  );
  if (error) {
    throw error;
  }
  // Log to search_logs table
  await supabase.from("search_logs").insert({
    search_query: JSON.stringify({ search, page, venue_abbrevs }),
  });
  return data?.result as Tables<"vw_final_papers">[];
}
