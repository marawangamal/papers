"use client";
import { IconHome2, IconLogout, IconSearch } from "@tabler/icons-react";
import {
  Center,
  Stack,
  Box,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { Logo } from "@/lib/icons/logo-shape";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { useTransition } from "react";
import { useMounted } from "@mantine/hooks";
import { NavbarLink } from "./nav-link";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";

const mockdata = [
  // { icon: IconLayoutGrid, label: "Browse", path: "/browse" },
  // { icon: IconPencil, label: "Create", path: "/create" },
  { icon: IconHome2, label: "Home", path: "/dashboard" },
  // { icon: IconCirclePlus, label: "Create", path: "/create" },
  { icon: IconSearch, label: "Search", path: "/search" },
  // { icon: IconWorld, label: "Community", path: "/community" },
  // { icon: IconSettings, label: "Settings", path: "/settings" },
];

export function NavbarMinimal() {
  const pathname = usePathname();
  const [isLoggingOut, startLogout] = useTransition();
  const theme = useMantineTheme();

  const handleLogout = () =>
    startLogout(() => {
      logout();
    });

  const links = mockdata.map((link) => (
    <NavbarLink {...link} key={link.label} active={pathname === link.path} />
  ));

  const { colorScheme } = useMantineColorScheme();
  const isMounted = useMounted();

  return isMounted ? (
    <Box
      component="nav"
      style={{
        width: 80,
        padding: theme.spacing.md,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[7] : "#F7F7F7",
        borderRight: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
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
    </Box>
  ) : null;
}
