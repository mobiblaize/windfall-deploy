import { ActionIcon, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { useState } from "react";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import type { Customer } from "./GameCustomers";
import CustomerModal from "./CustomerModal";
type CustomerTableProps = {
  customers: Customer[];
  isLoading: boolean;
};

export default function CustomerTable({
  isLoading,
  customers,
}: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  function showCustomer(transaction: Customer) {
    setSelectedCustomer(transaction);
    setTransactionModalOpen(true);
  }

  return (
    <>
      <DynamicTableSection
        headers={[
          { label: "Customer Name & ID", key: "customer" },
          { label: "Location (L.G.A)", key: "transaction" },
          { label: "Phone", key: "phone" },
          { label: "Registration Platform", key: "platform" },
          { label: "Total No. of Games Played", key: "games" },
          { label: "Total Amount Spent", key: "amount" },
          { label: "", key: "action" },
        ]}
        data={customers}
        loading={isLoading}
        emptyMessage="No transactions found"
        renderItems={(customer: Customer) => {
          return [
            <>
              <Text className="!text-base !font-medium">
                {customer.customer_name}
              </Text>
              <Text className="!text-secondary-text !text-sm">
                {customer.uniqueID}
              </Text>
            </>,
            <Text className="!text-base !font-medium">
              {customer.location || "-"}
            </Text>,

            <Text className="!text-base !font-medium !capitalize">
              {customer.phone || "-"}
            </Text>,

            <Text className="!text-base !font-medium !capitalize">
              {customer.platform || "-"}
            </Text>,
            <Text className="!text-secondary-text">
              {customer.number_of_games_played}
            </Text>,
            <Text className="!text-base !font-medium">
              {formatCurrency(customer.total_amount_spent)}
            </Text>,
            <ActionIcon
              onClick={() => showCustomer(customer)}
              size={35}
              className="!bg-[#FFD5D6] !text-primary-red !text-xl"
            >
              <GoArrowUpRight />
            </ActionIcon>,
          ];
        }}
      />
      <CustomerModal
        opened={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        customer={selectedCustomer}
      />
    </>
  );
}
