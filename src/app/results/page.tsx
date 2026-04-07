import PlayerSearch from "@/components/player-search";
import PdfButton from "@/components/pdf-button";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  fetchPlayerGames,
  aggregateEco,
  aggregateEndgames,
  computeResultPercentile,
  type GameData,
  type PlayerInfo,
} from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default async function ResultPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q as string;

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">No Search Query</h1>
        <p className="text-gray-500 mb-8">Please enter a search term.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  // Fetch ALL data from API — no frontend filtering
  let games: GameData[] = [];
  let apiError: string | null = null;
  let totalGames = 0;

  try {
    const response = await fetchPlayerGames(q);
    games = response.data || [];
    totalGames = response.meta?.pagination?.total || games.length;
  } catch (err) {
    apiError = err instanceof Error ? err.message : "Failed to fetch data";
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-500 mb-8">{apiError}</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <p className="text-gray-500 mb-8">No games found for: {q}</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  // Identify the most relevant player from the data (for header display only)
  const playerCounts = new Map<number, { player: PlayerInfo; count: number }>();
  for (const g of games) {
    if (g.white) {
      const existing = playerCounts.get(g.white.fideId);
      playerCounts.set(g.white.fideId, {
        player: g.white,
        count: (existing?.count || 0) + 1,
      });
    }
    if (g.black) {
      const existing = playerCounts.get(g.black.fideId);
      playerCounts.set(g.black.fideId, {
        player: g.black,
        count: (existing?.count || 0) + 1,
      });
    }
  }
  // Pick the player who appears most often
  let primaryPlayer: PlayerInfo | null = null;
  let maxCount = 0;
  for (const [, entry] of playerCounts) {
    if (entry.count > maxCount) {
      maxCount = entry.count;
      primaryPlayer = entry.player;
    }
  }

  // Compute stats from ALL returned games (no filtering)
  const avgPlyCount =
    games.length > 0
      ? Math.round(
          games.reduce((acc, g) => acc + (g.plyCount || 0), 0) / games.length,
        )
      : 0;

  const resultPercentile = primaryPlayer
    ? computeResultPercentile(games, primaryPlayer.fideId)
    : "0.0";

  // Aggregations computed from ALL returned data
  const ecoAgg = aggregateEco(games);

  // Opponent aggregation — from all games
  const oppMap = new Map<
    string,
    { name: string; count: number; lastPlayed: string | null }
  >();
  for (const g of games) {
    const players = [g.white, g.black].filter(Boolean);
    for (const p of players) {
      if (!p) continue;
      const existing = oppMap.get(p.name);
      if (existing) {
        existing.count++;
        if (
          g.datePlayed &&
          (!existing.lastPlayed || g.datePlayed > existing.lastPlayed)
        ) {
          existing.lastPlayed = g.datePlayed;
        }
      } else {
        oppMap.set(p.name, {
          name: p.name,
          count: 1,
          lastPlayed: g.datePlayed,
        });
      }
    }
  }
  const oppAgg = Array.from(oppMap.values()).sort((a, b) => b.count - a.count);

  const endgameAgg = aggregateEndgames(games);

  return (
    <main className="bg-[#f7f8fa] min-h-screen">
      {/* Top Header */}
      <div className="bg-white border-b-4 border-b-[#0071bc] shadow-sm print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline shrink-0"
          >
            <span className="font-bold text-[0.95rem] text-[#1a1a1a] uppercase tracking-tight whitespace-nowrap">
              Bekke Research Library INC.
            </span>
          </Link>
          <div className="w-full max-w-[320px]">
            <PlayerSearch compact placeholder="Search..." />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-3 print:p-0 print:max-w-full">
        {/* Top Nav (Back / PDF) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#666] no-underline text-base transition-colors duration-200 hover:text-[#0071bc]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Toaster />
          <PdfButton />
        </div>

        {/* Player Header */}
        {primaryPlayer && (
          <div className="mb-3 flex items-center gap-4">
            {primaryPlayer.title && (
              <div className="bg-[#0060A9] text-white px-2 py-0.5 rounded-[2px] font-extrabold text-[0.9rem]">
                {primaryPlayer.title}
              </div>
            )}
            <h1 className="text-[2.25rem] font-bold text-[#1a1a1a]">
              {primaryPlayer.name}
            </h1>
          </div>
        )}

        {/* Stats Grid */}
        <div className="flex flex-wrap gap-6 mb-6 border-b-2 border-b-[#0071bc] pb-6">
          {primaryPlayer && (
            <>
              <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
                <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
                  FIDE ID
                </div>
                <div className="text-[1.1rem] font-bold text-[#0060A9] font-mono">
                  {primaryPlayer.fideId}
                </div>
              </div>
              {primaryPlayer.country && (
                <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
                  <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
                    COUNTRY
                  </div>
                  <div className="text-[1.1rem] font-bold text-[#0060A9] font-mono">
                    {primaryPlayer.country}
                  </div>
                </div>
              )}
              {primaryPlayer.title && (
                <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
                  <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
                    TITLE
                  </div>
                  <div className="text-[1.1rem] font-bold text-[#0060A9] font-mono">
                    {primaryPlayer.title}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
              TOTAL GAMES
            </div>
            <div className="text-[1.1rem] font-bold text-[#0060A9] font-mono">
              {totalGames.toLocaleString()}
            </div>
          </div>
          <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
              AVG GAME LENGTH
            </div>
            <div className="text-[1.1rem] font-bold text-[#0060A9]">
              {avgPlyCount}{" "}
              <span className="text-[0.9rem] text-[#333] ml-1 font-semibold">
                moves
              </span>
            </div>
          </div>
          {primaryPlayer && (
            <div className="bg-white border border-[#e1e4e8] p-4 flex flex-col">
              <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">
                RESULT PERCENTILE
              </div>
              <div className="text-[1.1rem] font-bold text-[#0060A9]">
                {resultPercentile}%
              </div>
            </div>
          )}
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-3">
          {/* ECO Openings */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">
              ECO OPENINGS
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    ECO
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    COUNT
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    LAST PLAYED
                  </th>
                </tr>
              </thead>
              <tbody>
                {ecoAgg.length > 0 ? (
                  ecoAgg.slice(0, 4).map((item) => (
                    <TableRow
                      key={item.eco}
                      className="hover:bg-transparent border-none"
                    >
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-wrap">
                        {item.eco} - {item.ecoName}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                        {item.count}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                        {item.lastPlayed || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-none">
                    <TableCell
                      colSpan={3}
                      className="border-none py-4 px-4 text-center text-gray-400"
                    >
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>

          {/* Opponents / Players */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">
              PLAYERS
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    PLAYER
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    COUNT
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    LAST PLAYED
                  </th>
                </tr>
              </thead>
              <tbody>
                {oppAgg.length > 0 ? (
                  oppAgg.slice(0, 4).map((item) => (
                    <TableRow
                      key={item.name}
                      className="hover:bg-transparent border-none"
                    >
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-wrap w-4/12">
                        {item.name}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                        {item.count}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                        {item.lastPlayed || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-none">
                    <TableCell
                      colSpan={3}
                      className="border-none py-4 px-4 text-center text-gray-400"
                    >
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>

          {/* Endgames */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">
              ENDGAMES
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    ENDGAME
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    COUNT
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    LAST PLAYED
                  </th>
                </tr>
              </thead>
              <tbody>
                {endgameAgg.length > 0 ? (
                  endgameAgg.slice(0, 4).map((item) => (
                    <TableRow
                      key={item.name}
                      className="hover:bg-transparent border-none"
                    >
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-wrap w-4/12">
                        {item.name}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                        {item.count}
                      </TableCell>
                      <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                        {item.lastPlayed || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-none">
                    <TableCell
                      colSpan={3}
                      className="border-none py-4 px-4 text-center text-gray-400"
                    >
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Games Table */}
        <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-3 rounded-md print:border-[#ccc]">
          <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">
            GAMES
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    EVENT
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    DATE
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    WHITE
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    BLACK
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    RESULT
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    ECO
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    OPENING
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    PLY
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    TERMINATION
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    ENDGAME
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    ECO TYPE
                  </th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                    GAME LENGTH
                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <TableRow
                    key={game.id}
                    className="hover:bg-[#fcfcfc] border-none"
                  >
                    <TableCell className="border-none font-medium text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.tournament?.event || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                      {game.datePlayed || "N/A"}
                    </TableCell>
                    <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.white?.name || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.black?.name || "—"}
                    </TableCell>
                    <TableCell className="border-none font-bold py-4 px-4 text-[0.9rem]">
                      {game.result || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.ecoCode || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.eco?.name || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                      {game.plyCount || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                      {game.termination || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                      {game.endgame || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                      {game.eco?.type || "—"}
                    </TableCell>
                    <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                      {game.plyCount
                        ? `${Math.ceil(game.plyCount / 2)} moves`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
