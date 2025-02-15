"use client";
import React from "react";
import usePapers from "./usePapers";
import { PaperFilters } from "./paper-filter";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";

export default function PaperFilterContainer({
  venues,
  searchParams,
  isLoading,
}: {
  venues: Tables<"venues">[];
  searchParams: PaperSearchParams;
  isLoading?: boolean;
}) {
  const { selectedVenues, handleVenuesChange, handleSearchClick } = usePapers({
    searchParams,
    venues,
  });

  return (
    <PaperFilters
      venues={venues}
      initialSearch={searchParams.search || ""}
      selectedVenues={selectedVenues}
      onVenueChange={handleVenuesChange}
      onSearchClick={handleSearchClick}
      isLoading={isLoading}
    />
  );
}
