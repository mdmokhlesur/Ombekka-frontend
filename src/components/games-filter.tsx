"use client";

import React, { useState } from "react";
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
import { SlidersHorizontal, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const [isOpen, setIsOpen] = useState(false);

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
    
    setIsOpen(false);
    router.push(`/?${params.toString()}`);
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

    setIsOpen(false);
    router.push(`/?${params.toString()}`);
  };

  const hasActiveFilters = 
    tournament || minElo || maxElo || minPly || maxPly || (country !== "all") || title || (sortBy !== "datePlayed");

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 mb-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <div>
              <Button variant={hasActiveFilters ? "default" : "outline"} className="gap-2 bg-[#0060A9] hover:bg-[#004b87] text-white pointer-events-none">
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Filters
                {hasActiveFilters && (
                  <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-[#0060A9] bg-white rounded-full">
                    !
                  </span>
                )}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] sm:w-[460px] p-0" align="start">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800">Filter Games</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-slate-500 hover:text-red-600">
                  <X className="w-4 h-4 mr-1" /> Clear All
                </Button>
              )}
            </div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Tournament & Title */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Tournament</label>
                  <Input 
                    placeholder="e.g. Candidates 2026" 
                    value={tournament}
                    onChange={(e) => setTournament(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Player Title</label>
                  <Input 
                    placeholder="e.g. GM, IM" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Country & Sort */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Country</label>
                  <Select value={country} onValueChange={(v) => v && setCountry(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Country</SelectItem>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Sort By</label>
                  <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="datePlayed">Date Played</SelectItem>
                      <SelectItem value="whiteElo">White Elo</SelectItem>
                      <SelectItem value="blackElo">Black Elo</SelectItem>
                      <SelectItem value="plyCount">Ply Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Elo Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Elo Range</label>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Min Elo" 
                    type="number"
                    value={minElo}
                    onChange={(e) => setMinElo(e.target.value)}
                    className="h-9"
                  />
                  <span className="text-slate-400">-</span>
                  <Input 
                    placeholder="Max Elo" 
                    type="number"
                    value={maxElo}
                    onChange={(e) => setMaxElo(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Ply Count Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Ply Range</label>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Min Ply" 
                    type="number"
                    value={minPly}
                    onChange={(e) => setMinPly(e.target.value)}
                    className="h-9"
                  />
                  <span className="text-slate-400">-</span>
                  <Input 
                    placeholder="Max Ply" 
                    type="number"
                    value={maxPly}
                    onChange={(e) => setMaxPly(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <Button onClick={applyFilters} className="w-full bg-[#0060A9] hover:bg-[#004b87]">
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="text-sm text-slate-500 hidden sm:block pr-2">
        {hasActiveFilters ? "Viewing filtered results" : "Showing all matches"}
      </div>
    </div>
  );
}
