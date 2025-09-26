import type { Raffle } from "../../models/raffles";
import type { Item } from "../../pages/checkout/Cart";
import { evaluateDiscount } from "./evaluateDiscount";

export function raffleToCartItem(
  raffle: Raffle,
  quantity: number
): Item {
  const pricePerItem = raffle.ticket_price;

  // Use your discount evaluator
  const discountResult = evaluateDiscount(
    pricePerItem,
    quantity,
    raffle.discount?.tiers
  );

  return {
    uuid: raffle.uuid,
    game_id: raffle.uuid,
    game_name: raffle.name,
    instant_game: raffle.instant_game,
    is_scheduled: raffle.is_scheduled,
    available_tickets: raffle.available_tickets,
    minimum_ticket_number_purchase: raffle.minimum_ticket_number_purchase,
    maximum_ticket_number_purchase: raffle.maximum_ticket_number_purchase,
    maximum_ticket_amount_purchase:
      raffle.maximum_ticket_amount_purchase.toString(),
    card_image: raffle.card_image,
    description: raffle.description,
    quantity,
    unit_price: pricePerItem.toString(),
    discounted_unit_price: discountResult.discountedPricePerItem,
    discount_percentage: (discountResult.discountPercent * 100).toString(),
    discount_amount:
      discountResult.totalOriginalPrice - discountResult.discountedTotal,
    total_price: discountResult.discountedTotal,
    discount: raffle.discount,
    allow_promo_code_usage: raffle.allow_promo_code_usage,
    allow_referral_balance_usage: raffle.allow_referral_balance_usage,
  };
}
