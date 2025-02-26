import React from "react";
import { ResearchPaperExpandedProps } from "./expanded";
import { Button, Group, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import TPaper from "@/components/ui/tpaper";

export default function ResearchPaperCollapsed({
  paper,
  onLikeClick,
  isLoading,
}: ResearchPaperExpandedProps) {
  return (
    <TPaper key={paper.id} p="md" radius="md">
      <Group mb="xs" justify="space-between">
        <Text fw={700} size="md">
          {paper.title}
        </Text>

        <Group>
          <IconHeart
            size={16}
            stroke={1.5}
            color="var(--mantine-color-red-filled)"
          />
          <Text size="sm" color="red">
            {paper.like_count || 0}
          </Text>
        </Group>
      </Group>

      <Text size="sm" c="dimmed">
        Year: {paper.year || "N/A"}
      </Text>

      <Button
        variant="outline"
        color="red"
        size="xs"
        mt="md"
        loading={isLoading}
        onClick={() => onLikeClick(paper)}
      >
        Remove from Collection
      </Button>
    </TPaper>
  );
}
