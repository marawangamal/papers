import { PaperBrowserProps } from "@/components/paper-browser";
import { getMatchingPapers } from "@/lib/actions/papers";
import { getVenues } from "@/lib/actions/venues";
import { PaperBrowser } from "@/components/paper-browser-v2";

const getStringList = (value?: string | string[] | undefined) => {
  if (!value) return [];
  return typeof value === "string" ? [value] : value;
};

export default async function Page({
  //   params,
  searchParams,
}: {
  //   params: Promise<{ id: string }>;
  searchParams: Promise<PaperBrowserProps["searchParams"]>;
}) {
  const awaitedSearchParams = await searchParams;

  const papers = await getMatchingPapers({
    search: awaitedSearchParams.search,
    venue_ids: getStringList(awaitedSearchParams.venue_ids),
    page: awaitedSearchParams.page || "1",
  });

  const venues = await getVenues();
  return (
    <PaperBrowser
      venues={venues}
      papers={papers}
      searchParams={awaitedSearchParams}
    />
  );
}
