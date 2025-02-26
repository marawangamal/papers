import { Box, Container, Stack } from "@mantine/core";
import React from "react";

export default function ScrollableContainerPinnedHeader({
  outerContainerProps,
  innerContainerProps,
}: {
  innerContainerProps?: React.ComponentProps<typeof Container>;
  outerContainerProps?: React.ComponentProps<typeof Container>;
}) {
  return (
    <Stack h="100%" w="100%" style={{ overflow: "hidden" }}>
      <Container w="100%" size="lg" {...outerContainerProps} />
      <Box flex={1} h="100%" w="100%" style={{ overflow: "auto" }}>
        <Container size="lg" {...innerContainerProps} />
      </Box>
    </Stack>
  );
}

{
  /* <Stack style={{ height: "100%", overflow: "hidden" }}>
  <Container w="100%" size="lg">
    <PageFilter searchParams={awaitedSearchParams} />
  </Container>
  <Box flex={1} style={{ overflow: "auto" }}>
    <Container size="lg">
      <PageContent searchParams={awaitedSearchParams} />
    </Container>
  </Box>
</Stack> */
}
