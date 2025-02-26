"use client";
import { Paper, PaperProps } from "@mantine/core";
import { ReactNode } from "react";

type TPaperProps = PaperProps & { children?: ReactNode };

export default function TPaper(props: TPaperProps) {
  return (
    <Paper
      {...props}
      className="tc-paper"
      style={{
        ...props.style,
      }}
    />
  );
}
