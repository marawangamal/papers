// app/(public)/layout.tsx
import SignInButton from "@/components/buttons/sign-in";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";
import { Box, Button, Container, Group, Stack, Text } from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack h="100vh" justify="space-between" style={{ paddingBottom: 20 }}>
      <Container w="100%" size="lg">
        <Group
          justify="space-between"
          align="center"
          style={{
            paddingTop: 10,
          }}
        >
          <Group justify="space-between" align="center" w="100%">
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Group>
                <IconPaperclip size={28} stroke={1.5} />
                <Text size="xl" fw={700}>
                  Papers
                </Text>
              </Group>
            </Link>
            <Group>
              <Button
                component={Link}
                href="/coverage"
                variant="subtle"
                color="gray"
                size="sm"
              >
                Coverage
              </Button>
              <Button
                component="a"
                href="https://github.com/marawangamal/papers"
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="sm"
              >
                GitHub
              </Button>
              <ColorSchemeToggle />
              <SignInButton />
            </Group>
          </Group>
        </Group>
      </Container>
      <Box flex={1} style={{ overflowY: "hidden" }}>
        {children}
      </Box>
    </Stack>
  );
}
