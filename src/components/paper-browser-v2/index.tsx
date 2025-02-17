"use client";
import { Title, Text, Stack, Card, Badge, Group, Button } from "@mantine/core";
import { IconBrandGithub, IconFileText } from "@tabler/icons-react";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";
import katex from "katex";
import "katex/dist/katex.min.css";

export type PaperBrowserProps = {
  venues: Tables<"venues">[];
  papers: Tables<"vw_final_papers">[];
  searchParams: PaperSearchParams;
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

export function PaperBrowser({ papers }: PaperBrowserProps) {
  return (
    <Stack gap="xl" h="100%" style={{ overflow: "auto" }}>
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
                <Group mt="sm">
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
