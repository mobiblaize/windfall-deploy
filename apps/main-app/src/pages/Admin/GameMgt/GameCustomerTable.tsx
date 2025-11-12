import { ActionIcon, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import { useNavigate } from "react-router-dom";
import type { GameCustomer } from "./CustomerList";

type CustomerTableProps = {
  customers: GameCustomer[];
  isLoading: boolean;
};

export default function GameCustomerTable({
  isLoading,
  customers,
}: CustomerTableProps) {
  const navigate = useNavigate();

  function goToCustomerDetail(customer: GameCustomer) {
    navigate(`/admin/customers/${customer?.customer?.uuid}`);
  }

  return (
    <>
      <DynamicTableSection
        headers={[
          { label: "Customer Name & ID", key: "customer" },
          { label: "Location (L.G.A)", key: "location" },
          { label: "Phone", key: "phone" },
          { label: "Registration Platform", key: "platform" },
          { label: "Total No. of Games Played", key: "games" },
          { label: "Total Amount Spent", key: "amount" },
          { label: "", key: "action" },
        ]}
        data={customers}
        loading={isLoading}
        emptyMessage="No customers found"
        renderItems={(customer: GameCustomer) => {
          return [
            <>
              <Text className="!text-base !font-medium">
                {customer.customer.firstname} {customer.customer.lastname}
              </Text>
              <Text className="!text-secondary-text !text-sm">
                {customer.customer.uniqueID}
              </Text>
            </>,
            <Text className="!text-base !font-medium">
              {customer.customer.lga || "-"}
            </Text>,

            <Text className="!text-base !font-medium !capitalize">
              {customer.customer.phone_number || "-"}
            </Text>,

            <Text className="!text-base !font-medium !capitalize">
              {customer.platform || "-"}
            </Text>,
            <Text className="!text-secondary-text">
              {Number(customer.ticket_count || 0)?.toLocaleString()}
            </Text>,
            <Text className="!text-base !font-medium">
              {formatCurrency(customer.total_amount_spent)}
            </Text>,
            <ActionIcon
              onClick={() => goToCustomerDetail(customer)}
              size={35}
              className="!bg-[#FFD5D6] !text-primary-red !text-xl"
            >
              <GoArrowUpRight />
            </ActionIcon>,
          ];
        }}
      />
    </>
  );
}
