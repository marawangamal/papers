import { NextResponse } from "next/server";
import { getMatchingPapers } from "@/lib/actions/papers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || undefined;
  const page = searchParams.get("page") || undefined;
  const venueAbbrevs = searchParams.getAll("venue") || [];
  const yearMin = searchParams.get("year_min") || undefined;
  const yearMax = searchParams.get("year_max") || undefined;
  const hasCode = searchParams.get("has_code") === "true";

  // Log the search parameters, useful for debugging
  // console.log("Search params:", { search, venueAbbrevs, page, yearMin, yearMax, hasCode });

  const params = {
    venue_abbrevs: venueAbbrevs,
    search,
    page,
    year_min: yearMin,
    year_max: yearMax,
    has_code: hasCode,
  };

  try {
    const results = await getMatchingPapers(params);
    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search error details:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Search failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 },
    );
  }
}
