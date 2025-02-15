import { redirect } from "next/navigation";

export default function Page() {
  // Generate random number between 1000 and 9999
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  // Redirect to search page with random number
  redirect(`/search/${randomNumber}`);
}
