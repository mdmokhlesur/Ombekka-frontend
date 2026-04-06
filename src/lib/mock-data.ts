export interface ChessGame {
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
  white: {
    fideId: number;
    name: string;
    country: string;
    sex: string | null;
    title: string | null;
  };
  black: {
    fideId: number;
    name: string;
    country: string;
    sex: string | null;
    title: string | null;
  };
  eco: {
    id: string;
    name: string;
    example: string;
    type: string;
    group: string;
  };
  tournament: {
    eventId: number;
    event: string;
    place: string;
    federation: string;
    startDate: string | null;
    endDate: string | null;
    type: string | null;
  };
}

export interface PlayerInfo {
  fideId: number;
  name: string;
  country: string;
  sex: string | null;
  title: string | null;
  gamesCount: number;
}

export const MOCK_GAMES: ChessGame[] = [
  {
    "id": "ac9a1e37-41ca-411c-91a7-16cd3e0c5f9a",
    "tournamentId": 930,
    "datePlayed": "2024-03-12",
    "round": 1,
    "whiteId": 5000017,
    "blackId": 5100020,
    "result": "0-1",
    "whiteElo": 2500,
    "blackElo": 2455,
    "ecoCode": "C11",
    "plyCount": 33,
    "termination": "resignation",
    "endgame": "Ended Before Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 5000017,
      "name": "Anand, Viswanathan",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 5100020,
      "name": "Arun Kumar",
      "country": "IND",
      "sex": "M",
      "title": "IM"
    },
    "eco": {
      "id": "C11",
      "name": "French Defense",
      "example": "1 e4 e6 2 d4 d5 3 Nc3 Nf6",
      "type": "C",
      "group": "Open (inc French)"
    },
    "tournament": {
      "eventId": 930,
      "event": "Philadelphia Open",
      "place": "Philadelphia",
      "federation": "USA",
      "startDate": "2024-03-10",
      "endDate": "2024-03-15",
      "type": "Open"
    }
  },
  {
    "id": "bb9a1e37-41ca-411c-91a7-16cd3e0c5f9b",
    "tournamentId": 931,
    "datePlayed": "2024-04-12",
    "round": 2,
    "whiteId": 5100020,
    "blackId": 5000017,
    "result": "1/2-1/2",
    "whiteElo": 2455,
    "blackElo": 2500,
    "ecoCode": "C11",
    "plyCount": 45,
    "termination": "draw by agreement",
    "endgame": "Rook Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 5100020,
      "name": "Arun Kumar",
      "country": "IND",
      "sex": "M",
      "title": "IM"
    },
    "black": {
      "fideId": 5000017,
      "name": "Anand, Viswanathan",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "C11",
      "name": "French Defense",
      "example": "1 e4 e6 2 d4 d5 3 Nc3 Nf6",
      "type": "C",
      "group": "Open (inc French)"
    },
    "tournament": {
      "eventId": 931,
      "event": "World Blitz",
      "place": "Dubai",
      "federation": "UAE",
      "startDate": "2024-04-10",
      "endDate": "2024-04-15",
      "type": "Blitz"
    }
  },
  {
    "id": "cc9a1e37-41ca-411c-91a7-16cd3e0c5f9c",
    "tournamentId": 932,
    "datePlayed": "2024-05-20",
    "round": 3,
    "whiteId": 4100018,
    "blackId": 5000017,
    "result": "1-0",
    "whiteElo": 2830,
    "blackElo": 2500,
    "ecoCode": "B90",
    "plyCount": 52,
    "termination": "resignation",
    "endgame": "Queen Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 5000017,
      "name": "Anand, Viswanathan",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "B90",
      "name": "Sicilian Defense: Najdorf",
      "example": "1 e4 c5 2 Nf3 d6 3 d4 cxd4 4 Nxd4 Nf6 5 Nc3 a6",
      "type": "B",
      "group": "Semi-Open"
    },
    "tournament": {
      "eventId": 932,
      "event": "Candidates Tournament 2024",
      "place": "Toronto",
      "federation": "CAN",
      "startDate": "2024-05-15",
      "endDate": "2024-06-05",
      "type": "Round Robin"
    }
  },
  {
    "id": "dd9a1e37-41ca-411c-91a7-16cd3e0c5f9d",
    "tournamentId": 932,
    "datePlayed": "2024-05-22",
    "round": 5,
    "whiteId": 5000017,
    "blackId": 4100018,
    "result": "1/2-1/2",
    "whiteElo": 2500,
    "blackElo": 2830,
    "ecoCode": "D37",
    "plyCount": 60,
    "termination": "draw by repetition",
    "endgame": "Rook Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 5000017,
      "name": "Anand, Viswanathan",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "D37",
      "name": "Queens Gambit Declined",
      "example": "1 d4 d5 2 c4 e6 3 Nc3 Nf6 4 Nf3 Be7 5 Bf4",
      "type": "D",
      "group": "Closed"
    },
    "tournament": {
      "eventId": 932,
      "event": "Candidates Tournament 2024",
      "place": "Toronto",
      "federation": "CAN",
      "startDate": "2024-05-15",
      "endDate": "2024-06-05",
      "type": "Round Robin"
    }
  },
  {
    "id": "ee9a1e37-41ca-411c-91a7-16cd3e0c5f9e",
    "tournamentId": 933,
    "datePlayed": "2024-06-10",
    "round": 1,
    "whiteId": 4100018,
    "blackId": 2020009,
    "result": "1-0",
    "whiteElo": 2830,
    "blackElo": 2780,
    "ecoCode": "E20",
    "plyCount": 41,
    "termination": "resignation",
    "endgame": "Ended Before Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 2020009,
      "name": "Ding, Liren",
      "country": "CHN",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "E20",
      "name": "Nimzo-Indian Defense",
      "example": "1 d4 Nf6 2 c4 e6 3 Nc3 Bb4",
      "type": "E",
      "group": "Indian"
    },
    "tournament": {
      "eventId": 933,
      "event": "Norway Chess 2024",
      "place": "Stavanger",
      "federation": "NOR",
      "startDate": "2024-06-08",
      "endDate": "2024-06-18",
      "type": "Round Robin"
    }
  },
  {
    "id": "ff9a1e37-41ca-411c-91a7-16cd3e0c5f9f",
    "tournamentId": 933,
    "datePlayed": "2024-06-12",
    "round": 3,
    "whiteId": 2020009,
    "blackId": 4100018,
    "result": "0-1",
    "whiteElo": 2780,
    "blackElo": 2830,
    "ecoCode": "A15",
    "plyCount": 72,
    "termination": "time forfeit",
    "endgame": "Bishop vs Knight",
    "endgameCount": 1,
    "white": {
      "fideId": 2020009,
      "name": "Ding, Liren",
      "country": "CHN",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "A15",
      "name": "English Opening",
      "example": "1 c4 Nf6",
      "type": "A",
      "group": "Flank"
    },
    "tournament": {
      "eventId": 933,
      "event": "Norway Chess 2024",
      "place": "Stavanger",
      "federation": "NOR",
      "startDate": "2024-06-08",
      "endDate": "2024-06-18",
      "type": "Round Robin"
    }
  },
  {
    "id": "119a1e37-41ca-411c-91a7-16cd3e0c5fa1",
    "tournamentId": 934,
    "datePlayed": "2024-07-05",
    "round": 1,
    "whiteId": 1503014,
    "blackId": 2020009,
    "result": "1/2-1/2",
    "whiteElo": 2795,
    "blackElo": 2780,
    "ecoCode": "C65",
    "plyCount": 38,
    "termination": "draw by agreement",
    "endgame": "Ended Before Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 1503014,
      "name": "Firouzja, Alireza",
      "country": "FRA",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 2020009,
      "name": "Ding, Liren",
      "country": "CHN",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "C65",
      "name": "Ruy Lopez: Berlin Defense",
      "example": "1 e4 e5 2 Nf3 Nc6 3 Bb5 Nf6",
      "type": "C",
      "group": "Open (inc French)"
    },
    "tournament": {
      "eventId": 934,
      "event": "Sinquefield Cup 2024",
      "place": "St. Louis",
      "federation": "USA",
      "startDate": "2024-07-03",
      "endDate": "2024-07-15",
      "type": "Round Robin"
    }
  },
  {
    "id": "229a1e37-41ca-411c-91a7-16cd3e0c5fa2",
    "tournamentId": 934,
    "datePlayed": "2024-07-07",
    "round": 3,
    "whiteId": 2020009,
    "blackId": 1503014,
    "result": "1-0",
    "whiteElo": 2780,
    "blackElo": 2795,
    "ecoCode": "D85",
    "plyCount": 55,
    "termination": "resignation",
    "endgame": "Rook Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 2020009,
      "name": "Ding, Liren",
      "country": "CHN",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 1503014,
      "name": "Firouzja, Alireza",
      "country": "FRA",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "D85",
      "name": "Grunfeld Defense",
      "example": "1 d4 Nf6 2 c4 g6 3 Nc3 d5 4 cxd5 Nxd5",
      "type": "D",
      "group": "Closed"
    },
    "tournament": {
      "eventId": 934,
      "event": "Sinquefield Cup 2024",
      "place": "St. Louis",
      "federation": "USA",
      "startDate": "2024-07-03",
      "endDate": "2024-07-15",
      "type": "Round Robin"
    }
  },
  {
    "id": "339a1e37-41ca-411c-91a7-16cd3e0c5fa3",
    "tournamentId": 935,
    "datePlayed": "2024-08-15",
    "round": 2,
    "whiteId": 6170073,
    "blackId": 1503014,
    "result": "0-1",
    "whiteElo": 2760,
    "blackElo": 2795,
    "ecoCode": "B51",
    "plyCount": 48,
    "termination": "resignation",
    "endgame": "Pawn Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 6170073,
      "name": "Praggnanandhaa, R",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 1503014,
      "name": "Firouzja, Alireza",
      "country": "FRA",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "B51",
      "name": "Sicilian Defense: Moscow Variation",
      "example": "1 e4 c5 2 Nf3 d6 3 Bb5+",
      "type": "B",
      "group": "Semi-Open"
    },
    "tournament": {
      "eventId": 935,
      "event": "Chess Olympiad 2024",
      "place": "Budapest",
      "federation": "HUN",
      "startDate": "2024-08-10",
      "endDate": "2024-08-25",
      "type": "Team"
    }
  },
  {
    "id": "449a1e37-41ca-411c-91a7-16cd3e0c5fa4",
    "tournamentId": 935,
    "datePlayed": "2024-08-18",
    "round": 5,
    "whiteId": 1503014,
    "blackId": 6170073,
    "result": "1-0",
    "whiteElo": 2795,
    "blackElo": 2760,
    "ecoCode": "E60",
    "plyCount": 66,
    "termination": "checkmate",
    "endgame": "Queen Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 1503014,
      "name": "Firouzja, Alireza",
      "country": "FRA",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 6170073,
      "name": "Praggnanandhaa, R",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "E60",
      "name": "Kings Indian Defense",
      "example": "1 d4 Nf6 2 c4 g6",
      "type": "E",
      "group": "Indian"
    },
    "tournament": {
      "eventId": 935,
      "event": "Chess Olympiad 2024",
      "place": "Budapest",
      "federation": "HUN",
      "startDate": "2024-08-10",
      "endDate": "2024-08-25",
      "type": "Team"
    }
  },
  {
    "id": "559a1e37-41ca-411c-91a7-16cd3e0c5fa5",
    "tournamentId": 936,
    "datePlayed": "2024-09-02",
    "round": 1,
    "whiteId": 6170073,
    "blackId": 5000017,
    "result": "1-0",
    "whiteElo": 2760,
    "blackElo": 2500,
    "ecoCode": "C42",
    "plyCount": 40,
    "termination": "resignation",
    "endgame": "Ended Before Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 6170073,
      "name": "Praggnanandhaa, R",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 5000017,
      "name": "Anand, Viswanathan",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "C42",
      "name": "Petrov Defense",
      "example": "1 e4 e5 2 Nf3 Nf6",
      "type": "C",
      "group": "Open (inc French)"
    },
    "tournament": {
      "eventId": 936,
      "event": "Tata Steel Rapid 2024",
      "place": "Kolkata",
      "federation": "IND",
      "startDate": "2024-09-01",
      "endDate": "2024-09-05",
      "type": "Rapid"
    }
  },
  {
    "id": "669a1e37-41ca-411c-91a7-16cd3e0c5fa6",
    "tournamentId": 937,
    "datePlayed": "2024-10-10",
    "round": 4,
    "whiteId": 8601445,
    "blackId": 4100018,
    "result": "1/2-1/2",
    "whiteElo": 2770,
    "blackElo": 2830,
    "ecoCode": "A04",
    "plyCount": 34,
    "termination": "draw by agreement",
    "endgame": "Ended Before Endgame",
    "endgameCount": 1,
    "white": {
      "fideId": 8601445,
      "name": "Gukesh, Dommaraju",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "A04",
      "name": "Reti Opening",
      "example": "1 Nf3 c5",
      "type": "A",
      "group": "Flank"
    },
    "tournament": {
      "eventId": 937,
      "event": "World Championship Match 2024",
      "place": "Singapore",
      "federation": "SGP",
      "startDate": "2024-10-05",
      "endDate": "2024-10-30",
      "type": "Match"
    }
  },
  {
    "id": "779a1e37-41ca-411c-91a7-16cd3e0c5fa7",
    "tournamentId": 937,
    "datePlayed": "2024-10-14",
    "round": 8,
    "whiteId": 4100018,
    "blackId": 8601445,
    "result": "0-1",
    "whiteElo": 2830,
    "blackElo": 2770,
    "ecoCode": "D37",
    "plyCount": 78,
    "termination": "resignation",
    "endgame": "Bishop vs Knight",
    "endgameCount": 1,
    "white": {
      "fideId": 4100018,
      "name": "Carlsen, Magnus",
      "country": "NOR",
      "sex": "M",
      "title": "GM"
    },
    "black": {
      "fideId": 8601445,
      "name": "Gukesh, Dommaraju",
      "country": "IND",
      "sex": "M",
      "title": "GM"
    },
    "eco": {
      "id": "D37",
      "name": "Queens Gambit Declined",
      "example": "1 d4 d5 2 c4 e6 3 Nc3 Nf6 4 Nf3 Be7 5 Bf4",
      "type": "D",
      "group": "Closed"
    },
    "tournament": {
      "eventId": 937,
      "event": "World Championship Match 2024",
      "place": "Singapore",
      "federation": "SGP",
      "startDate": "2024-10-05",
      "endDate": "2024-10-30",
      "type": "Match"
    }
  }
];

// Helper: extract unique players from the dataset
export function getAllPlayers(): PlayerInfo[] {
  const map = new Map<number, PlayerInfo>();

  MOCK_GAMES.forEach(g => {
    if (!map.has(g.whiteId)) {
      map.set(g.whiteId, {
        fideId: g.white.fideId,
        name: g.white.name,
        country: g.white.country,
        sex: g.white.sex,
        title: g.white.title,
        gamesCount: 0,
      });
    }
    if (!map.has(g.blackId)) {
      map.set(g.blackId, {
        fideId: g.black.fideId,
        name: g.black.name,
        country: g.black.country,
        sex: g.black.sex,
        title: g.black.title,
        gamesCount: 0,
      });
    }
    map.get(g.whiteId)!.gamesCount++;
    map.get(g.blackId)!.gamesCount++;
  });

  return Array.from(map.values());
}
