import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database, Tables } from "../_shared/database.types.ts";

type EmbeddingsRecord = Tables<"papers">;
interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: EmbeddingsRecord;
  schema: "public";
  old_record: null | EmbeddingsRecord;
}

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  console.log("Received payload:", payload); // Log full payload

  const { abstract, id } = payload.record;
  console.log("Abstract:", abstract);
  console.log("ID:", id);

  // Check if content has changed.
  if (abstract === payload?.old_record?.abstract) {
    console.log("No change detected in abstract");
    return new Response("ok - no change");
  }

  // Generate embedding
  if (!abstract) {
    console.log("No abstract found");
    return new Response("ok - no abstract");
  }

  console.log("Generating embedding...");
  const embedding = await model.run(abstract, {
    mean_pool: true,
    normalize: true,
  });

  console.log("Embedding generated, updating DB...");
  // Store in DB
  const { error } = await supabase.from("papers").update({
    abstract_embedding: JSON.stringify(embedding),
  }).eq("id", id);

  if (error) {
    console.error("Update error:", error);
    return new Response(`error - failed to update ${error.message}`);
  }

  return new Response("ok - updated");
});
