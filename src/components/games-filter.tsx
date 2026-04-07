"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

const COUNTRIES = [
  "USA", "IND", "RUS", "CHN", "GER", "UKR", "FRA", "POL", "HUN", "ESP", "ARM", "ISR",
];

export function GamesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tournament, setTournament] = useState(searchParams.get("tournament") || "");
  const [minElo, setMinElo] = useState(searchParams.get("minElo") || "");
  const [maxElo, setMaxElo] = useState(searchParams.get("maxElo") || "");
  const [minPly, setMinPly] = useState(searchParams.get("minPly") || "");
  const [maxPly, setMaxPly] = useState(searchParams.get("maxPly") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "all");
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "datePlayed");

  const [isPending, startTransition] = useTransition();

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    const updateParam = (key: string, value: string) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    };

    updateParam("tournament", tournament.trim());
    updateParam("minElo", minElo.trim());
    updateParam("maxElo", maxElo.trim());
    updateParam("minPly", minPly.trim());
    updateParam("maxPly", maxPly.trim());
    updateParam("country", country);
    updateParam("title", title.trim());
    updateParam("sortBy", sortBy);
    
    // Default to desc for sortOrder if we're changing sort
    if (sortBy && !params.has("sortOrder")) {
      params.set("sortOrder", "desc");
    }

    params.set("page", "1"); // Reset pagination
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setTournament("");
    setMinElo("");
    setMaxElo("");
    setMinPly("");
    setMaxPly("");
    setCountry("all");
    setTitle("");
    setSortBy("datePlayed");
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tournament");
    params.delete("minElo");
    params.delete("maxElo");
    params.delete("minPly");
    params.delete("maxPly");
    params.delete("country");
    params.delete("title");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.set("page", "1");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const hasActiveFilters = 
    tournament || minElo || maxElo || minPly || maxPly || (country !== "all") || title || (sortBy !== "datePlayed");

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 mb-6 shadow-sm flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Tournament */}
        <div className="flex-1 min-w-[200px]">
          <Input 
            placeholder="Tournament (e.g. Candidates)" 
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
            className="h-9 w-full"
          />
        </div>

        {/* Title */}
        <div className="w-[120px]">
          <Input 
            placeholder="Title (GM, IM)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 w-full"
          />
        </div>

        {/* Country */}
        <div className="w-[140px]">
          <Select value={country} onValueChange={(v) => v && setCountry(v)}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Country</SelectItem>
              {COUNTRIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Elo Range */}
        <div className="flex items-center gap-1 w-[200px]">
          <Input 
            placeholder="Min Elo" 
            type="number"
            value={minElo}
            onChange={(e) => setMinElo(e.target.value)}
            className="h-9 w-[90px]"
          />
          <span className="text-slate-400">-</span>
          <Input 
            placeholder="Max Elo" 
            type="number"
            value={maxElo}
            onChange={(e) => setMaxElo(e.target.value)}
            className="h-9 w-[90px]"
          />
        </div>

        {/* Ply Range */}
        <div className="flex items-center gap-1 w-[200px]">
          <Input 
            placeholder="Min Ply" 
            type="number"
            value={minPly}
            onChange={(e) => setMinPly(e.target.value)}
            className="h-9 w-[90px]"
          />
          <span className="text-slate-400">-</span>
          <Input 
            placeholder="Max Ply" 
            type="number"
            value={maxPly}
            onChange={(e) => setMaxPly(e.target.value)}
            className="h-9 w-[90px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <div className="w-[180px]">
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="datePlayed">Date Played</SelectItem>
                <SelectItem value="whiteElo">White Elo</SelectItem>
                <SelectItem value="blackElo">Black Elo</SelectItem>
                <SelectItem value="plyCount">Ply Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-slate-500 hover:text-red-600">
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        <Button 
          onClick={applyFilters} 
          disabled={isPending}
          className="h-9 px-6 bg-[#0060A9] hover:bg-[#004b87]"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <span>{isPending ? "Loading..." : "Apply Filters"}</span>
        </Button>
      </div>
    </div>
  );
}
