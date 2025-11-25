import {
  Modal,
  Text,
  Badge,
  Divider,
  Box,
  Button,
  Flex,
  Group,
  Loader,
} from "@mantine/core";
import { format } from "date-fns";
import type { RaffleTransaction } from "./TransactionList";
import CustomButton from "../../../components/Buttons/CustomButton";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { IoInformationCircleOutline, IoWarningOutline } from "react-icons/io5";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import UserAvatar from "../../../components/UserAvatar";

type TransactionModalProps = {
  opened: boolean;
  onClose: () => void;
  transaction: RaffleTransaction | null;
  showProfileButton?: boolean
};

// API Response Types
interface DrawInfo {
  has_completed_draws: boolean;
  completed_draws: unknown[];
  is_winner_in_any_draw: boolean;
  winning_draws: unknown[];
}

interface Ticket {
  ticket_number: string;
  validation_number: string;
  status: string;
  is_winner: number;
  draw_info: DrawInfo;
  game_name?: string; // Will be added when merging
}

interface Game {
  uuid: string;
  name: string;
  uniqueID: string;
  ticket_price: number;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface OrderDetail {
  uuid: string;
  quantity: number;
  unit_amount: number;
  total_amount: number;
  paid_amount: number;
  discount_amount: number;
}

interface GameWithTickets {
  order_detail: OrderDetail;
  game: Game;
  tickets_count_on_page: number;
  winning_tickets_on_page: number;
  tickets: Ticket[];
}

export default function TransactionDetails({
  opened,
  onClose,
  transaction,
  showProfileButton = true,
}: TransactionModalProps) {
  const navigate = useNavigate();
  const [ticketsOpen, setTicketsOpen] = useState(false);

  const transactionUrl = transaction?.uuid
    ? `admin/transaction-management/transaction-with-tickets/${transaction.uuid}`
    : null;

  // Fetch tickets for the transaction
  const {
    data: ticketsResponse,
    isLoading: isLoadingTickets,
    isError: isTicketsError,
    error: ticketsError,
  } = useFetchData(transactionUrl, undefined, opened && !!transaction?.uuid);
  const downloadReceiptMutation = useGetExportData(
    `${transactionUrl}?download_receipt=true`
  );

  // Merge all tickets from all games with game names
  const allTickets = useMemo(() => {
    if (!ticketsResponse?.data?.games_with_tickets) return [];
    return ticketsResponse.data.games_with_tickets.flatMap(
      (gameWithTickets: GameWithTickets) =>
        (gameWithTickets.tickets || []).map((ticket: Ticket) => ({
          ...ticket,
          game_name: gameWithTickets.game.name,
        }))
    );
  }, [ticketsResponse]);

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    // Based on design: most items show warning icon, some show info icon
    if (status === "won") {
      return null; // Won status might not need an icon
    } else if (status === "lost" || status === "pending") {
      // Show warning triangle for lost/pending (like items 1-4 in design)
      return <IoWarningOutline className="text-primary-red" size={20} />;
    } else {
      // For other statuses or variation (like item 5 in design)
      return (
        <IoInformationCircleOutline className="text-[#F59E0B]" size={20} />
      );
    }
  };

  // Handle tickets fetch errors
  useEffect(() => {
    if (isTicketsError && opened) {
      notifications.show({
        title: "Failed to fetch tickets",
        message:
          (ticketsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isTicketsError, ticketsError, opened]);

  if (!transaction) return null;

  const downloadReceipt = () => {
    downloadReceiptMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${transaction.uniqueID}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Download Successful",
          message: "Your file has been downloaded",
          color: "green",
        });
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

  const fields = [
    { label: "Transaction ID", value: transaction.uniqueID },
    {
      label: "Purchase Date & Time",
      value: transaction.created_at
        ? format(new Date(transaction.created_at), "MMMM d, yyyy h:mm a")
        : "-",
    },
    {
      label: "Purchase Source",
      value: <span className="capitalize">{transaction.platform}</span>,
    },
    {
      label: "Payment Method",
      value: <span className="capitalize">{transaction.payment_method}</span>,
    },
    {
      label: "Payment Channel",
      value: <span className="capitalize">{transaction.payment_channel}</span>,
    },
    {
      label: "Payment Status",
      value: (
        <Badge
          color={
            transaction.payment_status === "successful"
              ? "green"
              : transaction.payment_status === "pending"
                ? "yellow"
                : "red"
          }
          radius="md"
          className="!capitalize !text-sm !h-[22px]"
          variant="light"
        >
          {transaction.payment_status}
        </Badge>
      ),
    },
    {
      label: "Amount Paid",
      value: <span className="capitalize">{formatCurrency(transaction.paid_amount)}</span>,
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <Text className="!font-bold !text-lg">Game Transaction</Text>
          <Text className="!text[#4C4D61] mb-4">
            Game transaction as it relate to a customer
          </Text>
        </div>
      }
      className="!text-primary-text"
      centered
      radius="lg"
      size="lg"
    >
      <Flex
        justify="space-between"
        align="center"
        wrap={"wrap"}
        columnGap={15}
        rowGap={10}
      >
        <Flex gap={10}>
          <UserAvatar
            image={transaction.customer.avatar}
            subString={`${transaction.customer.firstname} ${transaction.customer.lastname}`}
            radius="md"
            size={70}
            className="border-3 border-primary-red rounded-lg"
          />
          <div>
            <Text className="!font-medium !capitalize !text-primary-text !text-base">
              {transaction.customer.firstname} {transaction.customer.lastname}
            </Text>
            <Text className="!text-secondary-text !text-sm">
              ID: {transaction.customer.uniqueID} |{" "}
              {transaction.customer.phone_number}
            </Text>

            <Badge
              color="green"
              radius="md"
              className="!capitalize !text-sm !h-[22px]"
              variant="light"
            >
              Verified
            </Badge>
          </div>
        </Flex>

        {showProfileButton && <Button
          className="!border-[#D0D5DD] !text-secondary-text !capitalize"
          size="md"
          variant="outline"
          radius={"lg"}
          rightSection={
            <div className="!inline-flex p-1 w-fit rounded-md">
              <GoArrowUpRight className="!text-secondary-text" />
            </div>
          }
          onClick={() =>
            navigate(`/admin/customers/${transaction.customer_id}`)
          }
        >
          view profile
        </Button>}
      </Flex>

      <Box
        className="border border-dashed !text-center border-primary-red bg-secondary-red rounded-2xl"
        px={"md"}
        py={"md"}
        my={"md"}
      >
        <Flex
          justify={"space-between"}
          className="!cursor-pointer"
          gap={10}
          onClick={() => setTicketsOpen(!ticketsOpen)}
        >
          <Text tt="capitalize" className="!text-primary-red" fw={600}>
            Game Ticket
          </Text>
          <Group>
            {isLoadingTickets ? (
              <Loader size="sm" color="var(--color-primary-red)" />
            ) : (
              <Text tt="capitalize" className="!text-primary-red" fw={600}>
                {allTickets.length > 0
                  ? allTickets.length.toLocaleString()
                  : transaction.tickets_count?.toLocaleString() || "0"}
              </Text>
            )}
            <span>
              {ticketsOpen ? (
                <IconChevronUp size={20} className="text-primary-red" />
              ) : (
                <IconChevronDown size={20} className="text-primary-red" />
              )}
            </span>
          </Group>
        </Flex>

        {ticketsOpen && (
          <>
            {isLoadingTickets ? (
              <Flex justify="center" align="center" mt="md" py="md">
                <Loader size="md" color="var(--color-primary-red)" />
              </Flex>
            ) : allTickets.length > 0 ? (
              <Box mt="md" className="space-y-3">
                {allTickets.map((ticket: Ticket, index: number) => (
                  <Flex
                    key={`${ticket.ticket_number}-${index}`}
                    justify="space-between"
                    align="center"
                    className="!border-b !border-secondary-text/20 pb-3 last:!border-b-0"
                    gap={10}
                  >
                    <Flex align="center" gap={8} flex={1}>
                      {getStatusIcon(ticket.status)}
                      <Text className="!text-secondary-text !text-sm">
                        {index + 1}. {ticket.game_name || "Game Entry"}
                      </Text>
                    </Flex>
                    <Text className="!text-secondary-text !text-sm !text-right">
                      {ticket.ticket_number}
                    </Text>
                  </Flex>
                ))}
              </Box>
            ) : (
              <Flex justify="center" align="center" mt="md" py="md">
                <Text tt="capitalize" className="!text-secondary-text">
                  No Tickets Found
                </Text>
              </Flex>
            )}
          </>
        )}
      </Box>

      <div className="mb-10">
        {fields.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between gap-10 items-start py-5">
              <Text className="!text[#4C4D61]">{item.label}</Text>
              <div className="!font-medium text-[#000014] text-end">
                {item.value}
              </div>
            </div>
            {idx !== fields.length - 1 && <Divider />}
          </div>
        ))}
      </div>
      <Box className="justify-center gap-4 space-y-5">
        <CustomButton
          fullWidth
          size="lg"
          border={false}
          onClick={downloadReceipt}
          disabled={downloadReceiptMutation.isPending}
          loading={downloadReceiptMutation.isPending}
          className="flex-1 !font-medium"
        >
          Download Receipt
        </CustomButton>

        <Button
          fullWidth
          size="lg"
          onClick={onClose}
          variant="default"
          className="flex-1 !font-medium"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
