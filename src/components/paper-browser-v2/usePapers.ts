"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/database.types";
import { PaperSearchParams } from "@/lib/actions/papers";

export default function usePapers({
  venues,
  searchParams,
}: {
  venues: Tables<"venues">[];
  searchParams: PaperSearchParams;
}) {
  const router = useRouter();
  const selectedVenues = venues?.filter((venue) =>
    searchParams.venue_ids?.includes(venue.id)
  ).map((venue) => venue.id);

  const createQueryString = useCallback(
    (name: string, value?: string | string[]) => {
      const params = new URLSearchParams();

      // Preserve existing params except the one we're updating
      Object.entries(searchParams).forEach(([key, val]) => {
        if (key !== name && key !== name) { // Handle both formats
          params.set(key, String(val));
        }
      });

      if (!value) {
        // Delete the key if value is undefined
        params.delete(name);
        return params.toString();
      }

      // Handle arrays using name[] notation
      if (Array.isArray(value)) {
        value.forEach((v) => {
          params.append(name, v);
        });
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleVenuesChange = (venue_ids?: string[]) => {
    const id = Math.random().toString(36).substring(7);
    router.push(
      `/search/${id}` + "?" + createQueryString("venue_ids", venue_ids),
    );
  };

  const handleSearchClick = (searchTerm: string) => {
    const id = Math.random().toString(36).substring(7);
    router.push(
      `/search/${id}` + "?" + createQueryString("search", searchTerm),
    );
  };

  return {
    selectedVenues,
    handleVenuesChange,
    handleSearchClick,
  };
}
