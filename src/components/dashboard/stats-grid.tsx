"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GameData } from "@/lib/api";
import { Trophy, Users, Hash, TrendingUp } from "lucide-react";

interface StatsGridProps {
  games: GameData[];
  totalGames: number;
  isLoading: boolean;
}

export function StatsGrid({ games, totalGames, isLoading }: StatsGridProps) {
  // Simple calculations for the current view
  const avgElo = games.length > 0 
    ? Math.round(games.reduce((acc, g) => acc + (g.whiteElo + g.blackElo) / 2, 0) / games.length)
    : 0;

  const winCount = games.filter(g => g.result === "1-0").length;
  const drawCount = games.filter(g => g.result === "1/2-1/2" || g.result === "½-½").length;
  const winRate = games.length > 0 ? (((winCount + drawCount * 0.5) / games.length) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      title: "Total Games",
      value: totalGames.toLocaleString(),
      icon: Hash,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Win Rate (Current View)",
      value: `${winRate}%`,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Average Match Elo",
      value: avgElo.toLocaleString(),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Opponents",
      value: new Set(games.flatMap(g => [g.whiteId, g.blackId])).size.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (isLoading && games.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <Card key={i} className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
