import ResetPasswordForm from "@/components/forms/reset-password";

export default async function ResetPasswordSentPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;
  return <ResetPasswordForm message={message} />;
}
