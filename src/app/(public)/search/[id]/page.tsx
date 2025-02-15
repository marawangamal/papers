import { Stack, Text } from "@mantine/core";
import { PaperBrowserProps } from "@/components/paper-browser";
import { getMatchingPapers } from "@/lib/actions/papers";

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
    venue_ids: awaitedSearchParams.venue_ids,
    page: awaitedSearchParams.page || "1",
  });

  return (
    <Stack>
      <Text>Results</Text>
      {papers.map((paper) => (
        <div key={paper.id}>{paper.title}</div>
      ))}
    </Stack>
  );
}
