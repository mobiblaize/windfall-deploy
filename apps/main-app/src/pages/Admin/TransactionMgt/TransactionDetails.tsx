import {
  Modal,
  Text,
  Badge,
  Divider,
  Box,
  Button,
  Flex,
  Avatar,
  Group,
} from "@mantine/core";
import { format } from "date-fns";
import type { RaffleTransaction } from "./TransactionList";
import CustomButton from "../../../components/Buttons/CustomButton";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";

type TransactionModalProps = {
  opened: boolean;
  onClose: () => void;
  transaction: RaffleTransaction | null;
};

export default function TransactionDetails({
  opened,
  onClose,
  transaction,
}: TransactionModalProps) {
  const navigate = useNavigate();
  const [ticketsOpen, setTicketsOpen] = useState(false);
  if (!transaction) return null;

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
          <Avatar
            alt="Profile"
            radius="md"
            src={transaction.customer.avatar}
            size={70}
            className="border-3 border-primary-red rounded-lg"
          />
          <div>
            <Text className="!font-medium !capitalize !text-primary-text !text-base">
              {transaction.customer.firstname} {transaction.customer.firstname}
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

        <Button
          className="!border-[#D0D5DD] !text-secondary-text !capitalize"
          size="md"
          variant="outline"
          radius={"lg"}
          rightSection={
            <div className="!inline-flex p-1 w-fit rounded-md">
              <GoArrowUpRight className="!text-secondary-text" />
            </div>
          }
          onClick={() => navigate(`/admin/customers/${transaction.customer_id}`)}
        >
          view profile
        </Button>
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
            <Text tt="capitalize" className="!text-primary-red" fw={600}>
              {transaction.tickets_count?.toLocaleString()}
            </Text>
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
            {transaction.games.map((game, index) => (
              <Flex
                justify={"space-between"}
                className="!cursor-pointer"
                mt={"sm"}
                gap={10}
              >
                <Text tt="capitalize" className="!text-secondary-text">
                  {index + 1}. {game.name}
                </Text>
                <Text tt="capitalize" className="!text-secondary-text">
                  {game.uniqueID}
                </Text>
              </Flex>
            ))}

            {!transaction.games.length && (
              <Flex
                justify={"center"}
                className="!cursor-pointer"
                mt={"sm"}
                gap={10}
              >
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
          onClick={onClose}
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
