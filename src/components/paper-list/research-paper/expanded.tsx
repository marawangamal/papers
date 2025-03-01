"use client";
import TPaper from "@/components/ui/tpaper";
import { createEvent } from "@/lib/actions/papers";
import { Tables } from "@/types/database.types";
import {
  Title,
  Text,
  Stack,
  Badge,
  Group,
  Button,
  CopyButton,
  Tooltip,
} from "@mantine/core";
import {
  IconArchive,
  IconBrandGithub,
  IconCheck,
  IconEye,
  IconFileText,
  IconHeart,
  IconHeartFilled,
  IconQuoteFilled,
} from "@tabler/icons-react";

function LatexText({
  text,
  ...props
}: { text: string } & React.ComponentProps<typeof Text>) {
  return <Text {...props} dangerouslySetInnerHTML={{ __html: text }} />;
}

export type ResearchPaperExpandedProps = {
  paper: Tables<"vw_final_papers"> | Tables<"vw_final_collection_papers">;
  // collectionPapersIds: Set<string>;
  onLikeClick?: (paper: Tables<"vw_final_papers">) => void;
  isLiked: boolean;
  bibTeX: string;
  isLoading?: boolean;
  isStatsVisible?: boolean;
  isLikeVisible?: boolean;
};
export function ResearchPaperExpanded({
  paper,
  isLikeVisible,
  isLiked,
  bibTeX,
  isLoading,
  isStatsVisible = false,
  onLikeClick,
}: ResearchPaperExpandedProps) {
  return (
    <TPaper p="lg" radius="md">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Title order={5} style={{ flex: 1 }}>
            {paper.title ? <LatexText text={paper.title} /> : "Untitled"}
          </Title>
          <Group gap="xs">
            <Badge variant="light" color="blue">
              {paper.abbrev}
            </Badge>
            <Badge variant="outline" color="gray">
              {paper.year}
            </Badge>
          </Group>
        </Group>
        <Text size="sm" c="dimmed">
          {paper.authors?.join(", ") || "No authors listed"}
        </Text>
        {paper.abstract && <LatexText text={paper.abstract} />}

        <Group mt="md" justify="space-between" align="center">
          {isStatsVisible && (
            <Group gap="xs">
              <Tooltip label={paper.view_count + " views"}>
                <Group gap={6} style={{ color: "var(--mantine-color-dimmed)" }}>
                  <IconEye size={16} stroke={1.5} />
                  <Text size="sm" span>
                    {paper.view_count || 0}
                  </Text>
                </Group>
              </Tooltip>
              <Tooltip label={paper.like_count + " likes"}>
                <Group
                  gap={6}
                  style={{ color: "var(--mantine-color-red-filled)" }}
                >
                  <IconHeartFilled size={16} stroke={1.5} />
                  <Text size="sm" span>
                    {paper.like_count || 0}
                  </Text>
                </Group>
              </Tooltip>
            </Group>
          )}

          <Group gap="md">
            {paper.pdf_url && (
              <Button
                component="a"
                href={paper.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconFileText size={16} />}
                variant="light"
                color="blue"
                size="sm"
                onClick={() => {
                  createEvent({
                    event: "view",
                    paper_id: paper.id,
                  });
                }}
              >
                PDF
              </Button>
            )}
            {paper.code_url && (
              <Button
                component="a"
                href={paper.code_url}
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconBrandGithub size={16} />}
                variant="light"
                color="green"
                size="sm"
                onClick={() => {
                  createEvent({
                    event: "view",
                    paper_id: paper.id,
                  });
                }}
              >
                Code
              </Button>
            )}
            {paper.arxiv_url && (
              <Button
                component="a"
                href={paper.arxiv_url}
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconArchive size={16} />}
                variant="light"
                color="orange"
                size="sm"
                onClick={() => {
                  createEvent({
                    event: "view",
                    paper_id: paper.id,
                  });
                }}
              >
                arXiv
              </Button>
            )}
            <Tooltip label="Copy bibTeX">
              <CopyButton value={bibTeX}>
                {({ copied, copy }) => (
                  <Button
                    onClick={() => {
                      copy();
                      createEvent({
                        event: "view",
                        paper_id: paper.id,
                      });
                    }}
                    leftSection={
                      copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconQuoteFilled size={16} />
                      )
                    }
                    variant="light"
                    color="gray"
                    size="sm"
                  >
                    {copied ? "Copied" : "BibTeX"}
                  </Button>
                )}
              </CopyButton>
            </Tooltip>
            {isLikeVisible && onLikeClick && (
              <Button
                onClick={() => onLikeClick(paper)}
                loading={isLoading}
                leftSection={
                  isLiked ? (
                    <IconHeartFilled size={16} />
                  ) : (
                    <IconHeart size={16} />
                  )
                }
                variant={isLiked ? "light" : "outline"}
                color="red"
                size="sm"
              >
                {isLiked ? "Liked" : "Like"}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </TPaper>
  );
}
