import Image from 'next/image';
import Link from 'next/link';
import { getAllPlayers } from '@/lib/mock-data';
import PlayerSearch from '@/components/player-search';

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
        <header className="mb-8">
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
          <h1 className="text-[2.75rem] font-light text-[#1a1a1a] tracking-tight leading-[1.1] mb-4">
            Bekke Research Library
          </h1>
          <p className="text-[1.4rem] text-[#666] leading-relaxed max-w-[700px]">
            Free and open access to comprehensive chess game data and analytics
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-8">
          <PlayerSearch placeholder="Search data e.g. Carlsen, Anand, 5000017" />
        </section>

        {/* Data section - first 4 players */}
        <section className="pt-4">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4 flex items-baseline gap-2">
            Data <span className="font-normal text-[#666] text-lg">{TOTAL_GAMES.toLocaleString()}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {FIRST_PLAYERS.map((player) => (
              <Link
                key={player.fideId}
                href={`/results?q=${player.fideId}`}
                className="flex flex-col bg-white border border-[#e1e4e8] p-5 no-underline transition-all duration-200 hover:border-[#0071bc] hover:shadow-md hover:-translate-y-0.5 h-full group"
              >
                <div className="text-lg font-bold text-[#1a1a1a] mb-3 leading-[1.2] group-hover:text-[#0071bc]">
                  {player.name}
                </div>
                
                <div className="mt-auto flex flex-col gap-1">
                  <div className="text-[0.7rem] uppercase text-[#888] tracking-wider font-semibold">FIDE ID</div>
                  <div className="text-[0.85rem] text-[#333] mb-2">#{player.fideId}</div>
                  
                  <div className="text-[0.7rem] uppercase text-[#888] tracking-wider font-semibold">Country</div>
                  <div className="text-[0.85rem] text-[#333] mb-2">{player.country}</div>
                  
                  <div className="text-[0.7rem] uppercase text-[#888] tracking-wider font-semibold">Title</div>
                  <div className="text-[0.85rem] text-[#333] mb-2">{player.title || '—'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
