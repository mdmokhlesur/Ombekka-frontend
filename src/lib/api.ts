export interface PlayerInfo {
  fideId: number;
  name: string;
  country: string;
  sex: string | null;
  title: string | null;
}

export interface EcoInfo {
  id: string;
  name: string;
  example: string;
  type: string;
  group: string;
}

export interface TournamentInfo {
  eventId: number;
  event: string;
  place: string;
  federation: string;
  startDate: string | null;
  endDate: string | null;
  type: string | null;
}

export interface GameData {
  id: string;
  tournamentId: number;
  datePlayed: string | null;
  round: number | null;
  whiteId: number;
  blackId: number;
  result: string;
  whiteElo: number;
  blackElo: number;
  ecoCode: string;
  plyCount: number;
  termination: string;
  endgame: string;
  endgameCount: number;
  white: PlayerInfo;
  black: PlayerInfo;
  eco: EcoInfo;
  tournament: TournamentInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GamesApiResponse {
  success: boolean;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
    pagination: PaginationInfo;
  };
  data: GameData[];
}

const NEXT_PUBLIC_BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.0.166:3030/api';

export async function fetchPlayerGames(
  fideId: string,
  page: number = 1,
  limit: number = 10
): Promise<GamesApiResponse> {
  const url = `${NEXT_PUBLIC_BACKEND_URL}/games?fideId=${fideId}&page=${page}&limit=${limit}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Aggregation helpers
export function aggregateEco(games: GameData[]) {
  const map = new Map<string, { eco: string; ecoName: string; count: number; lastPlayed: string | null }>();
  for (const g of games) {
    const existing = map.get(g.ecoCode);
    if (existing) {
      existing.count++;
      if (g.datePlayed && (!existing.lastPlayed || g.datePlayed > existing.lastPlayed)) {
        existing.lastPlayed = g.datePlayed;
      }
    } else {
      map.set(g.ecoCode, { eco: g.ecoCode, ecoName: g.eco.name, count: 1, lastPlayed: g.datePlayed });
    }
  }
  return Array.from(map.values());
}

export function aggregateOpponents(games: GameData[], targetId: number) {
  const map = new Map<string, { name: string; count: number; lastPlayed: string | null }>();
  for (const g of games) {
    const opp = g.whiteId === targetId ? g.black : g.white;
    const existing = map.get(opp.name);
    if (existing) {
      existing.count++;
      if (g.datePlayed && (!existing.lastPlayed || g.datePlayed > existing.lastPlayed)) {
        existing.lastPlayed = g.datePlayed;
      }
    } else {
      map.set(opp.name, { name: opp.name, count: 1, lastPlayed: g.datePlayed });
    }
  }
  return Array.from(map.values());
}

export function aggregateEndgames(games: GameData[]) {
  const map = new Map<string, { name: string; count: number; lastPlayed: string | null }>();
  for (const g of games) {
    const existing = map.get(g.endgame);
    if (existing) {
      existing.count++;
      if (g.datePlayed && (!existing.lastPlayed || g.datePlayed > existing.lastPlayed)) {
        existing.lastPlayed = g.datePlayed;
      }
    } else {
      map.set(g.endgame, { name: g.endgame, count: 1, lastPlayed: g.datePlayed });
    }
  }
  return Array.from(map.values());
}

export function computeResultPercentile(games: GameData[], targetId: number): string {
  if (games.length === 0) return '0.0';
  let wins = 0;
  let draws = 0;
  for (const g of games) {
    const isWhite = g.whiteId === targetId;
    if ((g.result === '1-0' && isWhite) || (g.result === '0-1' && !isWhite)) wins++;
    else if (g.result === '1/2-1/2' || g.result === '½-½') draws++;
  }
  return ((wins + draws * 0.5) / games.length * 100).toFixed(1);
}
