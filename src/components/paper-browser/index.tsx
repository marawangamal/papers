// ConferencePapers.tsx
"use client";
import {
  Title,
  Text,
  Stack,
  Anchor,
  Card,
  TextInput,
  Group,
  Autocomplete,
  Box,
  Center,
  Select,
} from "@mantine/core";
import usePapers, { PaperSearchParams } from "./usePapers";
import { IconBooks, IconSearch } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";

export type PaperBrowserProps = {
  venues: Tables<"venues">[];
  searchParams: PaperSearchParams;
};

export function PaperBrowser({ venues, searchParams }: PaperBrowserProps) {
  const {
    isFetching,
    error,
    notes,
    currentVenue,
    currentSearch,
    handleConferenceChange,
    handleSearchChange,
  } = usePapers({ searchParams, venues });

  return (
    <Stack gap="xl" h="100%">
      <Group align="center">
        <Select
          clearable
          label="Conference"
          placeholder="Choose a conference"
          data={venues.map((v) => ({
            value: v.id,
            label: `${v.abbrev} ${v.year}`, // Fix: Proper template string usage
          }))}
          value={currentVenue?.id} // Ensure value is correctly set
          onChange={(value) => {
            // Find matching venue by its ID
            const selectedVenue = venues.find((v) => v.id === value);
            handleConferenceChange(selectedVenue?.id);
          }}
          leftSection={<IconBooks size={16} />}
          radius="md"
        />
        {/* <Autocomplete
          clearable
          label="Conference"
          placeholder="Choose a conference"
          // data={venues.map(({ id }) => id)}
          data={venues.map((v) => ({
            value: v.id,
            label: `${v.abbrev} ${v.year}`,
          }))}
          value={currentVenue?.id} // Use the label for value
          // For autocomplete
          // onChange={(label) => {
          //   // find matching conf.inviation
          //   const value = venues.find(
          //     (v) => `${v.abbrev} ${v.year}` === label
          //   )?.id;
          //   handleConferenceChange(value);
          // }}
          leftSection={<IconBooks size={16} />}
          radius="md"
        /> */}
        <TextInput
          flex={1}
          label="Search term"
          placeholder="Search for papers"
          onChange={(event) => handleSearchChange(event.currentTarget.value)}
          value={currentSearch}
          leftSection={<IconSearch size={16} />}
          radius="md"
        />
      </Group>

      {error && (
        <Text size="sm" c="red">
          {error}
        </Text>
      )}

      <Box
        style={{
          flex: 1,
          minHeight: 0, // Critical for nested flex containers
          overflow: "auto",
        }}
      >
        {!searchParams.venue_id ? (
          <Center h="100%">
            <Text>Select a conference to view papers</Text>
          </Center>
        ) : isFetching ? (
          <Center h="100%">
            <Text>Loading...</Text>
          </Center>
        ) : notes.length > 0 ? (
          <Stack gap={"md"}>
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
