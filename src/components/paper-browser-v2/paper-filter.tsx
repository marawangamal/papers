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
  NumberInput,
  Text,
} from "@mantine/core";
import { IconBooks, IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { useState, useMemo } from "react";

type PaperFiltersProps = {
  venues: Tables<"vw_final_venues">[];
  initialSearch?: string;
  initialVenues?: string[];
  initialYearRange?: { start?: number; end?: number };
  isLoading?: boolean;
  onSearchClick?: ({
    searchTerm,
    venue_abbrevs,
    yearRange,
  }: {
    searchTerm?: string;
    venue_abbrevs?: string[];
    yearRange?: { start?: number; end?: number };
  }) => void;
};

const currentYear = new Date().getFullYear();

export function PaperFilters({
  venues,
  initialSearch = "",
  initialVenues = [],
  initialYearRange = {},
  isLoading,
  onSearchClick,
}: PaperFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedVenues, setSelectedVenues] = useState(initialVenues);
  const [yearRange, setYearRange] = useState(initialYearRange);
  const [opened, setOpened] = useState(false);

  const isDirty = useMemo(() => {
    const searchChanged = searchTerm !== initialSearch;
    const venuesChanged =
      selectedVenues.length !== initialVenues.length ||
      selectedVenues.some((id) => !initialVenues.includes(id)) ||
      initialVenues.some((id) => !selectedVenues.includes(id));
    const yearRangeChanged =
      yearRange.start !== initialYearRange.start ||
      yearRange.end !== initialYearRange.end;
    return searchChanged || venuesChanged || yearRangeChanged;
  }, [
    searchTerm,
    selectedVenues,
    yearRange,
    initialSearch,
    initialVenues,
    initialYearRange,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedVenues.length > 0) count++;
    if (yearRange.start || yearRange.end) count++;
    return count;
  }, [selectedVenues.length, yearRange]);

  const handleSearch = () => {
    if (isDirty && onSearchClick) {
      onSearchClick({ searchTerm, venue_abbrevs: selectedVenues, yearRange });
    }
    setOpened(false);
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
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                Filter by conference
              </Text>
              <MultiSelect
                data={venues.map((venue) => venue.abbrev as string)}
                value={selectedVenues}
                onChange={setSelectedVenues}
                placeholder="Select venues"
                // description="Filter by conference"
                searchable
                clearable
                disabled={isLoading}
              />
            </Stack>
            <Stack gap="xs">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Filter by year
                </Text>
                <Group grow>
                  <NumberInput
                    placeholder="From year"
                    value={yearRange.start}
                    onChange={(value) =>
                      setYearRange((prev) => ({
                        ...prev,
                        start: typeof value === "number" ? value : undefined,
                      }))
                    }
                    min={1900}
                    max={currentYear}
                    disabled={isLoading}
                  />
                  <NumberInput
                    placeholder="To year"
                    value={yearRange.end}
                    onChange={(value) =>
                      setYearRange((prev) => ({
                        ...prev,
                        end: typeof value === "number" ? value : undefined,
                      }))
                    }
                    min={1900}
                    max={currentYear}
                    disabled={isLoading}
                  />
                </Group>
              </Stack>
            </Stack>
            <Group justify="flex-end">
              <Button
                onClick={() => {
                  setSelectedVenues([]);
                  setYearRange({});
                }}
                variant="outline"
                leftSection={<IconX size={18} />}
              >
                Clear
              </Button>
              <Button onClick={handleSearch} disabled={!isDirty}>
                Apply filters
              </Button>
            </Group>
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
