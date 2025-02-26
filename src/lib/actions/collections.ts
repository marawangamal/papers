"use server";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

// utils/supabase-server.ts
export async function getCollectionPapers() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user || !user.data?.user?.id) {
        throw new Error("User not found");
    }
    const { data, error } = await supabase
        .from("vw_final_collection_papers")
        .select("*")
        .eq("user_id", user.data.user.id);
    if (error) {
        throw error;
    }
    return data;
}

// TODO: Use RPC function to improve performance
export async function addToLikedCollection(
    { paper_id }: { paper_id: Tables<"papers">["id"] },
) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user || !user.data?.user?.id) {
        throw new Error("User not found");
    }

    // Get id of liked papers collection
    const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select("id")
        .eq("name", "Liked")
        .maybeSingle();

    if (collectionError || !collection) {
        throw collectionError;
    }
    const { data, error } = await supabase
        .from("collection_papers")
        .insert([{ paper_id, collection_id: collection.id }]);
    if (error) {
        throw error;
    }
    return data;
}
