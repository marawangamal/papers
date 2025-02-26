import { getMatchingPapers } from "@/lib/actions/papers";
import { getVenues } from "@/lib/actions/venues";
import { PaperBrowser, PaperBrowserProps } from "@/components/paper-list";
import { Card, Skeleton, Stack } from "@mantine/core";
import PaperFilterContainer from "@/components/paper-list/paper-filter-container";
import { Suspense } from "react";
import { getStringList } from "@/utils/misc";
import ScrollableContainerPinnedHeader from "@/layouts/scrollable-container";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<PaperBrowserProps["searchParams"]>;
}) {
  const awaitedSearchParams = await searchParams;
  return (
    <Stack h="100%" w="100%" style={{ height: "100%", overflow: "hidden" }}>
      <Suspense
        fallback={
          <ScrollableContainerPinnedHeader
            outerContainerProps={{
              children: (
                <PaperFilterAsyncSkeleton searchParams={awaitedSearchParams} />
              ),
            }}
            innerContainerProps={{
              children: <PaperListAsyncSkeleton />,
            }}
          />
        }
      >
        <ScrollableContainerPinnedHeader
          outerContainerProps={{
            children: <PaperFilterAsync searchParams={awaitedSearchParams} />,
          }}
          innerContainerProps={{
            children: <PaperListAsync searchParams={awaitedSearchParams} />,
          }}
        />
      </Suspense>
    </Stack>
  );
}

async function PaperFilterAsync({
  searchParams,
}: {
  searchParams: PaperBrowserProps["searchParams"];
}) {
  const venues = await getVenues();
  return <PaperFilterContainer venues={venues} searchParams={searchParams} />;
}

async function PaperListAsync({
  searchParams,
}: {
  searchParams: PaperBrowserProps["searchParams"];
}) {
  const papers = await getMatchingPapers({
    search: searchParams.search,
    venue_abbrevs: getStringList(searchParams.venue_abbrevs),
    page: searchParams.page || "1",
    year_min: searchParams.year_min,
    year_max: searchParams.year_max,
    has_code: searchParams.has_code,
  });

  return <PaperBrowser papers={papers} searchParams={searchParams} />;
}

function PaperFilterAsyncSkeleton({
  searchParams,
}: {
  searchParams: PaperBrowserProps["searchParams"];
}) {
  return (
    <PaperFilterContainer
      venues={[]}
      searchParams={searchParams}
      isLoading={true}
    />
  );
}

function PaperListAsyncSkeleton() {
  return (
    <Stack gap="md" style={{ flex: 1, overflow: "auto" }}>
      {[...Array(5)].map((_, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} width="40%" />
            <Skeleton height={60} />
            <Skeleton height={20} width={80} />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
