"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
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
  const initialValue = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialValue);
  const [count, setCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  // Sync with URL changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle Search & Debouncing
  useEffect(() => {
    if (debouncedQuery === initialValue) return;

    // MIN CHARACTER LIMIT: Skip if 1 or 2 characters
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
      setOpen(true);

      try {
        const response = await fetchPlayerGames(
          { search: debouncedQuery, page: 1, limit: 1 },
          controller.signal,
        );
        const total = response.meta?.pagination?.total || 0;
        setCount(total);

        const params = new URLSearchParams(searchParams.toString());
        params.set("search", debouncedQuery);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
      } catch (err: unknown) {
        if (err instanceof Error && (err as Error).name === "AbortError") {
          // Silent for intentional cancels
        } else {
          console.error("Search failed", err);
        }
      } finally {
        setIsSearching(false);
      }
    };

    fetchGames();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, initialValue, router, searchParams]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger className="relative w-full flex items-center group cursor-text">
          <Search
            className={`absolute text-[#999] pointer-events-none z-10 transition-colors duration-200 group-focus-within:text-[#0060A9] ${
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
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) setOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3">
              <Loader2 className="w-4 h-4 text-[#0060A9] animate-spin" />
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 border border-slate-200 rounded-md shadow-lg overflow-hidden mt-1 bg-white"
          align="start"
        >
          <Command className="rounded-md">
            <CommandList className="max-h-none">
              {isSearching ? (
                <div className="px-4 py-4 text-center text-slate-500 text-sm">
                  Searching records...
                </div>
              ) : query.trim() === "" ? (
                <div className="px-4 py-4 text-center text-slate-400 text-xs">
                  Type to start searching
                </div>
              ) : count !== null ? (
                <div className="p-4 text-sm text-center text-slate-500">
                  {count.toLocaleString()} Results Matched
                </div>
              ) : (
                <CommandEmpty className="py-4 text-center text-slate-500 text-sm">
                  No matches found
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
