"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function usePapers({ basePath = "/" }: { basePath?: string }) {
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
      router.push(basePath + "?" + params.join("&"));
    });
  };

  return {
    isRedirecting,
    handleSearchClick,
  };
}
