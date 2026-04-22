"use client";
import {
  Button,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isLight = computedColorScheme === "light";

  return (
    <Button
      onClick={() => setColorScheme(isLight ? "dark" : "light")}
      variant="subtle"
      color="gray"
      size="sm"
      aria-label="Toggle color scheme"
      leftSection={
        isLight ? (
          <IconMoon size={16} stroke={1.5} />
        ) : (
          <IconSun size={16} stroke={1.5} />
        )
      }
    >
      {isLight ? "Dark" : "Light"}
    </Button>
  );
}
