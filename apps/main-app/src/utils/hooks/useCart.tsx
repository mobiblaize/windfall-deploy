import { atom, useAtom } from "jotai";
import { useFetchData, usePostData, useDeleteData } from "./useApis";
import type { Item, UserCart } from "../../pages/checkout/Cart";
import { userAtom } from "./useStorage";
import { atomWithStorage } from "jotai/utils";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

function getOrCreateGuestId(): string {
  const key = "guest_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const newId = uuidv4();
  localStorage.setItem(key, newId);
  return newId;
}

export const cartAtom = atom<UserCart | null>(null);

export const guestIdAtom = atomWithStorage<string>(
  "guest_id",
  getOrCreateGuestId()
);

export function useCart() {
  const [user] = useAtom(userAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [activeGuestId] = useAtom(guestIdAtom);

  const guestHeaders: Record<string, string> | undefined =
    !user && activeGuestId ? { "X-Guest-Cart-ID": activeGuestId } : undefined;

  // fetch initial cart
  const {
    data: cartResponse,
    isLoading: cartLoading,
    refetch: refetchCart,
    isError: isCartError,
    error: cartError,
  } = useFetchData("guest/cart", guestHeaders);

  // keep atom in sync with backend
  useEffect(() => {
    if (cartResponse?.data) {
      setCart(cartResponse.data);
    }
  }, [cartResponse, setCart]);

  // add item
  const addItemMutation = usePostData("", guestHeaders);
  const addItemToCart = async (id: string, quantity: number) => {
    const response = await addItemMutation.mutateAsync({
      url: `guest/cart/add/${id}`,
      payload: { quantity },
    });

    if (response?.data) {
      setCart(response.data);
    }

    return response;
  };

  // update item
  const updateItemMutation = usePostData("", guestHeaders);
  const updateItemToCart = async (item: Item, quantity: number) => {
    if (!cart) return;

    const response = await updateItemMutation.mutateAsync({
      url: `guest/cart/add/${item.game_id}`,
      payload: { quantity },
    });

    if (response?.data) {
      setCart(response.data);
    }

    return response;
  };

  // remove item
  const removeItemMutation = useDeleteData("guest/cart/remove", guestHeaders);
  const removeItemFromCart = async (itemId: string) => {
    const response = await removeItemMutation.mutateAsync(itemId);

    if (response?.data) {
      setCart(response.data);
    }

    return response;
  };

  // delete cart
  const deleteCartMutation = useDeleteData("guest/cart/empty", guestHeaders);
  const deleteCart = async () => {
    const response = await deleteCartMutation.mutateAsync(undefined);
    setCart(null); // reset atom
    return response;
  };
  
  // transfer cart (guest to user)
  const transferCartMutation = usePostData("customer/cart/transfer");
  const transferCart = async () => {
    if (!activeGuestId || !cart?.cart.summary.total_quantity) return; // nothing to transfer

    try {
      const response = await transferCartMutation.mutateAsync({
        url: "customer/cart/transfer",
        payload: {}, // no body
        headers: { "X-Guest-Cart-ID": activeGuestId },
      });

      // clear guest id after successful transfer
      localStorage.removeItem("guest_id");

      return response;
    } catch (error) {
      console.error("Failed to transfer cart:", error);
      throw error;
    }
  };

  // get current quantity of an item
  const getItemQuantity = (itemId: string): number | undefined => {
    return cart?.cart.items.find((i) => i.game_id === itemId)?.quantity;
  };

  return {
    // global state
    cart,
    setCart,

    // fetching state
    cartLoading,
    isCartError,
    cartError,
    refetchCart,

    // exposed mutations
    addItemToCart,
    addItemMutation,

    updateItemToCart,
    updateItemMutation,

    removeItemFromCart,
    removeItemMutation,

    deleteCart,
    deleteCartMutation,

    transferCart,
    transferCartMutation,

    // helpers
    getItemQuantity,
  };
}
