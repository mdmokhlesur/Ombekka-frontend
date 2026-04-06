import Image from "next/image";
import Link from "next/link";
import { getAllPlayers } from "@/lib/mock-data";
import PlayerSearch from "@/components/player-search";

// Total from API meta
const TOTAL_GAMES = 51319;

// First 4 players from the dataset
const FIRST_PLAYERS = getAllPlayers().slice(0, 4);

export default function Home() {
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
                src="/logo.png"
                alt="Bekke Research Library"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-[2.25rem] font-[500] text-[#1a1a1a] tracking-tight leading-[1.1] mb-2">
            Bekke Research Library
          </h1>
          <p className="text-[1.2rem] text-[#666] leading-relaxed">
            Free and open access to comprehensive chess game data and analytics
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-8">
          <PlayerSearch placeholder="Search data e.g. Carlsen, Anand, 5000017" />
        </section>

        {/* Data section - first 4 players */}
        <section className="pt-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">Data 360</h2>
          <p className="text-sm text-[#666] mb-6">
            Bekke Research Library is expanding to Data360, a newly curated collection of data, analytics, and tools to foster chess research.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FIRST_PLAYERS.map((player) => (
              <Link
                key={player.fideId}
                href={`/results?q=${player.fideId}`}
                className="flex flex-col bg-white border border-[#e1e4e8] rounded-sm no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full group overflow-hidden"
              >
                {/* Colored accent strip */}
                <div className="h-1.5 bg-[#0071bc] group-hover:bg-[#005a96] transition-colors" />

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Player name */}
                  <div className="text-[0.95rem] font-bold text-[#1a1a1a] mb-4 leading-snug group-hover:text-[#0071bc] transition-colors">
                    {player.name}
                  </div>

                  {/* Large stat */}
                  <div className="text-[1.6rem] font-bold text-[#1a1a1a] mb-1">
                    {player.fideId}
                  </div>

                  {/* Stat description */}
                  <div className="text-xs text-[#0071bc] mb-4 leading-relaxed">
                    {player.country} · {player.title || "Untitled"}
                  </div>

                  {/* Profile link */}
                  <div className="mt-auto pt-3 border-t border-[#f0f0f0]">
                    <span className="text-sm text-[#0071bc] font-medium group-hover:underline">
                      View profile ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
