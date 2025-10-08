import { memo } from "react";
import { Card, Image, Text } from "@mantine/core";
import { HiMiniTrash } from "react-icons/hi2";
import { PiPlusFill, PiMinusFill } from "react-icons/pi";
import InstantBadge from "../raffles/InstantBadge";
import type { Item } from "./Cart";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDebounce } from "../../utils/hooks/useDebounce";
import defaultRaffleImg from "../../utils/helper/defaultRaffeImg";

interface CartItemProps {
  item: Item;
  removeItem: (item: Item) => void;
  setItemQuantity: (item: Item, quantity: number) => void;
}

function CartItemComponent({
  item,
  removeItem,
  setItemQuantity,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(quantity, 1000);
  const navigate = useNavigate();
  const isInstant = item?.instant_game === "true";

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (debouncedQuantity !== item.quantity) {
      setItemQuantity(item, debouncedQuantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < item.minimum_ticket_number_purchase) {
        return item.minimum_ticket_number_purchase;
      }
      if (newQty > item.maximum_ticket_number_purchase) {
        return item.maximum_ticket_number_purchase;
      }
      return newQty;
    });
  };

  const cardImage = item.card_image ? item.card_image : defaultRaffleImg;

  const hasDiscount = !!Number(item.discount_percentage);
  const originalPrice = Number(item.unit_price) * Number(item.quantity);

  return (
    <Card className="!border !border-dashed !border-primary-red !rounded-lg !my-10 !bg-white/80">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        {/* Left: Image + Details */}
        <div className="flex items-center gap-x-3 flex-1">
          <div
            onClick={() => navigate(`/raffles/${item.game_id}`)}
            className="rounded-2xl cursor-pointer overflow-hidden border-2 border-primary-red h-24 w-32"
          >
            <Image src={cardImage} className="h-full" />
          </div>
          <div>
            <Text className="md:!text-xl !font-semibold">{item.game_name}</Text>
            <Text className="!text-secondary-text">{item.description}</Text>
            <div className="mt-1">
              {isInstant && <InstantBadge size="sm" />}
            </div>
          </div>
        </div>

        {/* Right: Quantity + Prices + Remove */}
        <div className="flex flex-wrap gap-4 justify-around items-center flex-1">
          {/* Quantity Controls */}
          <div className="flex gap-x-2 md:gap-x-5 items-center">
            <PiPlusFill
              onClick={() => handleQuantityChange(1)}
              size={32}
              className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
            />

            <Text className="!px-4 !py-1 !rounded-t-lg !font-semibold !text-primary-red md:!text-xl !bg-secondary-red !border-b-2 !border-primary-red">
              {quantity}
            </Text>

            <PiMinusFill
              onClick={() => handleQuantityChange(-1)}
              size={32}
              className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
            />
          </div>

          <div className="flex gap-x-2 justify-around items-center flex-1">
            {/* Unit Price */}
            <div className="text-center tracking-wide">
              <Text className="!text-secondary-text !text-sm md:!text-base">
                Unit price
              </Text>
              <Text className="!font-semibold md:!text-xl ">
                {formatCurrency(item.unit_price)}
              </Text>
            </div>

            {/* Total Price */}
            <div className="text-center tracking-wide">
              <Text className="!text-secondary-text !text-sm md:!text-base">
                Total price
              </Text>
              <Text className="!font-semibold md:!text-xl ">
                {formatCurrency(item.total_price)}
              </Text>
              {hasDiscount && (
                <Text className="!line-through !text-primary-red !font-light md:!text-lg">
                  {formatCurrency(originalPrice)}
                </Text>
              )}
            </div>

            {/* Remove Button */}
            <HiMiniTrash
              onClick={() => removeItem(item)}
              className="text-primary-red rounded-full bg-[#FFD5D6] p-1 md:p-2 cursor-pointer text-3xl md:text-4xl"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

// ✅ Wrap with memo to prevent re-renders unless props change
const CartItem = memo(CartItemComponent, (prevProps, nextProps) => {
  // shallow compare `item` and callbacks
  return (
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.total_price === nextProps.item.total_price &&
    prevProps.item.discount_percentage === nextProps.item.discount_percentage &&
    prevProps.removeItem === nextProps.removeItem &&
    prevProps.setItemQuantity === nextProps.setItemQuantity
  );
});

export default CartItem;
