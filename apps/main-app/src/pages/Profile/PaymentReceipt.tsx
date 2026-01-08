import { Text, Card, Image, Grid, Divider, Flex } from "@mantine/core";
import CustomButton from "../../components/Buttons/CustomButton";
import { HiDocumentArrowDown } from "react-icons/hi2";
import RelatedRaffles from "../raffles/RelatedRaffles";
import { useEffect, useState } from "react";
import AlertModal from "../../components/Modals/AlertModal";
import MyGameHeader from "./MyGameHeader";
import type { Crumb } from "../../components/DynamicBreadCrumbs";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchData, useGetExportData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import GameBadge from "../../components/GameBadge";
import type { RaffleStatus } from "../../models/raffles";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { formatDateString } from "../../utils/helper/formatDateString";

export interface OrderData {
  order: Order;
  order_details: OrderDetail[];
}

export interface Order {
  uuid: string;
  uniqueID: string;
  customer_id: string;
  game_id: string;
  platform: string;
  merchant: string;
  merchant_id: string;
  payment_method: string;
  payment_type: string;
  transaction_id: string;
  reference: string;
  early_bird: number;
  quantity: number;
  total_amount: string;
  paid_amount: string;
  promo_amount: string;
  discount_amount: string;
  referral_balance_amount: string;
  promo_code: string;
  promo_code_id: string;
  referral_code: string;
  status: "order placed" | "pending" | "failed";
  payment_status: string;
  ip_address: string;
  city: string;
  region: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface OrderDetail {
  uuid: string;
  game_id: string;
  order_id: string;
  quantity: number;
  unit_amount: string;
  total_amount: string;
  paid_amount: string;
  discount_amount: string;
  created_at: string;
  updated_at: string;
  game: Game;
}

export interface Game {
  uuid: string;
  name: string;
  instant_game: string;
  card_image: string;
  description: string;
  supporting_text: string;
  start_date: string;
  end_date: string;
  main_active_status: RaffleStatus;
  start_time: string;
  end_time: string;
}

type ContextType = { setCrumbs: React.Dispatch<React.SetStateAction<Crumb[]>> };
const items: Crumb[] = [
  { label: "Transactions", to: "/profile/transaction" },
  { label: "Order 121211" },
];

export default function PaymentReceipt() {
  const { id } = useParams<{ id: string }>();
  const { setCrumbs } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData>();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);
  const transactionUrl = `customer/games/order/${id}/games`;
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(transactionUrl);
  const downloadReceiptMutation = useGetExportData(
    `${transactionUrl}?download_receipt=true`
  );

  useEffect(() => {
    setCrumbs(items);
  }, [setCrumbs]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch order details",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setOrder(response.data);
      const hasReceipt = location.pathname.includes("/receipt/");
      if (hasReceipt) {
        setPaymentSuccessModalOpen(true);
      }
    }
  }, [error, isError, response]);

  const cardImages = (cardImage: string) => {
    return cardImage ? cardImage.split("|").filter(Boolean) : [];
  };

  const downloadReceipt = () => {
    downloadReceiptMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${order?.order.uniqueID}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Download Successful",
          message: "Your file has been downloaded",
          color: "green",
        });
        
        setSuccessModalOpen(true);
      },
      onError: (error) => {
        notifications.show({
          title: "Download Failed",
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  return (
    <div>
      <MyGameHeader
        title={
          <span className="!font-bold !text-[#2D2D2D] !text-2xl !mb-1">
            Order ID:{" "}
            <span className="text-primary-red">{order?.order?.uniqueID}</span>
          </span>
        }
        description="View and download transaction receipt."
      >
        {order && (
          <CustomButton
            rightSection={<HiDocumentArrowDown size={18} />}
            onClick={downloadReceipt}
            disabled={downloadReceiptMutation.isPending}
            loading={downloadReceiptMutation.isPending}
          >
            Download Receipt
          </CustomButton>
        )}
      </MyGameHeader>
      <Divider />
      <section className="sm:mx-5 px-6 md:px-16 py-12">
        {isLoading && (
          <LoadingState description="Getting your transaction details" />
        )}

        {!isLoading && (
          <>
            {!order && (
              <EmptyState
                description="Order not Found"
                title="Order not found"
                btnText="Explore Games"
                redirectLink="/raffles"
              />
            )}
            {order && (
              <Grid gutter="lg" className="!mb-20">
                {order?.order_details.map((item) => {
                  const isInstant =
                    item.game?.main_active_status === "instant" ||
                    item.game?.instant_game === "true";
                  return (
                    <Grid.Col
                    onClick={() => {
                      navigate(`/profile/all-games/${item.uuid}`);
                    }}
                      key={item.uuid}
                      span={{ base: 12, sm: 6, md: 4 }}
                      className="!justify-end !cursor-pointer !flex !flex-col mb-10 !items-center 
                      !transition-transform !duration-300 !ease-in-out
                      group"
                    >
                      <Image
                        src={cardImages(item.game.card_image)}
                        alt="wallet"
                        className="!w-[66%] mb-5"
                      />
                      <Card
                        withBorder
                        radius="lg"
                        className="!pb-7 w-full !shadow-md transition-all duration-300 !border !border-transparent
               group-hover:!border-primary-red group-hover:!bg-light-red"
                      >
                        <Text
                          fw={600}
                          mt="sm"
                          className="!text-[#2D2D2D] text-center !text-xl !font-bold"
                        >
                          {item.game.name}
                        </Text>

                        <Text className="text-center !text-secondary-text !text-sm">
                          {item.game.description}
                        </Text>

                        <Flex
                          justify="space-between"
                          gap={5}
                          className="!mt-4 !mb-3"
                        >
                          <Text className="!text-sm !text-secondary-text">
                            <span>Transaction Date:</span>
                          </Text>
                          <Text className="!text-sm !text-primary-text !font-medium">
                            <span>{formatDateString(item.created_at, "MMMM d, yyyy h:mm a")}</span>
                          </Text>
                        </Flex>

                        <Flex
                          justify="space-between"
                          gap={5}
                          className="!mb-3"
                        >
                          <Text className="!text-sm !text-secondary-text">
                            <span>No. of Ticket Unit (s):</span>
                          </Text>
                          <Text className="!text-sm !text-primary-text !font-medium">
                            <span>{item.quantity}</span>
                          </Text>
                        </Flex>

                        <Flex justify="space-between" gap={5} className="!mb-3">
                          <Text className="!text-sm !text-secondary-text">
                            <span>Ticket Unit Price: </span>
                          </Text>
                          <Text className="!text-sm !text-primary-text !font-medium">
                            <span>{formatCurrency(item.unit_amount)}</span>
                          </Text>
                        </Flex>

                        <Flex justify="space-between" gap={5} className="!mb-3">
                          <Text className="!text-sm !text-secondary-text">
                            <span>Discount Amount:</span>
                          </Text>
                          <Text className="!text-sm !text-primary-text !font-medium">
                            <span>{formatCurrency(item.discount_amount)}</span>
                          </Text>
                        </Flex>

                        <Flex justify="space-between" gap={5} className="!mb-3">
                          <Text className="!text-sm !text-secondary-text">
                            <span>Sub-Total:</span>
                          </Text>
                          <Text className="!text-sm !text-primary-text !font-medium">
                            <span>{formatCurrency(item.paid_amount)}</span>
                          </Text>
                        </Flex>

                        <GameBadge
                          startDate={item.game?.start_date}
                          endDate={item.game?.end_date}
                          startTime={item.game?.start_time}
                          endTime={item.game?.end_time}
                          status={item.game?.main_active_status}
                          gameType={isInstant ? "instant" : "raffle"}
                        />
                      </Card>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
          </>
        )}

        {order?.order_details?.[0]?.game_id && (
          <div className="-mx-5 mt-10">
            <RelatedRaffles id={order?.order_details?.[0]?.game_id} />
          </div>
        )}
      </section>
      <AlertModal
        opened={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        status="success"
        title="Receipt Downloaded"
        description="Congratulations, you have successfully downloaded the receipt for this transaction."
      />
      <AlertModal
        opened={paymentSuccessModalOpen}
        status="success"
        title={
          order?.order.status === "order placed"
            ? "Raffle Ticket Payment Completed"
            : order?.order.status === "pending"
              ? "Raffle Ticket Payment Processing"
              : "Raffle Ticket Payment Failed"
        }
        description={
          order?.order.status === "order placed"
            ? "Congratulations, you have successfully paid for your raffle ticket(s) for specific games. Copies of the Digital raffles Tickets has been sent to your email address and you can see more on your WindFall Raffle Profile."
            : order?.order.status === "pending"
              ? "Your payment is still being processed. You will be notified once the process is completed."
              : "Unfortunately, your payment was not successful. Please try again or use a different payment method."
        }
        primaryButton={{
          label: "Done",
          onClick: () => {
            setPaymentSuccessModalOpen(false);
          },
        }}
      />
    </div>
  );
}
