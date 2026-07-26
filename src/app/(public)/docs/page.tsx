import { getVenues } from "@/lib/actions/venues";
import {
  Anchor,
  Badge,
  Card,
  Code,
  Container,
  Divider,
  Group,
  List,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

export const revalidate = 300;

export const metadata = {
  title: "Papers — API",
  description:
    "Read-only JSON API for semantic search over ML conference papers.",
};

const PAPER_PARAMS: [string, string, string][] = [
  [
    "search",
    "string",
    "Natural-language topical query. Omit to browse without ranking. Each distinct value costs an embedding computation.",
  ],
  ["page", "integer", "1-based page number. 50 results per page. Defaults to 1."],
  [
    "venue",
    "string (repeatable)",
    "Venue abbreviation. Repeat the parameter for several venues: ?venue=NeurIPS&venue=ICML",
  ],
  ["year_min", "integer", "Inclusive lower bound on publication year."],
  ["year_max", "integer", "Inclusive upper bound on publication year."],
  [
    "has_code",
    'literal "true"',
    "Restrict to papers with a known code URL. Only the exact string true enables it.",
  ],
];

const PAPER_FIELDS: [string, string][] = [
  ["id", "Stable identifier for the paper."],
  ["title", "Paper title."],
  ["authors", "Array of author names, in publication order."],
  ["abstract", "Abstract text."],
  ["year", "Publication year of the venue."],
  ["abbrev", "Venue abbreviation, e.g. NeurIPS."],
  ["pdf_url", "Link to the PDF."],
  ["code_url", "Repository URL, when one is known. Null otherwise."],
  ["arxiv_id", "arXiv identifier, when cross-referenced."],
  ["arxiv_url", "arXiv abstract page."],
  ["like_count", "Likes from Papers users."],
  ["view_count", "Views from Papers users."],
  ["created_at", "When the record was ingested — not when the paper was published."],
];

export default async function ApiDocsPage() {
  const venues = await getVenues();
  const abbrevs = venues
    .map((v) => v.abbrev)
    .filter((a): a is string => Boolean(a))
    .sort((a, b) => a.localeCompare(b));

  return (
    <Container size="lg" py="xl" style={{ overflowY: "auto", height: "100%" }}>
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={2}>API</Title>
          <Text c="dimmed" size="sm">
            A read-only JSON API for semantic search over ML conference papers. No
            authentication or API key required.
          </Text>
        </Stack>

        <Stack gap="xs">
          <Text size="sm">
            Machine-readable versions:{" "}
            <Anchor href="/openapi.json" size="sm">
              OpenAPI 3.1 spec
            </Anchor>{" "}
            &middot;{" "}
            <Anchor href="/llms.txt" size="sm">
              llms.txt
            </Anchor>{" "}
            &middot;{" "}
            <Anchor href="/coverage" size="sm">
              venue &amp; year coverage
            </Anchor>
          </Text>
        </Stack>

        <Card withBorder radius="md" padding="md">
          <Stack gap="sm">
            <Text fw={600} size="sm">
              Quick start
            </Text>
            <Code block>
              {`curl "https://papers.app/api/papers?search=sparse+attention+for+long+context"`}
            </Code>
            <Text size="xs" c="dimmed">
              Search is embedding-based: your query is embedded with a gte-small model and
              matched against abstracts by cosine similarity. Prefer natural-language
              topics (&ldquo;sparse attention for long context&rdquo;) over boolean keyword
              strings (&ldquo;sparse AND attention&rdquo;), which match poorly.
            </Text>
          </Stack>
        </Card>

        <Divider />

        <Stack gap="sm">
          <Title order={3} size="h4">
            <Code>GET /api/papers</Code>
          </Title>
          <Text size="sm" c="dimmed">
            Search or browse papers. With <Code>search</Code>, results are ranked by
            semantic similarity. Without it, filters still apply but ordering is
            unspecified.
          </Text>

          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Parameter</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PAPER_PARAMS.map(([name, type, desc]) => (
                <Table.Tr key={name}>
                  <Table.Td>
                    <Code>{name}</Code>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {type}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{desc}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Code block>
            {`{
  "success": true,
  "count": 50,
  "results": [
    {
      "id": "…",
      "title": "…",
      "authors": ["…", "…"],
      "abstract": "…",
      "year": 2025,
      "abbrev": "NeurIPS",
      "pdf_url": "…",
      "code_url": null
    }
  ]
}`}
          </Code>
        </Stack>

        <Stack gap="sm">
          <Title order={3} size="h4">
            <Code>GET /api/venues</Code>
          </Title>
          <Text size="sm" c="dimmed">
            Lists the venue abbreviations accepted by the <Code>venue</Code> filter.
            Currently indexed:
          </Text>
          <Group gap="xs">
            {abbrevs.map((abbrev) => (
              <Badge key={abbrev} variant="light" radius="sm">
                {abbrev}
              </Badge>
            ))}
          </Group>
          <Code block>
            {`{ "success": true, "count": ${abbrevs.length}, "venues": [{ "abbrev": "${
              abbrevs[0] ?? "NeurIPS"
            }" }] }`}
          </Code>
        </Stack>

        <Divider />

        <Stack gap="sm">
          <Title order={3} size="h4">
            Paper fields
          </Title>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Field</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PAPER_FIELDS.map(([name, desc]) => (
                <Table.Tr key={name}>
                  <Table.Td>
                    <Code>{name}</Code>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{desc}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text size="xs" c="dimmed">
            Responses may include additional internal fields — notably{" "}
            <Code>abstract_embedding</Code>, a large raw vector, plus{" "}
            <Code>venue_id</Code>, <Code>status</Code> and <Code>normalized_title</Code>.
            These are not part of the stable contract. Ignore any field not listed above.
          </Text>
        </Stack>

        <Divider />

        <Stack gap="sm">
          <Title order={3} size="h4">
            Behaviour worth knowing
          </Title>
          <List size="sm" spacing="xs">
            <List.Item>
              <Code>count</Code> is the number of results on the current page, not the
              total number of matches. There is no total-count field — infer the last page
              from a <Code>count</Code> below 50.
            </List.Item>
            <List.Item>
              Without <Code>search</Code>, result ordering is unspecified. Do not rely on
              it being sorted by date or relevance.
            </List.Item>
            <List.Item>
              <Code>has_code</Code> only activates on the exact string <Code>true</Code>.
            </List.Item>
            <List.Item>
              Non-numeric <Code>year_min</Code> / <Code>year_max</Code> currently return
              HTTP 500 rather than 400.
            </List.Item>
            <List.Item>
              Errors return <Code>{`{ "success": false, "error": "…" }`}</Code>.
            </List.Item>
            <List.Item>
              Responses are cached for 300 seconds (
              <Code>s-maxage=300, stale-while-revalidate=60</Code>).
            </List.Item>
          </List>
        </Stack>

        <Card withBorder radius="md" padding="md">
          <Stack gap="xs">
            <Text fw={600} size="sm">
              Usage expectations
            </Text>
            <Text size="sm">
              Each distinct <Code>search</Code> string costs an embedding computation and a
              vector scan, so it is not free to serve. There is currently no enforced rate
              limit — please stay under roughly 20 search requests per minute, reuse
              identical query strings rather than perturbing them, and request only the
              pages you need.
            </Text>
            <Text size="sm">
              Rate limiting will be introduced, at which point exceeding it returns HTTP
              429 with a <Code>Retry-After</Code> header. Handle that status now if you are
              writing a long-running client.
            </Text>
            <Text size="xs" c="dimmed">
              Paper metadata is scraped from public conference proceedings. Abstracts
              remain the copyright of their original authors and publishers.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
