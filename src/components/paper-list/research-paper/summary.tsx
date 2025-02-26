"use client";
import React from "react";
import { ResearchPaperExpandedProps } from "./expanded";
import { Card, Text, Title } from "@mantine/core";

export function ResearchPaperSummary({ paper }: ResearchPaperExpandedProps) {
  return (
    <Card p="md" radius="md" withBorder h="100%">
      <Title size="md">{paper.title}</Title>
      <Text size="sm" lineClamp={3} c="dimmed">
        {paper.abstract}
      </Text>
    </Card>
  );
}
