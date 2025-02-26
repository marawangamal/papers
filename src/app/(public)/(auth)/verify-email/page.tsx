import { Text, Paper, Title, Stack } from "@mantine/core";
import { IconMailFilled } from "@tabler/icons-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = await searchParams;
  return (
    <Paper radius="md" p="xl" withBorder>
      <Stack align="center" gap="lg">
        <IconMailFilled size={32} stroke={1.5} />

        <Title order={2} ta="center">
          Check your email
        </Title>

        <Text size="sm" c="dimmed" ta="center">
          We&apos;ve sent a verification link to{" "}
          <Text span fw="bold">
            {email}
          </Text>
        </Text>
      </Stack>
    </Paper>
  );
}
