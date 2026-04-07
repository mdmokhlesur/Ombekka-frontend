"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { fetchPlayerGames } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

interface PlayerSearchProps {
  compact?: boolean;
  placeholder?: string;
}

export default function PlayerSearch({
  compact = false,
  placeholder,
}: PlayerSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = (searchParams.get("search") || "").replace(/^'|'$/g, "");

  const [query, setQuery] = useState(initialValue);
  const [count, setCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  // Sync with URL changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle Search & Debouncing
  useEffect(() => {
    if (debouncedQuery === initialValue) return;

    if (debouncedQuery.length > 0 && debouncedQuery.length < 3) {
      setCount(null);
      return;
    }

    const controller = new AbortController();

    const fetchGames = async () => {
      if (!debouncedQuery.trim()) {
        router.push("/");
        setCount(null);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetchPlayerGames(
          { search: debouncedQuery, page: 1, limit: 1 },
          controller.signal,
        );
        const total = response.meta?.pagination?.total || 0;
        setCount(total);

        const params = new URLSearchParams(searchParams.toString());
        params.set("search", `'${debouncedQuery}'`);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Silent for intentional cancels
        } else {
          console.error("Search failed", err);
        }
      } finally {
        setIsSearching(false);
      }
    };

    fetchGames();

    return () => controller.abort();
  }, [debouncedQuery, initialValue, router, searchParams]);

  const resultLabel = isSearching ? (
    <Loader2 className="w-4 h-4 text-[#0060A9] animate-spin" />
  ) : count !== null && query.trim() ? (
    <span className="text-xs text-slate-500">
      {count.toLocaleString()} results found
    </span>
  ) : null;

  return (
    <div className="relative w-full">
      <div className="relative w-full flex items-center">
        <Search
          className={`absolute text-[#999] pointer-events-none z-10 ${
            compact
              ? "left-2.5 w-[15px] h-[15px]"
              : "left-3.5 w-[18px] h-[18px]"
          }`}
        />
        <input
          type="text"
          className={`w-full border border-[#d1d5db] rounded-md bg-white text-[#333] transition-all focus:border-[#0071bc] focus:ring-4 focus:ring-[#0071bc]/10 outline-none placeholder:text-[#aaa] ${
            compact
              ? "h-[38px] pl-9 pr-8 text-[0.82rem] placeholder:text-[0.8rem]"
              : "h-[52px] pl-11 pr-10 text-[0.95rem] placeholder:text-[0.9rem]"
          }`}
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {resultLabel && <div className="absolute right-3">{resultLabel}</div>}
      </div>
    </div>
  );
}
