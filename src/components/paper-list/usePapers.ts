"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function usePapers() {
  const [isRedirecting, startRedirecting] = useTransition();
  const router = useRouter();

  const handleSearchClick = ({
    searchTerm,
    venue_abbrevs,
    yearRange,
    has_code,
  }: {
    searchTerm?: string;
    venue_abbrevs?: string[];
    yearRange?: {
      start?: number;
      end?: number;
    };
    has_code?: boolean;
  }) => {
    startRedirecting(() => {
      // const id = Math.random().toString(36).substring(7);
      const base = `/search/1`;
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
      if (has_code) {
        params.push(`has_code=true`);
      }
      router.push(base + "?" + params.join("&"));
    });
  };

  return {
    isRedirecting,
    handleSearchClick,
  };
}
