import { notifications } from "@mantine/notifications";
import { usePostData } from "./useApis";

export function useTransferCart() {
  const transferMutation = usePostData("customer/cart/transfer");

  const transferCart = async () => {
    // check guest id directly
    const currentGuestId = localStorage.getItem("guest_id");
    if (!currentGuestId) return;

    try {
      const response = await transferMutation.mutateAsync({
        url: "customer/cart/transfer",
        payload: {},
        headers: { "X-Guest-Cart-ID": currentGuestId },
      });

      // clear guest id completely
      localStorage.removeItem("guest_id");

      return response;
    } catch (error) {
      notifications.show({
        title: "Failed to transfer cart",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  return { transferCart, transferMutation };
}
