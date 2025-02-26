"use client";
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
  IconFileText,
  IconHeart,
  IconQuoteFilled,
} from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useTransition } from "react";
import { addToLikedCollection } from "@/lib/actions/collections";

const removeSpecialChars = (text: string) =>
  text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

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

export type PaperBrowserProps = {
  papers: Tables<"vw_final_papers">[];
  searchParams: PaperSearchParams;
  is_like_enabled?: boolean;
};

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

export function PaperBrowser({ papers, is_like_enabled }: PaperBrowserProps) {
  const [isLiking, startTransition] = useTransition();
  const handleLike = (paper: Tables<"vw_final_papers">) => {
    startTransition(async () => {
      await addToLikedCollection({ paper_id: paper.id as string });
    });
  };
  return (
    <Stack gap="xl" h="100%">
      {papers.length > 0 ? (
        <Stack gap="md">
          {papers.map((paper, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between" align="center">
                  <Title order={5} style={{ flex: 1 }}>
                    {paper.title ? (
                      <LatexText text={paper.title} />
                    ) : (
                      "Untitled"
                    )}
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

                <Group mt="sm" justify="space-between">
                  <Group>
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
                  </Group>
                  <Group>
                    {is_like_enabled && (
                      <Button
                        onClick={() => handleLike(paper)}
                        loading={isLiking}
                        leftSection={<IconHeart size={16} />}
                        variant="light"
                        color="gray"
                        size="sm"
                      >
                        Like
                      </Button>
                    )}
                  </Group>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text>No papers found</Text>
      )}
    </Stack>
  );
}
