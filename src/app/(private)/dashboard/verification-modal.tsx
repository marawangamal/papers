"use client";
import { Modal, Text, Button, Stack } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const VerificationModal = () => {
  const [opened, setOpened] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if payment=success is in the URL
    if (searchParams.get("verification") === "success") {
      setOpened(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setOpened(false);
    // Remove the query parameters from the URL without a page refresh
    router.replace("/dashboard");
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Email Verified!"
      centered
    >
      <Stack>
        <Text>
          Your email has been verified. You can now access the dashboard.
        </Text>
        <Button onClick={handleClose} rightSection={<IconArrowRight />}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
