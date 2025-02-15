"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mantine/core";

export default function NavigateSlugs() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const newId = Math.floor(Math.random() * 100);
    router.push("/search/" + newId);
  };

  return <Button onClick={handleClick}>Random Slug</Button>;
}
