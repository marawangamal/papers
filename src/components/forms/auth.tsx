"use client";
import {
  Text,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Anchor,
  Stack,
  Tabs,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { loginWithEmail, signupWithEmail } from "@/lib/actions/auth";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { ENDPOINTS } from "@/config/const";
interface FormValues {
  email: string;
  password: string;
  mode: AuthAction; // Add this
}

type AuthAction = "login" | "signup";

export type AuthFormProps = {
  error?: string;
  message?: string;
};

export default function AuthForm({ message, error }: AuthFormProps) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      mode: "login" as AuthAction, // Add initial value
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const handler =
        form.values.mode === "login" ? loginWithEmail : signupWithEmail;
      await handler(values);
    } finally {
      form.reset();
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="lg">
        Welcome
      </Title>

      <Tabs
        defaultValue="login"
        value={form.values.mode}
        onChange={(value) => form.setFieldValue("mode", value as AuthAction)}
      >
        <Tabs.List grow mb="lg">
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>

        {message && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
            {message}
          </Alert>
        )}

        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {form.values.mode === "signup" && (
              <>
                <TextInput
                  required
                  label="First Name"
                  placeholder="Your first name"
                  {...form.getInputProps("first_name")}
                />
                <TextInput
                  required
                  label="Last Name"
                  placeholder="Your last name"
                  {...form.getInputProps("last_name")}
                />
              </>
            )}

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps("password")}
            />

            {form.values.mode === "login" && (
              <Anchor
                component={Link}
                href={ENDPOINTS.resetPasswordPage}
                size="sm"
                ta="right"
              >
                Forgot password?
              </Anchor>
            )}

            <Button fullWidth type="submit" loading={form.submitting}>
              {form.values.mode === "login" ? "Login" : "Sign Up"}
            </Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="lg">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </Tabs>
    </Paper>
  );
}
