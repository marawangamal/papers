import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { Tables } from "@/types/database.types";
import { getMatchingPapers, PaperSearchParams } from "@/lib/actions/papers";

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
  const [currentSearch, setCurrentSearch] = useState(searchParams.search || "");
  const [debouncedSearch] = useDebouncedValue(currentSearch, 300); // 300ms delay

  // Find the matching conference label for the current invitation
  const filteredPapers = papers;
  const page = searchParams.page || "1";
  const selectedVenues = searchParams.venue_ids || [];

  const createQueryString = useCallback(
    (name: string, value: string | string[]) => {
      const params = new URLSearchParams();

      // Preserve existing params except the one we're updating
      Object.entries(searchParams).forEach(([key, val]) => {
        if (key !== name && key !== name) { // Handle both formats
          params.set(key, String(val));
        }
      });

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
    if (venue_ids) {
      router.push(pathname + "?" + createQueryString("venue_ids", venue_ids));
    } else router.push(pathname);
  };

  const handleSearchChange = useCallback((value: string) => {
    setCurrentSearch(value);
  }, []);

  /**
   * When `search` changes, update the URL
   */
  useEffect(() => {
    const params = new URLSearchParams(
      searchParams,
    );
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, pathname, router]);

  // Set default params
  useEffect(() => {
    let defaultPath = pathname;
    if (!searchParams.page) {
      defaultPath += "?" + createQueryString("page", "1");
    }
    router.push(defaultPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * When the search term changes, filter papers
   */
  useEffect(() => {
    startTransition(async () => {
      try {
        if (searchParams.venue_ids) { // <--- router.push above  does not run if i comment this out?
          const fetchedPapers = await getMatchingPapers({
            search: searchParams.search,
            page: searchParams.page,
            venue_ids: searchParams.venue_ids,
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
  }, [searchParams]);

  return {
    isFetching,
    error,
    notes: filteredPapers,
    currentSearch,
    handleSearchChange,
    // New
    selectedVenues: typeof selectedVenues === "string"
      ? [selectedVenues]
      : selectedVenues,
    handleVenuesChange,
  };
}
