import { NavbarMinimal } from "@/layouts/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Group } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Group h={"100vh"} w={"100vw"}>
      <NavbarMinimal />
      <Group flex={1} h={"100%"} p={"md"} style={{ overflow: "hidden" }}>
        {children}
      </Group>
    </Group>
  );
}
