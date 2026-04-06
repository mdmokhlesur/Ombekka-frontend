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
    <main className="bg-[#f7f8fa] min-h-screen">
      {/* Universal Top Header similar to Image 2 with Logo + Search */}
      <div className="flex items-center gap-4 bg-white border-b-4 border-b-[#0071bc] px-6 py-3 shadow-sm print:hidden">
        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <div className="w-6 h-6 flex items-center justify-center bg-[#0060A9] text-white font-bold rounded-sm text-xs">
            BD
          </div>
          <span className="font-bold text-[0.95rem] text-[#1a1a1a] uppercase tracking-tight whitespace-nowrap">ChessData</span>
        </Link>
        <div className="flex-1 max-w-[420px]">
          <PlayerSearch compact placeholder="Search..." />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 print:p-0 print:max-w-full">
        {/* Top Nav (Back / PDF) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/" className="flex items-center gap-2 text-[#666] no-underline text-base transition-colors duration-200 hover:text-[#0071bc]">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Button className="text-white bg-[#0060A9] hover:bg-[#004d88] px-5 py-2.5 rounded font-semibold text-sm flex items-center gap-2.5 no-underline">
            <Image
              src="/file.svg"
              alt=""
              width={16}
              height={16}
              className="invert filter brightness-0"
            />
            <span>Generate PDF</span>
          </Button>
        </div>

        {/* Player Header */}
        <div className="mb-8 flex items-center gap-4">
          {player.title && (
            <div className="bg-[#0060A9] text-white px-2 py-0.5 rounded-[2px] font-extrabold text-[0.9rem]">{player.title}</div>
          )}
          <h1 className="text-[2.25rem] font-bold text-[#1a1a1a]">{player.name}</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-[#e1e4e8] p-5 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">FIDE ID</div>
            <div className="text-[1.6rem] font-bold text-[#0060A9] font-mono">{player.fideId}</div>
          </div>
          <div className="bg-white border border-[#e1e4e8] p-5 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">COUNTRY</div>
            <div className="text-[1.6rem] font-bold text-[#0060A9]">{player.country}</div>
          </div>
          <div className="bg-white border border-[#e1e4e8] p-5 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">AVG GAME LENGTH</div>
            <div className="text-[1.6rem] font-bold text-[#0060A9]">
              {avgPlyCount} <span className="text-[0.9rem] text-[#333] ml-1 font-semibold">moves</span>
            </div>
          </div>
          <div className="bg-white border border-[#e1e4e8] p-5 flex flex-col">
            <div className="text-[0.75rem] uppercase text-[#888] tracking-wider font-semibold mb-2">RESULT PERCENTILE</div>
            <div className="text-[1.6rem] font-bold text-[#0060A9]">94.2%</div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* ECO Openings */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">ECO OPENINGS</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">ECO</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">COUNT</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {ecoAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.eco}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3 px-4 text-[0.9rem]">
                      {item.eco}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>

          {/* Opponents */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">OPPONENTS</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">OPPONENT</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">COUNT</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {oppAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.name}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3 px-4 text-[0.9rem]">
                      {item.name}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>

          {/* Endgames */}
          <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
            <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">ENDGAMES</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">ENDGAME</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">COUNT</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">LAST PLAYED</th>
                </tr>
              </thead>
              <tbody>
                {endgameAgg.slice(0, 4).map((item) => (
                  <TableRow
                    key={item.name}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="font-bold border-none py-3 px-4 text-[0.9rem]">
                      {item.name}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem]">
                      {item.count}
                    </TableCell>
                    <TableCell className="border-none py-3 px-4 text-[0.9rem] text-gray-500">
                      {item.lastPlayed || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Games Table */}
        <div className="bg-white border border-[#e1e4e8] overflow-hidden mb-6 rounded-md print:border-[#ccc]">
          <div className="bg-[#0060A9] text-white px-4 py-3 font-semibold text-[0.85rem] uppercase tracking-wider">GAMES</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">EVENT</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">DATE</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">COLOR</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">RESULT</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">ECO</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">OPENING</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">PLY</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">TERMINATION</th>
                <th className="text-left px-4 py-3 text-[0.7rem] uppercase text-[#888] border-b border-[#eee] bg-[#fcfcfc]">ENDGAME</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <TableRow
                  key={game.id}
                  className="hover:bg-[#fcfcfc] border-none"
                >
                  <TableCell className="border-none font-medium text-gray-700 py-4 px-4 text-[0.9rem]">
                    {game.tournament.event}
                  </TableCell>
                  <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                    {game.datePlayed || "N/A"}
                  </TableCell>
                  <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                    {game.whiteId === matchedPlayerId ? "White" : "Black"}
                  </TableCell>
                  <TableCell className="border-none font-bold py-4 px-4 text-[0.9rem]">
                    {game.result}
                  </TableCell>
                  <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                    {game.ecoCode}
                  </TableCell>
                  <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                    {game.eco.name}
                  </TableCell>
                  <TableCell className="border-none text-gray-700 py-4 px-4 text-[0.9rem]">
                    {game.plyCount}
                  </TableCell>
                  <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
                    {game.termination}
                  </TableCell>
                  <TableCell className="border-none text-gray-500 py-4 px-4 text-[0.9rem]">
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
