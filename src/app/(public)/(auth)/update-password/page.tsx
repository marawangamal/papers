import UpdatePasswordForm from "@/components/forms/update-password";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;
  return <UpdatePasswordForm message={message} />;
}
