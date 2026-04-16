"use client";

import { useState, useEffect } from "react";
import {
  fetchPlayerGames,
  type GamesFilterParams,
  type GamesApiResponse,
} from "@/lib/api";
import { useDebounce } from "./use-debounce";

/**
 * useGames Hook
 * Handles client-side fetching with:
 * 1. Debouncing for text inputs (search, player, tournament)
 * 2. AbortController for request cancellation
 * 3. Centralized loading and error states
 */
export function useGames(params: GamesFilterParams) {
  const [data, setData] = useState<GamesApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce expensive inputs
  const debouncedSearch = useDebounce(params.search || "", 400);
  const debouncedPlayer = useDebounce(params.player || "", 400);
  const debouncedTournament = useDebounce(params.tournament || "", 400);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadGames = async () => {
      setIsLoading(true);
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
