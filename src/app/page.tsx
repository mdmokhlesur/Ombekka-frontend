import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  fetchPlayerGames,
  type GameData,
  type GamesFilterParams,
} from "@/lib/api";
import { ArrowLeft, ChevronLeft, ChevronRight, View } from "lucide-react";
import Link from "next/link";
import { GamesFilter } from "@/components/games-filter";
import { Suspense } from "react";

export default async function ResultPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  // Extract all single-string params safely
  const extractParam = (key: string) => {
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const page = parseInt(extractParam("page") || "1", 10) || 1;
  const limit = parseInt(extractParam("limit") || "10", 10) || 10;

  const currentParams: GamesFilterParams = {
    search: extractParam("search"),
    tournament: extractParam("tournament"),
    minElo: extractParam("minElo"),
    maxElo: extractParam("maxElo"),
    country: extractParam("country"),
    title: extractParam("title"),
    minPly: extractParam("minPly"),
    maxPly: extractParam("maxPly"),
    sortBy: extractParam("sortBy"),
    sortOrder: extractParam("sortOrder"),
    from: extractParam("from"),
    to: extractParam("to"),
    page,
    limit,
  };

  const buildUrl = (updated: Record<string, string | number>) => {
    const p = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v !== undefined && v !== "") p.set(k, String(v));
    });
    Object.entries(updated).forEach(([k, v]) => {
      p.set(k, String(v));
    });
    return `?${p.toString()}`;
  };

  let games: GameData[] = [];
  let apiError: string | null = null;
  let totalGames = 0;
  let hasNext = false;
  let hasPrevious = false;
  let totalPages = 1;

  try {
    const response = await fetchPlayerGames(currentParams);
    games = response.data || [];
    totalGames = response.meta?.pagination?.total || games.length;
    hasNext = response.meta?.pagination?.hasNext || false;
    hasPrevious = response.meta?.pagination?.hasPrevious || false;
    totalPages = response.meta?.pagination?.totalPages || 1;
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

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-0 sm:py-6 print:p-0 print:max-w-full">
      <Suspense fallback={<div className="h-32 w-full bg-white border border-slate-200 rounded-lg animate-pulse mb-6" />}>
        <GamesFilter />
      </Suspense>

      {/* Simplified Games Table */}
      <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-3 rounded-md">
        <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">
          GAMES
        </div>

        {games.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No matching games found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                      DATE
                    </th>
                    <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                      EVENT
                    </th>
                    <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">
                      ROUND
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
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <TableRow
                      key={game.id}
                      className="hover:bg-[#fcfcfc] border-none"
                    >
                      <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                        {game.datePlayed
                          ? new Date(game.datePlayed).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                        <div
                          className="w-32 truncate"
                          title={game.tournament?.event}
                        >
                          {game.tournament?.event || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                        {game.round || "—"}
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem] font-medium">
                        <div className="w-32 truncate" title={game.white?.name}>
                          {game.white?.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem] font-medium">
                        <div className="w-32 truncate" title={game.black?.name}>
                          {game.black?.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="border-none font-bold py-4 px-4 text-[0.9rem]">
                        {game.result || "—"}
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                        {game.ecoCode || "—"}
                      </TableCell>
                      <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                        <div className="w-32 truncate" title={game.eco?.name}>
                          {game.eco?.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="border-none font-bold py-4 px-4 text-[0.9rem]">
                        {/* <Link href={`/match/${game.id}`}>
                          <Button variant="outline" size="sm">
                            <View />
                          </Button>
                        </Link> */}

                        <Button
                          // onClick={() => toast("Details under construction")}
                          variant="outline"
                          size="sm"
                        >
                          <View />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-[#eee] bg-[#fcfcfc] gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
                  <span className="font-medium text-gray-900">
                    {totalGames === 0 ? 0 : (page - 1) * limit + 1}
                  </span>
                  -
                  <span className="font-medium text-gray-900 mr-1">
                    {Math.min(page * limit, totalGames)}
                  </span>
                  of
                  <span className="font-medium text-gray-900 ml-1">
                    {totalGames}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {hasPrevious ? (
                  <Link
                    href={buildUrl({ page: page - 1 })}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">
                        <ChevronLeft />
                      </span>
                      <span className="sm:hidden">&lt;</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">
                      <ChevronLeft />
                    </span>
                    <span className="sm:hidden">&lt;</span>
                  </Button>
                )}

                <div className="flex items-center gap-1 mx-1 sm:mx-2">
                  {(() => {
                    if (totalPages <= 1) return null;
                    const getPages = () => {
                      if (totalPages <= 5)
                        return Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        );
                      if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
                      if (page >= totalPages - 2)
                        return [
                          1,
                          "...",
                          totalPages - 3,
                          totalPages - 2,
                          totalPages - 1,
                          totalPages,
                        ];
                      return [
                        1,
                        "...",
                        page - 1,
                        page,
                        page + 1,
                        "...",
                        totalPages,
                      ];
                    };

                    return getPages().map((p, i) => {
                      if (p === "...") {
                        return (
                          <span
                            key={`ellipsis-${i}`}
                            className="px-1 sm:px-2 text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <Link
                          key={`page-${p}`}
                          href={buildUrl({ page: p })}
                        >
                          <Button
                            variant={page === p ? "default" : "outline"}
                            size="icon"
                            className={`min-w-8 w-fit h-8 text-xs sm:text-sm px-1 ${page === p ? "bg-[#0060A9] hover:bg-[#004b87]" : ""}`}
                          >
                            {p}
                          </Button>
                        </Link>
                      );
                    });
                  })()}
                </div>

                {hasNext ? (
                  <Link
                    href={buildUrl({ page: page + 1 })}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">
                        <ChevronRight />
                      </span>
                      <span className="sm:hidden">&gt;</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-fit h-8 px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">
                      <ChevronRight />
                    </span>
                    <span className="sm:hidden">&gt;</span>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
