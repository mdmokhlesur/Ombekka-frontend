"use client";

import { useChessFilters } from "@/hooks/use-chess-filters";
import { useGames } from "@/hooks/use-games";
import { StatsGrid } from "./stats-grid";
import { GamesTable } from "./games-table";
import { ChartsSection } from "./charts-section";
import { GamesFilter } from "../games-filter";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardShell() {
  const { filters, setFilter, clearFilters } = useChessFilters();
  const { games, pagination, isLoading, error } = useGames(filters);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== 1 && v !== 10 && v !== "datePlayed");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Opposition Research</h1>
            <p className="text-slate-500 mt-1">Transforming chess games into actionable insights.</p>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all rounded-full h-8 px-4"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All
            </Button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Updating analysis...
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Failed to fetch research data</p>
            <p className="text-xs opacity-80">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()} 
              className="mt-3 bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <StatsGrid 
        games={games} 
        totalGames={pagination?.total || 0} 
        isLoading={isLoading} 
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">Research Filters</h2>
            <GamesFilter />
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-900/70">
              <h4 className="text-xs font-bold uppercase mb-2">Pro Tip</h4>
              <p className="text-[11px] leading-relaxed">
                Filter by <strong>ELO</strong> and <strong>ECO</strong> to identify an opponent's specific opening weaknesses across different time controls.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* Visualizations Section */}
          <ChartsSection games={games} isLoading={isLoading} />

          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-slate-900">Search Results</h3>
                <span className="text-xs text-slate-400">{games.length} games in current view</span>
             </div>
             <GamesTable 
                games={games} 
                pagination={pagination} 
                onPageChange={(page) => setFilter('page', page)}
                onFilterChange={(key, value) => setFilter(key, value)}
                isLoading={isLoading} 
             />
          </div>
        </div>
      </div>
    </div>
  );
}
