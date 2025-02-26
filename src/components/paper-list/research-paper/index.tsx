"use client";
import {
  addToLikedCollection,
  removeFromLikedCollection,
} from "@/lib/actions/collections";
import { Tables } from "@/types/database.types";

import katex from "katex";
import { useTransition } from "react";
import { ResearchPaperExpanded } from "./expanded";
import { ResearchPaperSummary } from "./summary";
import ResearchPaperCollapsed from "./collapsed";

function parseLatex(text: string): string {
  return text.replace(/\$(.*?)\$/g, (match, latex) => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        output: "html",
      });
    } catch (e) {
      console.warn("LaTeX parsing error:", e);
      return match;
    }
  });
}

function generateBibTeX(paper: Tables<"vw_final_papers">) {
  const authors = paper.authors?.join(" and ") || "";
  const year = paper.year || "";
  const titleSum = removeSpecialChars(
    (paper.title || "").split(" ")[0].toLowerCase()
  );
  const key = `${authors
    .split(",")[0]
    .split(" ")
    .pop()
    ?.toLowerCase()}${year}${titleSum}`;

  const urlField = paper.pdf_url ? `  url={${paper.pdf_url}},\n` : "";

  return `@inproceedings{${key},
  title={${paper.title}},
  author={${authors}},
  booktitle={${paper.abbrev || ""}},
  year={${year}}${urlField ? ",\n" + urlField.slice(0, -1) : ""}
}`;
}

const removeSpecialChars = (text: string) =>
  text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export function ResearchPaper({
  paper,
  mode = "expanded",
  collectionPapersIds,
  isLikeVisible = false,
}: {
  paper: Tables<"vw_final_papers"> | Tables<"vw_final_collection_papers">;
  mode?: "expanded" | "summary" | "collapsed";
  collectionPapersIds: Set<string>;
  isLikeVisible?: boolean;
}) {
  const [isLikingPaper, startTransition] = useTransition();

  const handlePaperLikeClick = async (paper: Tables<"vw_final_papers">) => {
    startTransition(async () => {
      if (collectionPapersIds.has(paper.id as string)) {
        await removeFromLikedCollection({ paper_id: paper.id as string });
      } else {
        await addToLikedCollection({ paper_id: paper.id as string });
      }
    });
  };

  const parsedPaper = {
    ...paper,
    title: parseLatex(paper.title || ""),
    abstract: parseLatex(paper.abstract || ""),
  };

  if (mode === "expanded") {
    return (
      <ResearchPaperExpanded
        paper={parsedPaper}
        onLikeClick={handlePaperLikeClick}
        isLiked={collectionPapersIds.has(paper.id as string)}
        bibTeX={generateBibTeX(paper)}
        isLoading={isLikingPaper}
        isLikeVisible={isLikeVisible}
      />
    );
  } else if (mode === "summary") {
    return (
      <ResearchPaperSummary
        paper={parsedPaper}
        onLikeClick={handlePaperLikeClick}
        isLiked={collectionPapersIds.has(paper.id as string)}
        bibTeX={generateBibTeX(paper)}
        isLoading={isLikingPaper}
        isLikeVisible={isLikeVisible}
      />
    );
  } else {
    return (
      <ResearchPaperCollapsed
        paper={parsedPaper}
        onLikeClick={handlePaperLikeClick}
        isLiked={collectionPapersIds.has(paper.id as string)}
        bibTeX={generateBibTeX(paper)}
        isLoading={isLikingPaper}
        isLikeVisible={isLikeVisible}
      />
    );
  }
}
