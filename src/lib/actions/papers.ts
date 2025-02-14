"use server";

import { createClient } from "@/utils/supabase/server";

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

const PER_PAGE = 50;

export type PaperSearchParams = {
  venue_id: string;
  search?: string;
  page?: string;
};

export async function getMatchingPapers(
  { search, page, venue_id }: PaperSearchParams,
) {
  const pageInt = parseInt(page || "1", 10);
  const supabase = await createClient();
  if (!search) {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .eq("venue_id", venue_id).range(
        (pageInt - 1) * PER_PAGE,
        pageInt * PER_PAGE - 1,
      );
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
        page,
        per_page: PER_PAGE,
        venue_id,
      },
    },
  );
  if (error) {
    throw error;
  }
  return data?.result;
}
