"use client";
import { Button } from "@mantine/core";
import { redirect } from "next/navigation";
import React from "react";

export default function SignInButton() {
  return (
    <Button
      variant="light"
      color="gray"
      size="sm"
      onClick={() => redirect("/login")}
    >
      Sign in
    </Button>
  );
}
