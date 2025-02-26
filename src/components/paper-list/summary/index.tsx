"use client";
import React from "react";
import { Card, Group, Stack, Text, Button } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";

interface PaperListSummaryProps {
  papers: Tables<"vw_final_papers">[];
  collectionPapersIds: Set<string>;
}

export function PaperListSummary({
  papers,
  collectionPapersIds,
}: PaperListSummaryProps) {
  return (
    <Stack>
      {papers.map((paper) => (
        <Card key={paper.id} p="md" radius="md" withBorder>
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

          {collectionPapersIds.has(paper.id as string) && (
            <Button
              variant="outline"
              color="red"
              size="xs"
              mt="md"
              onClick={() => {}}
            >
              Remove from Collection
            </Button>
          )}
        </Card>
      ))}
    </Stack>
  );
}
