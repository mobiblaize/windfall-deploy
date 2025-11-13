// models/raffleStatus.ts

export const colorMap = {
  live: {
    bg: "#15b79e",
    label: "#125d56",
    text: "Draw Date",
  },
  ended: {
    bg: "#FF2F31",
    label: "#030303",
    text: "Draw Closed",
  },
  inactive: {
    bg: "#FF2F31",
    label: "#030303",
    text: "Inactive",
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
  instant: {
    text: "Game Open",
    bg: "#039855",
    label: "#125d56",
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
  inactive: {
    color: "#ff2f31",
    text: "Inactive",
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
  uuid: string
  name: string
  uniqueID: string
  instant_game: string
  description: string
  long_description: string
  category_id: string
  prize_name: string
  prize_cost: number
  percentage_markup: number
  ticket_price: number
  available_tickets: number
  total_tickets: number
  minimum_ticket_number_purchase: number
  maximum_ticket_number_purchase: number
  maximum_ticket_amount_purchase: number
  discount_type: string
  discount_percentage: number
  discount: Discount
  is_scheduled: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  cta_text: string
  supporting_text: string
  competition_details: string
  sponsorship_details: string
  other_information: string
  documents: string
  card_image: string
  gallery_images: string
  main_active_status: RaffleStatus
  approvalStatus: string
  allow_promo_code_usage: 'true' | 'false'
  allow_referral_balance_usage:  'true' | 'false'
  minimum_referral_balance_amount: number
  maximum_referral_balance_amount: number
  is_active: string
  is_default: string
  is_featured: string
  ticket_tiers: TicketTier[]
  prizes: RafflePrize[]
  requantity_pricing: RequantityPricing
  created_at: string
  updated_at: string
}

export interface Discount {
  type: string
  value: number
  tiers: DiscountTier[]
}

export interface DiscountTier {
  min: number
  max: number
  value: number
}

export interface TicketTier {
  uuid: string
  name: string
  quantity: number
  discount_percentage: number
  original_price: number
  discount_price: number
}

export interface RafflePrize {
  uuid: string
  name: string
  description: string
  image: string
  total_quantity: number
  available_to_be_won: number
  tickets: Ticket[]
}

export interface Ticket {
  uuid: string;
  ticket_number: string;
  issued_at: string;
  flag: 'pending'| 'yet to be won'| 'won' | 'lost' | 'already won' | 'you won';
  prize: Prize2;
  owned_by_user: boolean;
}

export interface Prize2 {
  uuid: string
  name: string
  description: string
}

export interface RequantityPricing {
  quantity: number
  original_total: number
  discount_percentage: number
  discount_value: number
  final_total: number
}



export type GameType = 'instant' | 'raffle';
