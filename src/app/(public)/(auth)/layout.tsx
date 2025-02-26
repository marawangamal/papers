// app/(public)/layout.tsx
import { Center } from "@mantine/core";

export default function CenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Center flex={1}>{children}</Center>;
}
