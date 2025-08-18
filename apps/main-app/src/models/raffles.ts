// models/raffleStatus.ts

export const colorMap = {
  active: {
    bg: "#15b79e",
    label: "#125d56",
    text: "Draw Date",
  },
  completed: {
    bg: "#FF2F31",
    label: "#030303",
    text: "Draw Closed",
  },
  upcoming: {
    bg: "#f79009",
    label: "#93370d",
    text: "Upcoming",
  },
  won: {
    bg: "#FF2F31",
    label: "#030303",
    text: "Draw Date",
  },
};

export const instantGameColorMap = {
  upcoming: {
    color: "#DC6803",
    text: "Upcoming",
  },
  open: {
    color: "#039855",
    text: "Game Open",
  },
  closed: {
    color: "#ff2f31",
    text: "Game Closed",
  },
};

export const liveGameColorMap = {
  live: {
    bg: "#D1FADF",
    color: "#039855",
    text: "Live Game",
  },
  closed: {
    bg: "#FFF7F7",
    color: "#ff2f31",
    text: "Closed Game",
  },
};

export type RaffleStatus = keyof typeof colorMap;

export interface Raffle {
  title: string;
  description: string;
  fee: string;
  image: string;
  sold: number;
  date: string;
  status: RaffleStatus;
  category: string;
  prizeType: string;
  ticketType: string;
  drawTime: string;
  gameType: GameType;
}

export type GameType = 'instant' | 'raffle';
