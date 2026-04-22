import { Card, Container, Group, Skeleton, Stack } from "@mantine/core";

export default function CoverageLoading() {
  return (
    <Container size="lg" py="xl" style={{ overflowY: "auto", height: "100%" }}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Skeleton height={28} width={160} />
          <Skeleton height={14} width={320} />
        </Stack>
        <Stack gap="sm">
          {[...Array(6)].map((_, i) => (
            <Card key={i} withBorder radius="md" padding="md">
              <Group justify="space-between" align="center" wrap="nowrap">
                <Stack gap={4}>
                  <Skeleton height={16} width={80} />
                  <Skeleton height={12} width={60} />
                </Stack>
                <Group gap="xs" justify="flex-end">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} height={22} width={48} radius="sm" />
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
