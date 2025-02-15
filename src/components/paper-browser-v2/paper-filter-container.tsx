"use client";
import React from "react";
import usePapers from "./usePapers";
import { PaperFilters } from "./paper-filter";

export default function PaperFilterContainer({ venues, searchParams }) {
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
    />
  );
}
