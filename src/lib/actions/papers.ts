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

export async function getMatchingPapers(
  { search, page, venue_id }: {
    search?: string;
    page: number;
    venue_id: string;
  },
) {
  const supabase = await createClient();
  if (!search) {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .eq("venue_id", venue_id).range(
        (page - 1) * PER_PAGE,
        page * PER_PAGE - 1,
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
