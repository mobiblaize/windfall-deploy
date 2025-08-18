// models/raffleStatus.ts

export const colorMap = {
  active: {
    bg: "#15b79e",
    label: "#125d56",
    text: "Draw Date",
  },
  completed: {
    bg: "#64748b",
    label: "#334155",
    text: "Completed",
  },
  upcoming: {
    bg: "#f79009",
    label: "#93370d",
    text: "Coming Soon",
  },
  won: {
    bg: "#FF2F31",
    label: "#030303",
    text: "Draw Date",
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
}
