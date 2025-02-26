import { ResearchPaper } from "@/components/paper-list/research-paper";
import TPaper from "@/components/ui/tpaper";
import { getCollectionPapers } from "@/lib/actions/collections";
import { getTrendingPapers } from "@/lib/actions/papers";
import { Box, Group, Stack, Title } from "@mantine/core";
import React from "react";

export default async function LikePapersPage() {
  const collectionPapers = await getCollectionPapers();
  const trendingPapers = await getTrendingPapers();

  const collectionPapersIds = new Set(
    collectionPapers.map((paper) => paper.id as string)
  );

  return (
    <Stack h="100%" w="100%" style={{ overflow: "hidden" }}>
      <Stack flex={1}>
        <Title order={3}>Trending Papers</Title>
        <TPaper radius="md" flex={1}>
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
                  minWidth: "300px",
                  maxWidth: "400px",
                  flex: "0 0 auto",
                }}
              >
                <ResearchPaper
                  key={paper.id}
                  paper={paper}
                  mode="summary"
                  collectionPapersIds={collectionPapersIds}
                />
              </Box>
            ))}
          </Group>
        </TPaper>
      </Stack>

      <Stack flex={4} style={{ overflowY: "auto" }}>
        <Title order={3}>My Papers</Title>
        {collectionPapers.map((paper) => (
          <ResearchPaper
            key={paper.id}
            mode="collapsed"
            paper={paper}
            collectionPapersIds={collectionPapersIds}
          />
        ))}
        {collectionPapers.length === 0 && <p>No papers found</p>}
      </Stack>
    </Stack>
  );
}
