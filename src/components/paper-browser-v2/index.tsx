// ConferencePapers.tsx
"use client";
import { Title, Text, Stack, Anchor, Card } from "@mantine/core";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";

export type PaperBrowserProps = {
  venues: Tables<"venues">[];
  papers: Tables<"vw_final_papers">[];
  searchParams: PaperSearchParams;
};

export function PaperBrowser({ papers }: PaperBrowserProps) {
  return (
    <Stack gap="xl" h="100%" style={{ overflow: "auto" }}>
      {papers.length > 0 ? (
        <Stack gap="md">
          {papers.map((paper, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack>
                <Title order={5}>{paper.title || "Untitled"}</Title>
                <Text size="sm" c="dimmed">
                  {paper.authors?.join(", ") || "No authors listed"}
                </Text>
                {paper.abstract && (
                  <Text size="sm" lineClamp={3}>
                    {paper.abstract}
                  </Text>
                )}
                {paper.pdf_url && (
                  <Anchor
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    View PDF
                  </Anchor>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text>No papers found</Text>
      )}
    </Stack>
  );
}
