import Image from "next/image";
import Link from "next/link";
import PlayerSearch from "@/components/player-search";
import { fetchPlayerGames } from "@/lib/api";

// Featured players — fetched from the real API at build/request time
// const FEATURED_QUERIES = ["Anand", "Carlsen", "Caruana", "Nakamura"];

// async function getFeaturedPlayers() {
//   const players: Array<{
//     fideId: number;
//     name: string;
//     country: string;
//     title: string | null;
//   }> = [];

//   for (const query of FEATURED_QUERIES) {
//     try {
//       const response = await fetchPlayerGames(query, 1, 1);
//       console.log({ response: response?.data });
//       if (response.data && response.data.length > 0) {
//         const game = response.data[0];
//         // Pick the player whose name matches the query
//         const player = game.white.name
//           .toLowerCase()
//           .includes(query.toLowerCase())
//           ? game.white
//           : game.black;
//         // Avoid duplicates
//         if (!players.find((p) => p.fideId === player.fideId)) {
//           players.push({
//             fideId: player.fideId,
//             name: player.name,
//             country: player.country,
//             title: player.title,
//           });
//         }
//       }
//     } catch {
//       // Skip if API is unreachable for this query
//     }
//   }

//   return players;
// }

export default async function Home() {
  const response = await fetchPlayerGames("", 1, 1);
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* Top accent bar */}
      <div className="h-1 bg-[#0071bc]" />

      <div className="max-w-[960px] mx-auto px-6 py-10 md:py-16">
        {/* Header section — left-aligned */}
        <header className="mb-6">
          <div className="mb-4">
            <div className="relative w-[180px] h-[180px]">
              <Image
                src="/logo.jpeg"
                alt="Bekke Research Library"
                sizes="180px"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-[2.25rem] font-medium text-[#1a1a1a] tracking-tight leading-[1.1] mb-2">
            Bekke Research Library
          </h1>
          <p className="text-[1.2rem] text-[#666] leading-relaxed">
            Free and open access to comprehensive chess game data and analytics
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-2">
          <PlayerSearch placeholder="Search by player, tournament, ECO code, or opening name…" />
        </section>

        {response && (
          <section>
            <h2 className="text-base font-normal text-[#1a1a1a]">
              Data: {response?.meta?.pagination?.total}
            </h2>
          </section>
        )}
      </div>
    </main>
  );
}
