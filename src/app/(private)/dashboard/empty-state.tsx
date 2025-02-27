"use client";
import { ENDPOINTS } from "@/config/const";
import { Button, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function EmptyState() {
  const [isRedirecting, startRedirect] = useTransition();
  const router = useRouter();

  return (
    <Stack
      gap="xs"
      h="100%"
      justify="center"
      align="center"
      style={{ textAlign: "center" }}
    >
      <Title order={2} size="md">
        No papers found
      </Title>
      <Text size="sm" c="dimmed">
        Your liked papers will appear here
      </Text>
      <Button
        loading={isRedirecting}
        variant="light"
        color="blue"
        leftSection="🔍"
        onClick={() => {
          // Navigate to the search page
          startRedirect(() => {
            router.push(ENDPOINTS.search);
          });
        }}
      >
        Search for papers
      </Button>
    </Stack>
  );
}
