import AuthForm from "@/components/forms/auth";

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return <AuthForm message={message} />;
}
