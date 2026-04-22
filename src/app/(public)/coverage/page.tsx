import { getVenueCoverage } from "@/lib/actions/venues";
import { Badge, Card, Container, Group, Stack, Text, Title } from "@mantine/core";

export const revalidate = 300;

export default async function CoveragePage() {
  const rows = await getVenueCoverage();

  const byVenue = new Map<string, { year: number; paper_count: number }[]>();
  let totalPapers = 0;
  for (const row of rows) {
    if (!row.abbrev || row.year == null) continue;
    const entries = byVenue.get(row.abbrev) ?? [];
    entries.push({ year: row.year, paper_count: row.paper_count ?? 0 });
    byVenue.set(row.abbrev, entries);
    totalPapers += row.paper_count ?? 0;
  }

  const venues = Array.from(byVenue.entries())
    .map(([abbrev, entries]) => ({
      abbrev,
      entries: entries.sort((a, b) => a.year - b.year),
      total: entries.reduce((sum, e) => sum + e.paper_count, 0),
    }))
    .sort((a, b) => a.abbrev.localeCompare(b.abbrev));

  return (
    <Container size="lg" py="xl" style={{ overflowY: "auto", height: "100%" }}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2}>Coverage</Title>
          <Text c="dimmed" size="sm">
            Conferences and years currently indexed — {totalPapers.toLocaleString()} papers across {venues.length} venues.
          </Text>
        </Stack>

        <Stack gap="sm">
          {venues.map((venue) => (
            <Card key={venue.abbrev} withBorder radius="md" padding="md">
              <Group justify="space-between" align="center" wrap="nowrap">
                <Stack gap={2}>
                  <Text fw={600}>{venue.abbrev}</Text>
                  <Text size="xs" c="dimmed">
                    {venue.total.toLocaleString()} papers
                  </Text>
                </Stack>
                <Group gap="xs" justify="flex-end">
                  {venue.entries.map((entry) => (
                    <Badge
                      key={entry.year}
                      variant="light"
                      radius="sm"
                      title={`${entry.paper_count.toLocaleString()} papers`}
                    >
                      {entry.year}
                    </Badge>
                  ))}
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
