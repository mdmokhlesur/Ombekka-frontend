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
  }
];
