"use client";
import { Title, Text, Stack, Anchor, Card } from "@mantine/core";
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
  // Replace $...$ with rendered LaTeX
  return text.replace(/\$(.*?)\$/g, (match, latex) => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        output: "html",
      });
    } catch (e) {
      console.warn("LaTeX parsing error:", e);
      return match; // Return original text if parsing fails
    }
  });
}

// Separate component for LaTeX text to prevent unnecessary re-renders
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
              <Stack>
                <Title order={5}>
                  {paper.title ? <LatexText text={paper.title} /> : "Untitled"}
                </Title>
                <Text size="sm" c="dimmed">
                  {paper.authors?.join(", ") || "No authors listed"}
                </Text>
                {paper.abstract && <LatexText text={paper.abstract} />}
                {paper.pdf_url && (
                  <Anchor
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    View PDF
                  </Anchor>
                )}
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
