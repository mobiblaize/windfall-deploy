import type { DiscountTier } from "../../models/raffles";

export interface DiscountResult {
  activeDiscount?: DiscountTier;
  discountPercent: number;              // e.g. 0.2 for 20%
  discountedPricePerItem: number;
  discountedTotal: number;
  totalOriginalPrice: number;
}

/**
 * Evaluates discounts for any item with a base price, quantity, and discount tiers.
 */
export function evaluateDiscount(
  pricePerItem: number,
  quantity: number,
  discountTiers?: DiscountTier[]
): DiscountResult {
  const totalOriginalPrice = pricePerItem * quantity;

  // Find matching discount tier (highest tier that fits the quantity)
  const activeDiscount = discountTiers
    ?.slice()
    ?.reverse()
    ?.find((tier) => quantity >= tier.min && quantity <= tier.max);

  const discountPercent = activeDiscount ? activeDiscount.value / 100 : 0;

  const discountedPricePerItem = pricePerItem * (1 - discountPercent);
  const discountedTotal = discountedPricePerItem * quantity;

  return {
    activeDiscount,
    discountPercent,
    discountedPricePerItem,
    discountedTotal,
    totalOriginalPrice,
  };
}
