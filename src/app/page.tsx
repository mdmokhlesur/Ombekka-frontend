import Image from 'next/image';
import Link from 'next/link';
import { getAllPlayers } from '@/lib/mock-data';
import PlayerSearch from '@/components/player-search';

// Total from API meta
const TOTAL_GAMES = 51319;

// First 5 players from the dataset
const FIRST_PLAYERS = getAllPlayers().slice(0, 4);

export default function Home() {
  return (
    <main className="home-page">
      {/* Top accent bar */}
      <div className="home-accent-bar" />

      <div className="home-container">
        {/* Header section — left-aligned */}
        <header className="home-header">
          <div className="home-logo-row">
            <div className="home-logo-wrapper">
              <Image
                src="/logo.png"
                alt="Bekke Research Library"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="home-title">Bekke Research Library</h1>
          <p className="home-subtitle">
            Free and open access to comprehensive chess game data and analytics
          </p>
        </header>

        {/* Search Section */}
        <section className="home-search-section">
          <PlayerSearch placeholder="Search data e.g. Carlsen, Anand, 5000017" />
        </section>

        {/* Data section - first 5 players */}
        <section className="home-data-section">
          <h2 className="home-data-title">
            Data <span className="home-data-count">{TOTAL_GAMES.toLocaleString()}</span>
          </h2>

          <div className="home-player-grid">
            {FIRST_PLAYERS.map((player) => (
              <Link
                key={player.fideId}
                href={`/results?q=${player.fideId}`}
                className="wb-player-card"
              >
                <div className="wb-player-card-name">{player.name}</div>
                
                <div className="wb-player-card-inscription">
                  <div className="wb-player-card-detail">FIDE ID</div>
                  <div className="wb-player-card-value">#{player.fideId}</div>
                  
                  <div className="wb-player-card-detail">Country</div>
                  <div className="wb-player-card-value">{player.country}</div>
                  
                  <div className="wb-player-card-detail">Title</div>
                  <div className="wb-player-card-value">{player.title || '—'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
