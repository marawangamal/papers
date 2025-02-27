import React from "react";
import { Stack, Title, Box, Group, Code } from "@mantine/core";
import { format, parse } from "date-fns";
import { IconActivity, IconCalendar, IconHeart } from "@tabler/icons-react";

import { ResearchPaper } from "@/components/paper-list/research-paper";
import TPaper from "@/components/ui/tpaper";
import { getCollectionPapers } from "@/lib/actions/collections";
import { getTrendingPapers } from "@/lib/actions/papers";
import { Tables } from "@/types/database.types";
import { VerificationModal } from "./verification-modal";
import { EmptyState } from "./empty-state";
import ScrollableContainerPinnedHeader from "@/layouts/scrollable-container";
import Timeline from "@/components/ui/timeline";

// Type definitions
type CollectionPaper = Tables<"vw_final_collection_papers">;
type PaperSectionProps = {
  collectionPapersIds: Set<string>;
};

/**
 * Groups papers by "YYYY-MM", extracted from the `added_at` date
 */
function groupByMonthYear(papers: CollectionPaper[]) {
  const grouped = papers.reduce<Record<string, CollectionPaper[]>>(
    (acc, paper) => {
      if (!paper.added_at) {
        const key = "unknown-month";
        if (!acc[key]) acc[key] = [];
        acc[key].push(paper);
        return acc;
      }

      const monthYear = format(new Date(paper.added_at), "yyyy-MM");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(paper);
      return acc;
    },
    {}
  );

  return Object.keys(grouped)
    .sort((a, b) => (b > a ? 1 : -1))
    .map((monthYear) => ({
      monthYear,
      papers: grouped[monthYear],
      friendlyDate:
        monthYear === "unknown-month"
          ? "Unknown Date"
          : format(parse(monthYear, "yyyy-MM", new Date()), "LLLL yyyy"),
    }));
}

/**
 * Trending Papers Section Component
 */
function TrendingSection({ collectionPapersIds }: PaperSectionProps) {
  const trendingPapers = React.use(getTrendingPapers());

  return (
    <TPaper radius="md" style={{ flex: 1, minHeight: 0 }}>
      <Stack gap={0}>
        <Group gap="xs" pt={"sm"} px={"sm"}>
          <IconActivity size={16} />
          <Code>Trending</Code>
        </Group>
        <Group
          h="100%"
          p="sm"
          align="center"
          style={{ overflowX: "auto", flexWrap: "nowrap" }}
        >
          {trendingPapers.map((paper) => (
            <Box
              key={paper.id}
              h="100%"
              style={{ minWidth: 300, maxWidth: 400, flex: "0 0 auto" }}
            >
              <ResearchPaper
                paper={paper}
                mode="summary"
                collectionPapersIds={collectionPapersIds}
              />
            </Box>
          ))}
        </Group>
      </Stack>
    </TPaper>
  );
}

/**
 * Liked Papers Section Component
 */
/**
 * Liked Papers Section Component with Improved Timeline
 */
function LikedSection({ collectionPapersIds }: PaperSectionProps) {
  const collectionPapers = React.use(getCollectionPapers());
  const groupedData = groupByMonthYear(collectionPapers);

  if (groupedData.length === 0) return <EmptyState />;

  // Process your data into timeline sections
  const sections = groupByMonthYear(collectionPapers).map(
    ({ monthYear, papers, friendlyDate }) => ({
      id: monthYear,
      header: (
        <Group gap="xs" align="center">
          <IconCalendar size={16} />
          <Code>{friendlyDate}</Code>
        </Group>
      ),
      items: papers,
    })
  );

  // Use the timeline component
  return (
    <Timeline
      sections={sections}
      renderItem={(paper) => (
        <ResearchPaper
          mode="collapsed"
          paper={paper}
          collectionPapersIds={collectionPapersIds}
        />
      )}
      stickyHeaders={true}
    />
  );
}

/**
 * Main Component
 */
export default function LikePapersPage() {
  const collectionPapers = React.use(getCollectionPapers());
  const collectionPapersIds = new Set(
    collectionPapers.map((paper) => paper.id as string)
  );

  return (
    <Stack h="100%" w="100%" style={{ overflow: "hidden" }}>
      <VerificationModal />
      <ScrollableContainerPinnedHeader
        outerContainerProps={{
          size: "xl",
          children: (
            <TrendingSection collectionPapersIds={collectionPapersIds} />
          ),
        }}
        innerContainerProps={{
          size: "xl",
          children: (
            <Stack>
              <Group>
                <IconHeart />
                <Title order={3}>Liked</Title>
              </Group>
              <LikedSection collectionPapersIds={collectionPapersIds} />
            </Stack>
          ),
        }}
      />
    </Stack>
  );
}
