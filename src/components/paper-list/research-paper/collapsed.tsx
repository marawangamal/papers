import { ActionIcon, Badge, Group, Stack, Text, Title } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import TPaper from "@/components/ui/tpaper";
import { ResearchPaperExpandedProps } from "./expanded";

export default function ResearchPaperCollapsed({
  paper,
  onLikeClick,
  isLoading,
}: ResearchPaperExpandedProps) {
  return (
    <TPaper p="sm" radius="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="md">{paper.title}</Title>
          <Group gap="xs">
            <Badge variant="light" color="blue">
              {paper.abbrev}
            </Badge>
            <Badge variant="outline" color="gray">
              {paper.year}
            </Badge>
            <ActionIcon
              variant="subtle"
              color="red"
              size="xs"
              loading={isLoading}
              onClick={() => onLikeClick(paper)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Group>
        <Text size="sm" lineClamp={1} c="dimmed">
          {paper.abstract}
        </Text>
      </Stack>
    </TPaper>
  );
}
