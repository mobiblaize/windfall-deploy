import type { RafflePrize } from "../../models/raffles";
import type { PrizeGroup } from "../../pages/Admin/GameMgt/WinnerTab";

export function transformPrizeGroupsToRafflePrizes(
  prizeGroups?: PrizeGroup[]
): RafflePrize[] {
  return prizeGroups?.map((group) => {
    const { prize, counts, tickets } = group;

    return {
      uuid: prize.uuid || '',
      name: prize.name,
      description: prize.description || '',
      image: prize.image || '',
      total_quantity: counts.total_tickets,
      available_to_be_won: counts.winning_tickets,
      tickets: tickets.map((ticketWrapper) => {
        const { ticket, customer } = ticketWrapper;
        
        // Determine flag based on ticket state and ownership
        let flag: 'pending' | 'yet to be won' | 'won' | 'lost' | 'already won' | 'you won';
        
        if (ticket.is_winner) flag = 'already won';
        else {
          if (customer) {
            flag = 'lost';
          } else {
            flag = 'yet to be won';
          }
        }
        
        return {
          uuid: ticket.uuid,
          ticket_number: ticket.number,
          issued_at: ticket.issued_at || new Date().toISOString(),
          flag,
          prize: {
            uuid: prize.uuid || '',
            name: prize.name,
            description: prize.description || '',
          },
          owned_by_user: !!customer,
        };
      }),
    };
  }) ?? [];
}