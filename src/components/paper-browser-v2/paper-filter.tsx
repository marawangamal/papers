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
  venues: Tables<"venues">[];
  initialSearch?: string;
  initialVenues?: string[];
  isLoading?: boolean;
  onSearchClick?: ({
    searchTerm,
    venueIds,
  }: {
    searchTerm?: string;
    venueIds?: string[];
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
  const [venueIds, setVenueIds] = useState(initialVenues);
  const [opened, setOpened] = useState(false);

  // Check if current values are different from initial values
  const isDirty = useMemo(() => {
    const searchChanged = searchTerm !== initialSearch;
    const venuesChanged =
      venueIds.length !== initialVenues.length ||
      venueIds.some((id) => !initialVenues.includes(id)) ||
      initialVenues.some((id) => !venueIds.includes(id));
    return searchChanged || venuesChanged;
  }, [searchTerm, venueIds, initialSearch, initialVenues]);

  const venueOptions = venues.map((v) => ({
    value: v.id,
    label: `${v.abbrev} ${v.year}`,
  }));

  const activeFiltersCount = venueIds.length > 0 ? 1 : 0;

  const handleSearch = () => {
    if (isDirty && onSearchClick) {
      onSearchClick({ searchTerm, venueIds });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // // Effect to set the states when initial values change
  // useEffect(() => {
  //   setSearchTerm(initialSearch);
  //   setVenueIds(initialVenues);
  // }, [initialSearch, initialVenues]);

  return (
    <Group>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={300}
        position="bottom-start"
        disabled={isLoading}
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
          <Stack>
            <Title order={5}>Apply filters</Title>
            <MultiSelect
              data={venueOptions}
              value={venueIds}
              onChange={(ids) => setVenueIds(ids)}
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
