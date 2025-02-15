"use client";
import {
  MultiSelect,
  TextInput,
  Group,
  Popover,
  Button,
  Stack,
  Title,
  CloseButton,
  Badge,
} from "@mantine/core";
import { IconBooks, IconSearch, IconFilter } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { useState, useMemo } from "react";

type PaperFiltersProps = {
  venues: Tables<"vw_final_venues">[];
  initialSearch?: string;
  initialVenues?: string[];
  isLoading?: boolean;
  onSearchClick?: ({
    searchTerm,
    venue_abbrevs,
  }: {
    searchTerm?: string;
    venue_abbrevs?: string[];
  }) => void;
};

export function PaperFilters({
  venues,
  initialSearch = "",
  initialVenues = [],
  isLoading,
  onSearchClick,
}: PaperFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedVenues, setSelectedVenues] = useState(initialVenues);
  const [opened, setOpened] = useState(false);

  const isDirty = useMemo(() => {
    const searchChanged = searchTerm !== initialSearch;
    const venuesChanged =
      selectedVenues.length !== initialVenues.length ||
      selectedVenues.some((id) => !initialVenues.includes(id)) ||
      initialVenues.some((id) => !selectedVenues.includes(id));
    return searchChanged || venuesChanged;
  }, [searchTerm, selectedVenues, initialSearch, initialVenues]);

  const activeFiltersCount = selectedVenues.length > 0 ? 1 : 0;

  const handleSearch = () => {
    if (isDirty && onSearchClick) {
      onSearchClick({ searchTerm, venue_abbrevs: selectedVenues });
    }
    setOpened(false); // Close popover after applying filters
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Group>
      <Popover
        opened={opened}
        width={300}
        position="bottom-start"
        disabled={isLoading}
        withinPortal={false}
        withArrow
      >
        <Popover.Target>
          <Button
            variant="light"
            onClick={() => setOpened((o) => !o)}
            radius="md"
            color={activeFiltersCount > 0 ? "blue" : "gray"}
          >
            <Group>
              <IconFilter size={18} />
              {activeFiltersCount > 0 && (
                <Badge size="sm" ml="xs" color="blue">
                  {activeFiltersCount}
                </Badge>
              )}
            </Group>
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={5}>Apply filters</Title>
              <CloseButton onClick={() => setOpened(false)} />
            </Group>
            <MultiSelect
              data={venues.map((venue) => venue.abbrev as string)}
              value={selectedVenues}
              onChange={setSelectedVenues}
              placeholder="Select venues"
              description="Filter by conference"
              searchable
              clearable
              disabled={isLoading}
            />
            <Button onClick={handleSearch} disabled={!isDirty}>
              Apply filters
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <TextInput
        placeholder="Search papers..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        onKeyPress={handleKeyPress}
        leftSection={<IconBooks size={18} />}
        style={{ flex: 1 }}
        radius="md"
        disabled={isLoading}
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setSearchTerm("")}
            style={{ display: searchTerm ? undefined : "none" }}
          />
        }
      />
      <Button
        onClick={handleSearch}
        radius="md"
        variant="filled"
        loading={isLoading}
        disabled={!isDirty}
      >
        <IconSearch size={18} />
      </Button>
    </Group>
  );
}
