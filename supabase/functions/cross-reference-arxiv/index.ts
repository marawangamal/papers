// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

/**
 * Searches ArXiv for papers matching the given title
 * @param title The paper title to search for
 * @returns The arxiv ID and URL of the best matching paper or null if none found
 */
async function searchArxiv(title: string): Promise<{ arxivId: string, url: string } | null> {
  try {
    // Encode the title for URL
    const encodedTitle = encodeURIComponent(`ti:"${title}"`);
    const url = `http://export.arxiv.org/api/query?search_query=${encodedTitle}&max_results=1&sortBy=relevance`;

    console.log(`Fetching from ArXiv API: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`ArXiv API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const xmlText = await response.text();
    console.log("Received XML response");

    // Simple regex-based XML parsing
    const idMatch = /<id>http:\/\/arxiv\.org\/abs\/(.*?)<\/id>/i.exec(xmlText);
    if (!idMatch || !idMatch[1]) {
      console.log("No matching paper found");
      return null;
    }

    const arxivId = idMatch[1];
    const pdfUrl = `https://arxiv.org/abs/${arxivId}`;

    console.log(`Found paper: ${arxivId}`);
    return { arxivId, url: pdfUrl };
  } catch (error) {
    console.error("Error searching ArXiv:", error);
    return null;
  }
}

// Main function handler
Deno.serve(async (req) => {
  try {
    // Parse request body
    const { paperTitle } = await req.json();

    if (!paperTitle) {
      return new Response(
        JSON.stringify({ error: "Paper title is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Searching for paper: "${paperTitle}"`);
    const arxivInfo = await searchArxiv(paperTitle);

    if (!arxivInfo) {
      return new Response(
        JSON.stringify({ error: "No matching paper found on ArXiv" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, arxivInfo }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cross-reference-arxiv' \
    --header 'Content-Type: application/json' \
    --data '{"paperTitle":"Attention is All You Need"}'

*/
