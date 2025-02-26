"use server";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag, unstable_cache } from "next/cache";

// utils/supabase-server.ts
export async function getCollectionPapers() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user || !user.data?.user?.id) {
        throw new Error("User not found");
    }
    const userId = user.data.user.id;
    return unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from("vw_final_collection_papers")
                .select("*")
                .eq("user_id", userId)
                .order("added_at", { ascending: false });
            if (error) {
                throw error;
            }
            return data;
        },
        [`collections`],
        {
            revalidate: false,
            tags: [`collections`],
        },
    )();
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
        .eq("user_id", user.data.user.id)
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
    revalidateTag(`collections`);
    revalidateTag(`papers`);
    return data;
}

export async function removeFromLikedCollection(
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
        .eq("user_id", user.data.user.id)
        .maybeSingle();

    if (collectionError || !collection) {
        throw collectionError;
    }
    const { data, error } = await supabase
        .from("collection_papers")
        .delete()
        .eq("paper_id", paper_id)
        .eq("collection_id", collection.id);

    if (error) {
        throw error;
    }
    revalidateTag(`collections`);
    revalidateTag(`papers`);
    return data;
}
