"use client";
import React from "react";
import { ResearchPaperExpandedProps } from "./expanded";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";

export function ResearchPaperSummary({ paper }: ResearchPaperExpandedProps) {
  return (
    <Card p="md" radius="md" withBorder h="100%">
      <Stack justify="space-between" h="100%">
        <Stack gap="xs">
          <Title size="sm" lineClamp={1}>
            {paper.title}
          </Title>
          <Text size="xs" lineClamp={2} c="dimmed">
            {paper.abstract}
          </Text>
        </Stack>
        <Group gap="xs">
          <Badge variant="light" color="blue" size="xs">
            {paper.abbrev}
          </Badge>
          <Badge variant="outline" color="gray" size="xs">
            {paper.year}
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
}
