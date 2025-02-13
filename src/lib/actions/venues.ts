"use server";

import { createClient } from "@/utils/supabase/server";

// utils/supabase-server.ts
export async function getVenues() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("venues")
        .select("*");
    if (error) {
        throw error;
    }
    return data;
}
