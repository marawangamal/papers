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

export async function getMatchingPapers({ search }: { search: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    "search",
    {
      body: {
        search,
      },
    },
  );
  if (error) {
    throw error;
  }
  return data?.result;
}
