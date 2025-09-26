import { Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { useCart } from "../../utils/hooks/useCart";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import LoadingState from "../../components/LoadingState";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import type { DiscountTier } from "../../models/raffles";
import { useAuth } from "../../utils/hooks/useAuth";

export interface UserCart {
  guest_id: string
  cart: Cart
}

export interface Cart {
  items: Item[]
  summary: Summary
}

export interface Item {
  uuid: string
  game_id: string
  game_name: string
  instant_game: string
  is_scheduled: string
  available_tickets: number
  minimum_ticket_number_purchase: number
  maximum_ticket_number_purchase: number
  maximum_ticket_amount_purchase: string
  card_image: string
  description: string
  quantity: number
  unit_price: string
  discounted_unit_price: number
  discount_percentage: string
  discount_amount: number
  total_price: number
  discount: Discount
}

export interface Discount {
  type: string
  value: number
  tiers: DiscountTier[]
}

export interface Summary {
  total_quantity: number
  total_amount: number
  total_discounted_amount: number
  total_difference: number
  overall_discount_percentage: number
}


function Cart() {
  const { cart, cartLoading, cartError, isCartError, updateItemToCart, removeItemFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isCartError) {
      notifications.show({
        title: "Failed to fetch Cart",
        message:
          (cartError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [cartError, isCartError]);

  const navigate = useNavigate();

  console.log(cart);

  const removeItem = async (item: Item) => {	
		try {
		  const response = await removeItemFromCart(item.game_id);
		  notifications.show({
			title: "Action Successful",
			message: response?.message || "Item removed from cart successfully",
			color: "green",
		  });
		} catch (error) {		  
		  notifications.show({
			title: "Failed to Remove Item",
			message:
			  (error as { message?: string })?.message ||
			  "An error occurred",
			color: "red",
		  });
		}
  }

  const setItemQuantity = async (item: Item, quantity: number) => {	
		try {
		  await updateItemToCart(item, quantity);
		  notifications.show({
			title: "Action Successful",
			message: "Item quantity updated successfully",
			color: "green",
		  });
		} catch (error) {		  
		  notifications.show({
			title: "Failed to change quantity",
			message:
			  (error as { message?: string })?.message ||
			  "An error occurred",
			color: "red",
		  });
		}
  }
  

  function toCheckout() {
    if (!isAuthenticated()) {
      navigate("/checkout/signup");
    } 
    else {
      navigate("/checkout");
    }
  }
  

  const items = cart?.cart?.items ?? [];

  return (
    <section>
      <div className="px-6 md:px-16 py-10 text-primary-text mb-32">
        <Text className="!text-2xl !font-semibold !capitalize">
          my game cart{" "}
          <span className="text-primary-red">({cart?.cart.summary.total_quantity || 0})</span>
        </Text>
        <Text className="!text-secondary-text">
          See the list of Raffle Ticket you want buy. Checkout now before draw
        </Text>

        {cartLoading && (
          <LoadingState description="Getting your selected games" />
        )}

        {!cartLoading && (
          <>
            {!items?.length && <EmptyCart />}

            {items.length && (
              <>
                {items.map((item) => (
                  <CartItem setItemQuantity={setItemQuantity} removeItem={removeItem} key={item.uuid} item={item} />
                ))}
                <div className="bg-white rounded-xl border border-[#e5e7eb] px-6 py-6 mt-10 shadow-sm">
                  <div className="flex flex-col justify-between gap-6">
                    <div className="space-y-3 text-gray-800 text-sm">
                      <div className="flex justify-between items-center gap-6">
                        <p>
                          <span className="font-medium">
                            Total Number of Ticket:
                          </span>
                        </p>
                        <p>
                          <span className="font-bold">{cart?.cart.summary.total_quantity} Ticket</span>
                        </p>
                      </div>
                      <div className="flex justify-between items-center gap-6">
                        <p>
                          <span className="font-medium">
                            Total Prices of Ticket:
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-lg">{formatCurrency(cart?.cart.summary.total_discounted_amount)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-6">
                      <button
                        onClick={() => toCheckout()}
                        className="bg-primary-red text-white font-semibold text-sm px-6 py-3 rounded-md border-[2px] border-dashed border-[#fff] hover:bg-primary-red transition"
                      >
                        Checkout ~ {formatCurrency(cart?.cart.summary.total_discounted_amount)}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
