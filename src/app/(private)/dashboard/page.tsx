import { ResearchPaper } from "@/components/paper-list/research-paper";
import { getCollectionPapers } from "@/lib/actions/collections";
import { getTrendingPapers } from "@/lib/actions/papers";
import { Group, Stack, Title } from "@mantine/core";
import React from "react";

export default async function LikePapersPage() {
  const collectionPapers = await getCollectionPapers();
  const trendingPapers = await getTrendingPapers();

  const collectionPapersIds = new Set(
    collectionPapers.map((paper) => paper.id as string)
  );

  return (
    <Stack h="100%" w="100%" style={{ overflow: "hidden" }}>
      <Stack>
        <Title order={3}>Trending Papers</Title>
        <Group align="center" style={{ overflowX: "auto", flexWrap: "nowrap" }}>
          {trendingPapers.map((paper) => (
            <ResearchPaper
              key={paper.id}
              paper={paper}
              mode="summary"
              collectionPapersIds={collectionPapersIds}
            />
          ))}
        </Group>
      </Stack>

      <Stack flex={1} style={{ overflowY: "auto" }}>
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
