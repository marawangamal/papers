import React from "react";
import { Stack, Title, Box, Group, Container } from "@mantine/core";
import { format, parse } from "date-fns";
import { ResearchPaper } from "@/components/paper-list/research-paper";
import TPaper from "@/components/ui/tpaper";
import { getCollectionPapers } from "@/lib/actions/collections";
import { getTrendingPapers } from "@/lib/actions/papers";
import { Tables } from "@/types/database.types";
import { VerificationModal } from "./verification-modal";
import { EmptyState } from "./empty-state";

// If your "vw_final_collection_papers" row type differs, adjust accordingly
type CollectionPaper = Tables<"vw_final_collection_papers">;

export default async function LikePapersPage() {
  const collectionPapers = await getCollectionPapers();
  const trendingPapers = await getTrendingPapers();

  const collectionPapersIds = new Set<string>(
    collectionPapers.map((paper) => paper.id as string)
  );

  // Group papers by month-year (e.g., "2025-02")
  const grouped = groupPapersByMonthYear(collectionPapers);
  // Sort descending by key (so the newest month-year appears first)
  const dateKeys = Object.keys(grouped).sort((a, b) => (b > a ? 1 : -1));

  return (
    <Container size="lg" h="100%" w="100%" style={{ overflow: "hidden" }}>
      <Stack h="100%" w="100%" style={{ overflow: "hidden" }}>
        <VerificationModal />
        {/* Trending Papers */}
        <Stack flex={1}>
          <Title order={3}>Trending Papers</Title>
          <TPaper radius="md" style={{ flex: 1 }}>
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
                  style={{
                    minWidth: 300,
                    maxWidth: 400,
                    flex: "0 0 auto",
                  }}
                >
                  <ResearchPaper
                    paper={paper}
                    mode="summary"
                    collectionPapersIds={collectionPapersIds}
                  />
                </Box>
              ))}
            </Group>
          </TPaper>
        </Stack>

        {/* My Papers, grouped by month-year */}
        <Stack flex={4} style={{ overflowY: "auto" }}>
          <Title order={3}>My Papers</Title>

          {dateKeys.length === 0 && <EmptyState />}

          {dateKeys.map((monthYear) => {
            // Convert "YYYY-MM" back to a Date, setting day=1
            // e.g., "2025-02" -> parse(..., "yyyy-MM", new Date())
            const parsedDate = parse(monthYear, "yyyy-MM", new Date());
            // Friendly string like "February 2025"
            const friendlyDate = format(parsedDate, "LLLL yyyy");

            return (
              <Stack key={monthYear} gap="xs">
                <Title order={4}>{friendlyDate}</Title>
                {grouped[monthYear].map((paper) => (
                  <ResearchPaper
                    key={paper.id}
                    mode="collapsed"
                    paper={paper}
                    collectionPapersIds={collectionPapersIds}
                  />
                ))}
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}

/**
 * Groups papers by "YYYY-MM", extracted from the `added_at` date.
 */
function groupPapersByMonthYear(
  papers: CollectionPaper[]
): Record<string, CollectionPaper[]> {
  return papers.reduce<Record<string, CollectionPaper[]>>((acc, paper) => {
    // Handle null/undefined `added_at` however you like
    if (!paper.added_at) {
      const fallbackKey = "unknown-month";
      if (!acc[fallbackKey]) acc[fallbackKey] = [];
      acc[fallbackKey].push(paper);
      return acc;
    }

    // Extract YYYY-MM from the date
    const date = new Date(paper.added_at);
    // e.g., "2025-02"
    const monthYear = format(date, "yyyy-MM");

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(paper);
    return acc;
  }, {});
}
