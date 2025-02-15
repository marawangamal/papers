"use client";
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

  const handleSearchClick = ({
    searchTerm,
    venueIds,
  }: { searchTerm?: string; venueIds?: string[] }) => {
    const id = Math.random().toString(36).substring(7);
    const base = `/search/${id}`;
    const params = new Array<string>();
    if (searchTerm) {
      params.push(`search=${searchTerm}`);
    }
    if (venueIds) {
      venueIds.forEach((id) => params.push(`venue_ids=${id}`));
    }
    router.push(base + "?" + params.join("&"));
  };

  return {
    selectedVenues,
    handleSearchClick,
  };
}
