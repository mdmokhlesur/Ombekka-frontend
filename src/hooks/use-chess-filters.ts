"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { type GamesFilterParams } from "@/lib/api";

/**
 * useChessFilters Hook
 * Manages the URL search parameters as the single source of truth
 * for the dashboard's filtering state.
 */
export function useChessFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract all relevant params into a typed object
  const filters: GamesFilterParams = useMemo(() => {
    const extract = (key: string) => {
      const val = searchParams.get(key);
      return val ? val.replace(/^'|'$/g, "") : undefined;
    };

    return {
      search: extract("search"),
      tournament: extract("tournament"),
      player: extract("player"),
      eco: extract("eco"),
      result: extract("result"),
      minElo: extract("minElo"),
      maxElo: extract("maxElo"),
      country: extract("country"),
      title: extract("title"),
      minPly: extract("minPly"),
      maxPly: extract("maxPly"),
      sortBy: extract("sortBy"),
      sortOrder: extract("sortOrder"),
      from: extract("from"),
      to: extract("to"),
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof GamesFilterParams, value: string | number | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      
      const isEmpty = value === undefined || value === null || value === "" || value === "all" || value === "undefined";
      
      if (isEmpty) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      // Always reset page to 1 when changing filters
      if (key !== "page") {
        params.set("page", "1");
      }

      // Use replace for filter changes to avoid history pollution
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<GamesFilterParams>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        const isEmpty = value === undefined || value === null || value === "" || value === "all" || value === "undefined";
        if (isEmpty) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page to 1 if we're not explicitly paginating
      if (!updates.hasOwnProperty("page")) {
        params.set("page", "1");
      }

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.push("/");
  }, [router]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
  };
}
