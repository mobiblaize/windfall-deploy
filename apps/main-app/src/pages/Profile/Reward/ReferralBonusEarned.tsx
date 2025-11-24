import { Table, Text } from "@mantine/core";
import TableContainer from "../../../components/TableContainer";
import type { ReferralTransaction } from "./RewardTab";
import { format } from "date-fns";
import { formatCurrency } from "../../../utils/helper/formatCurrency";

export default function ReferralBonusEarned({
  transactions,
}: {
  transactions: ReferralTransaction[];
}) {
  return (
    <div>
      {/* Table for larger screens */}
      <div className="!hidden sm:!block">
        <TableContainer
          headers={[
            "Transaction ID",
            "Transaction date & time",
            "User Referred",
            "Bonus Earned",
          ]}
        >
          {transactions.map((transaction) => {
            return (
              <Table.Tr key={transaction.order?.uuid}>
                <Table.Td className="text-secondary-text !text-base">
                  {transaction.order?.uniqueID}
                </Table.Td>
                <Table.Td>
                  <Text className="!text-base !font-medium">
                    {transaction.date
                      ? format(new Date(transaction.date), "MMMM d, yyyy")
                      : ""}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {transaction.date
                      ? format(new Date(transaction.date), "h:mm a")
                      : ""}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text className="!text-base !font-medium">{transaction.referred_user.firstname} {transaction.referred_user.lastname}</Text>
                  <Text className="!text-secondary-text !text-sm">
                    ID: {transaction.referred_user.uuid}
                  </Text>
                </Table.Td>
                <Table.Td>{formatCurrency(transaction.amount)}</Table.Td>
              </Table.Tr>
            );
          })}
        </TableContainer>
      </div>

      {/* Card view for small screens */}
      <div className="sm:!hidden space-y-4 p-4">
        {transactions.map((transaction) => {
          return (
            <div
               key={transaction.order?.uuid}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <p>
                <strong>Transaction ID:</strong> {transaction.order?.uniqueID}
              </p>
              <p>
                <strong>Date:</strong> {transaction.date
                      ? format(new Date(transaction.date), "MMMM d, yyyy")
                      : ""} — {transaction.date
                      ? format(new Date(transaction.date), "h:mm a")
                      : ""}
              </p>
              <p>
                <strong>User Referred:</strong> {transaction.referred_user.firstname} {transaction.referred_user.lastname} (ID: {transaction.referred_user.uuid})
              </p>
              <p>
                <strong>Bonus Earned:</strong> {formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
