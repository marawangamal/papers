import { Stack } from "@mantine/core";
import NavigateSlugs from "./nav";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Add short delay to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const awaitedParams = await params;
  const { id } = awaitedParams;

  return (
    <Stack>
      My Post: {id}
      <NavigateSlugs />
    </Stack>
  );
}
