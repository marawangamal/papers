"use server";
import { ENDPOINTS } from "@/config/const";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface EmailAuthFormData {
  email: string;
  password: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : (process.env.NEXT_PUBLIC_URL as string);

export interface SignupEmailFormData extends EmailAuthFormData {
  first_name?: string;
  last_name?: string;
}

export async function loginWithEmail({ email, password }: EmailAuthFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`${ENDPOINTS.login}?message=${error.message}`);
  }

  return redirect(ENDPOINTS.dashboard);
}

export async function signupWithEmail({
  email,
  password,
  first_name,
  last_name,
}: SignupEmailFormData) {
  const supabase = await createClient();
  const emaileRedirectTo = new URL(SITE_URL);
  emaileRedirectTo.pathname = ENDPOINTS.emailVerificationCallback;
  emaileRedirectTo.searchParams.set("next", ENDPOINTS.dashboard);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
      },
      emailRedirectTo: emaileRedirectTo.toString(),
    },
  });

  if (error) {
    return redirect(
      `${ENDPOINTS.login}?message=${
        error.message || "An unexpected error occurred"
      }`
    );
  }
  return redirect(
    `${ENDPOINTS.emailVerificationSentPage}?email=${encodeURIComponent(email)}`
  );
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(ENDPOINTS.root);
}

export async function resendVerificationEmail({ email }: { email: string }) {
  const supabase = await createClient();
  const emaileRedirectTo = new URL(SITE_URL);
  emaileRedirectTo.pathname = ENDPOINTS.emailVerificationCallback;

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: emaileRedirectTo.toString(),
    },
  });

  if (error) {
    return redirect(
      `${ENDPOINTS.emailVerificationSentPage}?message=${error.message}`
    );
  }
  return redirect(
    `${ENDPOINTS.emailVerificationSentPage}?email=${encodeURIComponent(email)}`
  );
}

export async function resetPassword({ email }: { email: string }) {
  const supabase = await createClient();
  const redirectTo = new URL(SITE_URL);
  redirectTo.pathname = ENDPOINTS.resetPasswordCallback;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(), // this redirects to the update password page
  });

  if (error) {
    return redirect(
      `${ENDPOINTS.resetPasswordSentPage}?message=${error.message}`
    );
  }
  return redirect(
    `${ENDPOINTS.resetPasswordSentPage}?message=Check your email for a password reset link.`
  );
}

export async function updatePassword({ password }: { password: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect(`${ENDPOINTS.updatePasswordPage}?message=${error.message}`);
  }

  return redirect(ENDPOINTS.dashboard);
}
