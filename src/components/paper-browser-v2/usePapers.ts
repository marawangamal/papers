"use client";
import { useRouter } from "next/navigation";

export default function usePapers() {
  const router = useRouter();

  const handleSearchClick = ({
    searchTerm,
    venue_abbrevs,
    yearRange,
  }: {
    searchTerm?: string;
    venue_abbrevs?: string[];
    yearRange?: {
      start?: number;
      end?: number;
    };
  }) => {
    const id = Math.random().toString(36).substring(7);
    const base = `/search/${id}`;
    const params = new Array<string>();
    if (searchTerm) {
      params.push(`search=${searchTerm}`);
    }
    if (venue_abbrevs) {
      venue_abbrevs.forEach((a) => params.push(`venue_abbrevs=${a}`));
    }
    if (yearRange?.start) {
      params.push(`year_min=${yearRange.start}`);
    }
    if (yearRange?.end) {
      params.push(`year_max=${yearRange.end}`);
    }
    router.push(base + "?" + params.join("&"));
  };

  return {
    handleSearchClick,
  };
}
