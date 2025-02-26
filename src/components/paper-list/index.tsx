"use client";
import { Text, Stack } from "@mantine/core";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";
import { ResearchPaper } from "./research-paper";

export type PaperBrowserProps = {
  papers: Tables<"vw_final_papers">[];
  searchParams: PaperSearchParams;
  collectionPapers?: Tables<"vw_final_collection_papers">[];
};

export function PaperBrowser({ papers, collectionPapers }: PaperBrowserProps) {
  const collectionPapersIds = new Set(
    collectionPapers?.map((paper) => paper.id as string)
  );

  return (
    <Stack gap="xl" h="100%">
      {papers.length > 0 ? (
        <Stack gap="md">
          {papers.map((paper, index) => (
            <ResearchPaper
              key={index}
              paper={paper}
              collectionPapersIds={collectionPapersIds}
            />
          ))}
        </Stack>
      ) : (
        <Text>No papers found</Text>
      )}
    </Stack>
  );
}
