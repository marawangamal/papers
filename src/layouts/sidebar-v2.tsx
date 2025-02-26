"use client";
import { IconHome2, IconLogout, IconSearch } from "@tabler/icons-react";
import { Center, Stack, Box, useMantineTheme } from "@mantine/core";
import { Logo } from "@/lib/icons/logo-shape";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { useTransition } from "react";
import { NavbarLink } from "./nav-link";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";
import TPaper from "@/components/ui/tpaper";

export function NavbarMinimal() {
  const pathname = usePathname();
  const [isLoggingOut, startLogout] = useTransition();
  const theme = useMantineTheme();

  const mockdata = [
    { icon: IconHome2, label: "Home", path: "/dashboard" },
    { icon: IconSearch, label: "Community", path: "/search" },
  ];

  const handleLogout = () =>
    startLogout(() => {
      logout();
    });

  const links = mockdata.map((link) => (
    <NavbarLink {...link} key={link.label} active={pathname === link.path} />
  ));

  return (
    <TPaper
      // component="nav"
      style={{
        width: 80,
        padding: theme.spacing.md,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "transparent",
        borderTop: "transparent",
        borderBottom: "transparent",
      }}
    >
      <Center>
        <Logo type="mark" size={30} />
      </Center>

      <Box style={{ flex: 1, marginTop: 50 }}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </Box>

      <Stack justify="center" gap={0}>
        <ColorSchemeToggle />
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          path="/logout"
          loading={isLoggingOut}
          onClick={handleLogout}
        />
      </Stack>
    </TPaper>
  );
}
