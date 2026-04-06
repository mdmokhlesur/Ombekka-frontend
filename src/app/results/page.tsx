import PlayerSearch from "@/components/player-search";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { MOCK_GAMES } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ResultPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q as string;

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">No Search Query</h1>
        <p className="text-gray-500 mb-8">
          Please enter a player name or FIDE ID to search.
        </p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  const targetId = parseInt(q);
  const isNumeric = !isNaN(targetId) && targetId > 0;

  // Filter games for the target player
  const games = MOCK_GAMES.filter((g) => {
    if (isNumeric) {
      return g.whiteId === targetId || g.blackId === targetId;
    } else {
      // Fallback for name search if not numeric ID
      const searchName = q.toLowerCase();
      return (
        g.white.name.toLowerCase().includes(searchName) ||
        g.black.name.toLowerCase().includes(searchName)
      );
    }
  });

  const matchedPlayerId =
    games.length > 0
      ? isNumeric &&
        (games[0].whiteId === targetId || games[0].blackId === targetId)
        ? targetId
        : games[0].white.name.toLowerCase().includes(q.toLowerCase())
          ? games[0].whiteId
          : games[0].blackId
      : null;

  const player = matchedPlayerId
    ? games[0].whiteId === matchedPlayerId
      ? games[0].white
      : games[0].black
    : null;

  const avgPlyCount =
    games.length > 0
      ? Math.round(games.reduce((acc, g) => acc + g.plyCount, 0) / games.length)
      : 0;

  // Aggregations
  const ecoMap = new Map<
    string,
    { count: number; lastPlayed: string | null }
  >();
  games.forEach((g) => {
    const current = ecoMap.get(g.ecoCode) || {
      count: 0,
      lastPlayed: g.datePlayed,
    };
    ecoMap.set(g.ecoCode, {
      count: current.count + 1,
      lastPlayed:
        g.datePlayed &&
        (!current.lastPlayed || g.datePlayed > current.lastPlayed)
          ? g.datePlayed
          : current.lastPlayed,
    });
  });
  const ecoAgg = Array.from(ecoMap.entries()).map(([eco, data]) => ({
    eco,
    ...data,
  }));

  const oppMap = new Map<
    string,
    { count: number; lastPlayed: string | null; name: string }
  >();
  games.forEach((g) => {
    if (!matchedPlayerId) return;
    const isWhite = g.whiteId === matchedPlayerId;
    const opp = isWhite ? g.black : g.white;
    const current = oppMap.get(opp.name) || {
      count: 0,
      lastPlayed: g.datePlayed,
      name: opp.name,
    };
    oppMap.set(opp.name, {
      count: current.count + 1,
      lastPlayed:
        g.datePlayed &&
        (!current.lastPlayed || g.datePlayed > current.lastPlayed)
          ? g.datePlayed
          : current.lastPlayed,
      name: opp.name,
    });
  });
  const oppAgg = Array.from(oppMap.values());

  const endgameMap = new Map<
    string,
    { count: number; lastPlayed: string | null }
  >();
  games.forEach((g) => {
    const current = endgameMap.get(g.endgame) || {
      count: 0,
      lastPlayed: g.datePlayed,
    };
    endgameMap.set(g.endgame, {
      count: current.count + 1,
      lastPlayed:
        g.datePlayed &&
        (!current.lastPlayed || g.datePlayed > current.lastPlayed)
          ? g.datePlayed
          : current.lastPlayed,
    });
  });
  const endgameAgg = Array.from(endgameMap.entries()).map(([name, data]) => ({
    name,
    ...data,
  }));

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
        <p className="text-gray-500 mb-8">No games found for: {q}</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="results-page bg-[#f7f8fa] min-h-screen">
      {/* Universal Top Header similar to Image 2 with Logo + Search */}
      <div className="results-header no-print">
        <Link href="/" className="results-header-logo">
          <div className="w-6 h-6 flex items-center justify-center bg-[#0060A9] text-white font-bold rounded-sm text-xs">
            BD
          </div>
          <span className="results-header-brand">ChessData</span>
        </Link>
        <div className="results-header-search">
          <PlayerSearch compact placeholder="Search..." />
        </div>
      </div>

      <div className="results-container pt-8">
        {/* Top Nav (Back / PDF) */}
        <div className="results-top-nav no-print">
          <Link href="/" className="btn-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Button className="btn-pdf text-white bg-[#0060A9] hover:bg-[#004d88]">
            <Image
              src="/file.svg"
              alt=""
              width={16}
              height={16}
              className="invert filter brightness-0"
            />
            <span className="ml-2">Generate PDF</span>
          </Button>
        </div>

        {/* Player Header */}
        <div className="results-player-header">
          {player.title && (
            <div className="player-title-badge">{player.title}</div>
          )}
          <h1 className="player-header-name">{player.name}</h1>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">FIDE ID</div>
            <div className="stat-card-value font-mono">{player.fideId}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">COUNTRY</div>
            <div className="stat-card-value">{player.country}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">AVG GAME LENGTH</div>
            <div className="stat-card-value">
              {avgPlyCount} <span className="stat-card-unit">moves</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">RESULT PERCENTILE</div>
            <div className="stat-card-value">94.2%</div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="table-row-grid">
          {/* ECO Openings */}
          <div className="wb-table-wrapper rounded-md">
            <div className="wb-table-title-bar">ECO OPENINGS</div>
            <table className="wb-table">
              <thead>
                <tr>
                  <th>ECO</th>
                  <th>COUNT</th>
                  <th>LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {ecoAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.eco}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3">
                      {item.eco}
                    </TableCell>
                    <TableCell className="border-none py-3">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>

          {/* Opponents */}
          <div className="wb-table-wrapper rounded-md">
            <div className="wb-table-title-bar">OPPONENTS</div>
            <table className="wb-table">
              <thead>
                <tr>
                  <th>OPPONENT</th>
                  <th>COUNT</th>
                  <th>LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {oppAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.name}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3">
                      {item.name}
                    </TableCell>
                    <TableCell className="border-none py-3">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>

          {/* Endgames */}
          <div className="wb-table-wrapper rounded-md">
            <div className="wb-table-title-bar">ENDGAMES</div>
            <table className="wb-table">
              <thead>
                <tr>
                  <th>ENDGAME</th>
                  <th>COUNT</th>
                  <th>LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {endgameAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.name}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3">
                      {item.name}
                    </TableCell>
                    <TableCell className="border-none py-3">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Games Table */}
        <div className="wb-table-wrapper rounded-md">
          <div className="wb-table-title-bar">GAMES</div>
          <table className="wb-table">
            <thead>
              <tr>
                <th>EVENT</th>
                <th>DATE</th>
                <th>COLOR</th>
                <th>RESULT</th>
                <th>ECO</th>
                <th>OPENING</th>
                <th>PLY</th>
                <th>TERMINATION</th>
                <th>ENDGAME</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <TableRow
                  key={game.id}
                  className="hover:bg-[#fcfcfc] border-none"
                >
                  <TableCell className="border-none font-medium text-gray-700">
                    {game.tournament.event}
                  </TableCell>
                  <TableCell className="border-none text-gray-500">
                    {game.datePlayed || "N/A"}
                  </TableCell>
                  <TableCell className="border-none text-gray-500">
                    {game.whiteId === matchedPlayerId ? "White" : "Black"}
                  </TableCell>
                  <TableCell className="border-none font-bold">
                    {game.result}
                  </TableCell>
                  <TableCell className="border-none text-gray-700">
                    {game.ecoCode}
                  </TableCell>
                  <TableCell className="border-none text-gray-700">
                    {game.eco.name}
                  </TableCell>
                  <TableCell className="border-none text-gray-700">
                    {game.plyCount}
                  </TableCell>
                  <TableCell className="border-none text-gray-500">
                    {game.termination}
                  </TableCell>
                  <TableCell className="border-none text-gray-500">
                    {game.endgame}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
