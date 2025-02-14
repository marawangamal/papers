import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { Tables } from "@/types/database.types";
import { getMatchingPapers, getPapers } from "@/lib/actions/papers";

export type PaperBrowserSearchParams = { invitation?: string; search?: string };

const filterPapers = (papers: Tables<"papers">[], search: string) => {
  // Filter papers by search term
  return papers.filter((paper) => {
    return `${paper.title}${paper.abstract}`.toLowerCase()
      .includes(search.toLowerCase());
  });
};

export type PaperSearchParams = {
  venue_id?: string;
  search?: string;
};

export default function usePapers({
  venues,
  searchParams,
}: {
  venues: Tables<"venues">[];
  searchParams: PaperSearchParams;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [papers, setPapers] = useState<Tables<"papers">[]>([]);
  const [isFetching, startTransition] = useTransition();

  const [debouncedSearch] = useDebouncedValue(searchParams.search, 5000);

  // Find the matching conference label for the current invitation
  const currentVenue = venues.find((conf) => conf.id === searchParams.venue_id);
  const currentSearch = searchParams.search || "";
  const filteredPapers = papers;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // Start with the current searchParams entries
      const params = new URLSearchParams();

      // Preserve existing params except the one we're updating
      Object.entries(searchParams).forEach(([key, val]) => {
        if (key !== name) {
          // Skip the param we're about to set
          params.set(key, String(val)); // Ensure value is converted to string
        }
      });
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleVenueChange = (venue_id?: string) => {
    if (venue_id) {
      router.push(pathname + "?" + createQueryString("venue_id", venue_id));
    } else router.push(pathname);
  };

  const handleSearchChange = (value: string) => {
    if (value) {
      router.push(pathname + "?" + createQueryString("search", value));
    } else router.push(pathname);
  };

  /**
   * When the venue_id changes, fetch new papers
   */
  useEffect(() => {
    startTransition(async () => {
      try {
        if (searchParams.venue_id) {
          const fetchedPapers = await getPapers({
            venue_id: searchParams.venue_id,
          });
          setPapers(fetchedPapers);
        }
      } catch (error: unknown) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : "Failed to load papers.",
        );
      }
    });
  }, [searchParams.venue_id]);

  /**
   * When the search term changes, filter papers
   */
  useEffect(() => {
    startTransition(async () => {
      try {
        if (debouncedSearch) {
          const fetchedPapers = await getMatchingPapers({
            search: debouncedSearch,
          });
          setPapers(fetchedPapers);
        }
      } catch (error: unknown) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : "Failed to load papers.",
        );
      }
    });
  }, [debouncedSearch]); // Using debouncedSearch instead of searchParams.search

  return {
    isFetching,
    error,
    notes: filteredPapers,
    currentVenue,
    currentSearch,
    handleConferenceChange: handleVenueChange,
    handleSearchChange,
  };
}
