import { ActionIcon, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { format } from "date-fns";
import type { RaffleTransaction } from "./TransactionList";
import { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
type TransactionTableProps = {
  transactions: RaffleTransaction[];
  isLoading: boolean;
};

export default function TransactionTable({
  isLoading,
  transactions,
}: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<RaffleTransaction | null>(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  function showTransaction(transaction: RaffleTransaction) {
    setSelectedTransaction(transaction);
    setTransactionModalOpen(true);
  }

  return (
    <>
      <DynamicTableSection
        headers={[
          { label: "Customer Name & ID", key: "customer" },
          { label: "Transaction ID", key: "transaction" },
          { label: "Purchase Source", key: "platform" },
          { label: "No. of Games", key: "count" },
          { label: "Amount Paid & Ticket No", key: "amount" },
          { label: "Payment Method", key: "method" },
          { label: "Payment Status", key: "status" },
          { label: "", key: "action" },
        ]}
        data={transactions}
        loading={isLoading}
        emptyMessage="No transactions found"
        renderItems={(transaction: RaffleTransaction) => {
          return [
            <>
              <Text className="!text-base !font-medium">
                {transaction.customer?.firstname}{" "}
                {transaction.customer?.lastname}
              </Text>
              <Text className="!text-secondary-text !text-sm">
                {transaction.customer?.uniqueID}
              </Text>
            </>,
            <>
              <Text className="!text-base !font-medium !text-nowrap">
                {transaction.uniqueID || '-'}
              </Text>
              <Text className="!text-secondary-text !text-sm">
                {transaction.created_at
                  ? format(new Date(transaction.created_at), "MMMM d, yyyy")
                  : ""}
              </Text>
            </>,

            <>
              <Text className="!text-base !font-medium !capitalize">
                {transaction.platform}
              </Text>
            </>,
            <>
              <Text className="!text-base !font-medium">
                {transaction.order_details_count}
              </Text>
            </>,
            <>
              <Text className="!text-base !font-medium">
                {formatCurrency(transaction.paid_amount)}
              </Text>
              <Text className="!text-secondary-text !text-sm">
                {transaction.reference}
              </Text>
            </>,

            <>
              <Text className="!text-base !font-medium !capitalize">
                {transaction.payment_method}
              </Text>
              <Text className="!text-secondary-text !text-sm !capitalize">
                {transaction.payment_channel}
              </Text>
            </>,
            <p
              className={`py-[2px] px-2 rounded-xl inline-block font-medium !capitalize ${
                transaction.payment_status?.toLowerCase() === "successful"
                  ? "bg-[#CCFBEF] text-[#06B280]" // green
                  : transaction.payment_status?.toLowerCase() === "pending"
                    ? "bg-[#FEF9C3] text-[#B45309]" // yellow
                    : "bg-[#FEF3F2] text-[#B42318]" // red (failed/others)
              }`}
            >
              {transaction.payment_status}
            </p>,
            <ActionIcon
              onClick={() => showTransaction(transaction)}
              size={35}
              className="!bg-[#FFD5D6] !text-primary-red !text-xl"
            >
              <GoArrowUpRight />
            </ActionIcon>,
          ];
        }}
      />
      <TransactionDetails
        opened={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
}
