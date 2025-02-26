"use server";
import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

export type LoginPhoneFormData = {
  phone: string;
};

export async function loginWithPhone({ phone }: LoginPhoneFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
    options: {
      // Only login if user already exists
      shouldCreateUser: false,
    },
  });

  if (error) {
    return redirect("/login?message=" + error.message);
  }

  return redirect("/verify/phone?phone=" + encodeURIComponent(phone));
}

export type SignupPhoneFormData = {
  phone: string;
  first_name: string;
  last_name: string;
};

export type ResendVerificationCodeFormData = {
  phone: string;
};

export async function resendVerificationCode({
  phone,
}: ResendVerificationCodeFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return redirect("/verify?message=" + error.message);
  }
  return redirect("/verify/phone?phone=" + encodeURIComponent(phone));
}

export async function verifyPhone(formData: FormData) {
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: "sms",
  });

  if (error) {
    return redirect(
      "/verify/phone?message=" +
        error.message +
        "&phone=" +
        encodeURIComponent(phone)
    );
  }

  return redirect("/dashboard");
}
