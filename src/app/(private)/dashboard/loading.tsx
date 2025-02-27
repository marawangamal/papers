import { Center, Loader, Stack, Text } from "@mantine/core";
import React from "react";

export default function Loading() {
  return (
    <Center h="100vh" w="100%">
      <Stack align="center" gap="xs">
        <Loader size="lg" type="dots" />
        <Text c="dimmed">Loading</Text>
      </Stack>
    </Center>
  );
}
