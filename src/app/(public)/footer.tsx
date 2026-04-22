import { ActionIcon, Anchor, Group, Container } from "@mantine/core";
import { IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";

const links = [
  { link: "/coverage", label: "Coverage", external: false },
  { link: "/legal/privacy.html", label: "Privacy", external: true },
  { link: "/legal/terms.html", label: "Terms", external: true },
];

export default function Footer() {
  return (
    <Container py="xl">
      <Group justify="space-between" align="center">
        <Group gap="lg">
          {links.map((link) => (
            <Anchor
              key={link.label}
              href={link.link}
              c="dimmed"
              size="sm"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </Anchor>
          ))}
        </Group>

        <Group>
          <ActionIcon variant="subtle" size="lg">
            <IconBrandTwitter size={18} />
          </ActionIcon>
          <ActionIcon variant="subtle" size="lg">
            <IconBrandYoutube size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Container>
  );
}
