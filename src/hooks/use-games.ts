"use client";

import { useState, useEffect } from "react";
import {
  fetchPlayerGames,
  type GamesFilterParams,
  type GamesApiResponse,
} from "@/lib/api";
import { useDebounce } from "./use-debounce";
import { DataCache } from "@/lib/cache";

/**
 * useGames Hook
 * Handles client-side fetching with:
 * 1. Debouncing for text inputs (search, player, tournament)
 * 2. AbortController for request cancellation
 * 3. Centralized loading and error states
 */
export function useGames(params: GamesFilterParams) {
  // Generate a stable key for the current filter state
  const cacheKey = JSON.stringify(params);
  
  // Use a lazy initializer for state to check cache immediately
  const [data, setData] = useState<GamesApiResponse | null>(() => {
    return DataCache.get(cacheKey);
  });
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  // Debounce expensive inputs
  const debouncedSearch = useDebounce(params.search || "", 400);
  const debouncedPlayer = useDebounce(params.player || "", 400);
  const debouncedTournament = useDebounce(params.tournament || "", 400);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadGames = async () => {
      // If we already have cached data for these parameters, 
      // we do a "silent refresh" (background revalidation)
      const cached = DataCache.get(cacheKey);
      if (cached) {
        setData(cached);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetchPlayerGames(
          {
            ...params,
            search: debouncedSearch,
            player: debouncedPlayer,
            tournament: debouncedTournament,
          },
          signal,
        );

        if (response.success) {
          setData(response);
          // Memorize this result for 1 hour
          DataCache.set(cacheKey, response);
        } else {
          setError(response.message || "Failed to fetch games");
        }
      } catch (err: unknown) {
        // Don't set error if the request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();

    // Cleanup: Abort the fetch if the effect re-runs or component unmounts
    return () => {
      controller.abort();
    };
  }, [
    debouncedSearch,
    debouncedPlayer,
    debouncedTournament,
    cacheKey, // Re-run when any parameter changes
    params.eco,
    params.result,
    params.minElo,
    params.maxElo,
    params.country,
    params.title,
    params.minPly,
    params.maxPly,
    params.from,
    params.to,
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
  ]);

  return {
    data,
    isLoading,
    error,
    games: data?.data || [],
    pagination: data?.meta?.pagination,
  };
}
