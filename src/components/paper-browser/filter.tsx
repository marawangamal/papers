// PaperFilters.tsx
"use client";
import {
  MultiSelect,
  TextInput,
  Group,
  Stack,
  Popover,
  Button,
  Badge,
} from "@mantine/core";
import { IconBooks, IconSearch, IconFilter } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { useState } from "react";

type PaperFiltersProps = {
  venues: Tables<"venues">[];
  selectedVenues: string[];
  searchTerm: string;
  onVenueChange: (venues: string[]) => void;
  onSearchChange: (search: string) => void;
};

export function PaperFilters({
  venues,
  selectedVenues,
  searchTerm,
  onVenueChange,
  onSearchChange,
}: PaperFiltersProps) {
  const [opened, setOpened] = useState(false);
  const venueOptions = venues.map((v) => ({
    value: v.id,
    label: `${v.abbrev} ${v.year}`,
  }));

  const activeFiltersCount = [selectedVenues.length > 0].filter(Boolean).length;

  return (
    <Group>
      <TextInput
        placeholder="Search for papers"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1 }}
        radius="md"
      />

      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom-end"
        shadow="md"
      >
        <Popover.Target>
          <Button
            variant={activeFiltersCount > 0 ? "filled" : "light"}
            leftSection={<IconFilter size={16} />}
            onClick={() => setOpened((o) => !o)}
            radius="md"
          >
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                size="xs"
                variant="filled"
                ml={5}
                circle
                style={{ verticalAlign: "middle" }}
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </Popover.Target>

        <Popover.Dropdown>
          <Stack gap="md" maw={300}>
            <MultiSelect
              label="Conferences"
              placeholder="Choose conferences"
              data={venueOptions}
              value={selectedVenues}
              onChange={onVenueChange}
              leftSection={<IconBooks size={16} />}
              searchable
              clearable
            />
            {/* We can add more filters here later */}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
