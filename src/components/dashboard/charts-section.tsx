"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { 
  aggregateResults, 
  aggregateEloTrend, 
  aggregateEco, 
  type GameData 
} from "@/lib/api";

interface ChartsSectionProps {
  games: GameData[];
  isLoading: boolean;
}

export function ChartsSection({ games, isLoading }: ChartsSectionProps) {
  const resultData = aggregateResults(games);
  const eloTrendData = aggregateEloTrend(games);
  const ecoData = aggregateEco(games)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const COLORS = ["#10b981", "#f43f5e", "#64748b"]; // Wins (Green), Losses (Red), Draws (Slate)

  if (isLoading && games.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="h-[300px] bg-white border border-slate-200 rounded-xl animate-pulse" />
        <div className="h-[300px] bg-white border border-slate-200 rounded-xl animate-pulse" />
        <div className="h-[350px] md:col-span-2 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (games.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* 1. Win/Loss Distribution */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Outcome Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resultData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1000}
              >
                {resultData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500 -mt-2 uppercase tracking-tighter">
            {resultData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Rating Development */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Elo Trend (Sequence)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={eloTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8" }}
                domain={["auto", "auto"]} 
              />
              <Tooltip
                contentStyle={{ 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
                }}
                labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="avgElo"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Favorite Openings */}
      <Card className="border-slate-200 shadow-sm md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Opening Repertoire Frequency</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ecoData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="eco"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                width={40}
                className="font-bold text-slate-700"
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
                }}
                formatter={(value) => [value, "Games Handled"]}
              />
              <Bar
                dataKey="count"
                fill="#818CF8"
                radius={[0, 6, 6, 0]}
                barSize={32}
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="px-4 pb-2">
             <div className="flex flex-wrap gap-x-6 gap-y-2">
                {ecoData.map((eco, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-600">{eco.eco}:</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{eco.ecoName}</span>
                  </div>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
