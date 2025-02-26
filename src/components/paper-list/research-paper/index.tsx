"use client";
import {
  addToLikedCollection,
  removeFromLikedCollection,
} from "@/lib/actions/collections";
import { Tables } from "@/types/database.types";
import {
  Title,
  Text,
  Stack,
  Card,
  Badge,
  Group,
  Button,
  CopyButton,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconCheck,
  IconEye,
  IconFileText,
  IconHeart,
  IconHeartFilled,
  IconQuoteFilled,
} from "@tabler/icons-react";
import katex from "katex";
import { useTransition } from "react";

function parseLatex(text: string): string {
  return text.replace(/\$(.*?)\$/g, (match, latex) => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        output: "html",
      });
    } catch (e) {
      console.warn("LaTeX parsing error:", e);
      return match;
    }
  });
}

function LatexText({
  text,
  ...props
}: { text: string } & React.ComponentProps<typeof Text>) {
  const parsedText = parseLatex(text);
  return <Text {...props} dangerouslySetInnerHTML={{ __html: parsedText }} />;
}

function generateBibTeX(paper: Tables<"vw_final_papers">) {
  const authors = paper.authors?.join(" and ") || "";
  const year = paper.year || "";
  const titleSum = removeSpecialChars(
    (paper.title || "").split(" ")[0].toLowerCase()
  );
  const key = `${authors
    .split(",")[0]
    .split(" ")
    .pop()
    ?.toLowerCase()}${year}${titleSum}`;

  const urlField = paper.pdf_url ? `  url={${paper.pdf_url}},\n` : "";

  return `@inproceedings{${key},
  title={${paper.title}},
  author={${authors}},
  booktitle={${paper.abbrev || ""}},
  year={${year}}${urlField ? ",\n" + urlField.slice(0, -1) : ""}
}`;
}

const removeSpecialChars = (text: string) =>
  text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export function ResearchPaper({
  paper,
  collectionPapersIds,
}: {
  paper: Tables<"vw_final_papers"> | Tables<"vw_final_collection_papers">;
  collectionPapersIds: Set<string>;
}) {
  const [isLikingPaper, startTransition] = useTransition();

  const handlePaperLikeClick = async (paper: Tables<"vw_final_papers">) => {
    startTransition(async () => {
      if (collectionPapersIds.has(paper.id as string)) {
        await removeFromLikedCollection({ paper_id: paper.id as string });
      } else {
        await addToLikedCollection({ paper_id: paper.id as string });
      }
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
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
              >
                Code
              </Button>
            )}
            <Tooltip label="Copy bibTeX">
              <CopyButton value={generateBibTeX(paper)}>
                {({ copied, copy }) => (
                  <Button
                    onClick={copy}
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
            {collectionPapersIds && (
              <Button
                onClick={() => handlePaperLikeClick(paper)}
                loading={isLikingPaper}
                leftSection={
                  collectionPapersIds.has(paper.id as string) ? (
                    <IconHeartFilled size={16} />
                  ) : (
                    <IconHeart size={16} />
                  )
                }
                variant={
                  collectionPapersIds.has(paper.id as string)
                    ? "light"
                    : "outline"
                }
                color="red"
                size="sm"
              >
                {collectionPapersIds.has(paper.id as string) ? "Liked" : "Like"}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
