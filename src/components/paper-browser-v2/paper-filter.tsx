// PaperFilters.tsx
"use client";
import {
  MultiSelect,
  TextInput,
  Group,
  Popover,
  Button,
  Badge,
  Stack,
  Title,
} from "@mantine/core";
import { IconBooks, IconSearch, IconFilter } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { useState } from "react";

type PaperFiltersProps = {
  venues: Tables<"venues">[];
  selectedVenues: string[];
  initialSearch?: string;
  onVenueChange?: (venues: string[]) => void;
  onSearchClick?: (search: string) => void;
  isLoading?: boolean;
};

export function PaperFilters({
  venues,
  initialSearch,
  selectedVenues,
  onVenueChange,
  onSearchClick,
  isLoading,
}: PaperFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [opened, setOpened] = useState(false);
  const venueOptions = venues.map((v) => ({
    value: v.id,
    label: `${v.abbrev} ${v.year}`,
  }));

  const activeFiltersCount = selectedVenues.length > 0 ? 1 : 0;

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
            variant={"filled"}
            onClick={() => setOpened((o) => !o)}
            radius="md"
          >
            <Group>
              <IconFilter size={18} />
              {activeFiltersCount > 0 && (
                <Badge size="sm" ml="xs">
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
              value={selectedVenues}
              onChange={onVenueChange}
              placeholder="Select venues"
              description="Filter by conference"
              searchable
              clearable
            />
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <TextInput
        placeholder="Search papers..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        leftSection={<IconBooks size={18} />}
        style={{ flex: 1 }}
        radius="md"
        disabled={isLoading}
      />
      <Button
        onClick={() => onSearchClick && onSearchClick(searchTerm)}
        radius="md"
        variant="filled"
        loading={isLoading}
      >
        <IconSearch size={18} />
      </Button>
    </Group>
  );
}
