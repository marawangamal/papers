"use client";
import TPaper from "@/components/ui/tpaper";
import React from "react";
import { ResearchPaperExpandedProps } from "./expanded";

export function ResearchPaperSummary({ paper }: ResearchPaperExpandedProps) {
  return (
    <TPaper
      style={{ minWidth: "300px", maxWidth: "400px", flex: "0 0 auto" }}
      p="md"
      radius="md"
    >
      <h3
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {paper.title}
      </h3>
      <p
        style={{
          display: "-webkit-box",
          WebkitLineClamp: "3",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {paper.abstract}
      </p>
    </TPaper>
  );
}
