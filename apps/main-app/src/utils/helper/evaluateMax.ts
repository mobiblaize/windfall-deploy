import type { Raffle } from "../../models/raffles";

export default function evaluateMax(raffle: Raffle) {
    const raffleMax = raffle.maximum_ticket_number_purchase;
      const available = raffle.available_tickets;
      return Math.min(raffleMax, available);
}