// ConferencePapers.tsx
"use client";
import { Title, Text, Stack, Anchor, Card, Box, Center } from "@mantine/core";
import { PaperFilters } from "./filter";
import usePapers from "./usePapers";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";

export type PaperBrowserProps = {
  venues: Tables<"venues">[];
  searchParams: PaperSearchParams;
};

export function PaperBrowser({ venues, searchParams }: PaperBrowserProps) {
  const {
    isFetching,
    error,
    notes,
    selectedVenues,
    currentSearch,
    handleVenuesChange,
    handleSearchChange,
  } = usePapers({ searchParams, venues });

  return (
    <Stack gap="xl" h="100%">
      <PaperFilters
        venues={venues}
        selectedVenues={selectedVenues}
        searchTerm={currentSearch}
        onVenueChange={handleVenuesChange}
        onSearchChange={handleSearchChange}
      />

      {error && (
        <Text size="sm" c="red">
          {error}
        </Text>
      )}

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {selectedVenues.length === 0 ? (
          <Center h="100%">
            <Text>Select at least one conference to view papers</Text>
          </Center>
        ) : isFetching ? (
          <Center h="100%">
            <Text>Loading...</Text>
          </Center>
        ) : notes.length > 0 ? (
          <Stack gap="md">
            {notes.map((paper, index) => (
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
      </Box>
    </Stack>
  );
}
