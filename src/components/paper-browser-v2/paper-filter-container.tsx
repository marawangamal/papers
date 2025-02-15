"use client";
import React from "react";
import usePapers from "./usePapers";
import { PaperFilters } from "./paper-filter";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";

const getArr = (value?: string | string[] | undefined) => {
  if (!value) return [];
  return typeof value === "string" ? [value] : value;
};

export default function PaperFilterContainer({
  venues,
  searchParams,
  isLoading,
}: {
  venues: Tables<"vw_final_venues">[];
  searchParams: PaperSearchParams;
  isLoading?: boolean;
}) {
  const { handleSearchClick } = usePapers();

  return (
    <PaperFilters
      venues={venues}
      initialSearch={searchParams.search || ""}
      initialVenues={getArr(searchParams.venue_abbrevs)}
      initialYearRange={{
        start: searchParams.year_min
          ? parseInt(searchParams.year_min, 10)
          : undefined,
        end: searchParams.year_max
          ? parseInt(searchParams.year_max, 10)
          : undefined,
      }}
      onSearchClick={handleSearchClick}
      isLoading={isLoading}
    />
  );
}
