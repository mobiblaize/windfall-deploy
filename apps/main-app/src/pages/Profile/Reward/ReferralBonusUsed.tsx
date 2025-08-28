import { Table, Text } from "@mantine/core";
import TableContainer from "../../../components/TableContainer";

export default function ReferralBonusUsed() {
  const transactions = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      {/* Table for larger screens */}
      <div className="!hidden sm:!block">
        <TableContainer
          headers={[
            "Transaction ID",
            "Transaction date & time",
            "Transaction Value",
            "Game Applicable",
            "Transaction status",
          ]}
        >
          {transactions.map((x) => {
            const active = x % 2;
            return (
              <Table.Tr key={x}>
                <Table.Td className="text-secondary-text !text-base">
                  4HYE74793FS
                </Table.Td>
                <Table.Td>
                  <Text className="!text-base !font-medium">
                    April 11, 2005
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    11:00am
                  </Text>
                </Table.Td>
                <Table.Td>₦ 10,000</Table.Td>
                <Table.Td>
                  <Text className="!text-base">Lekki House Raffle</Text>
                </Table.Td>
                <Table.Td>
                  <p
                    className={`py-[2px] px-2 rounded-xl inline-block font-medium ${
                      active
                        ? "bg-[#CCFBEF] text-[#06B280]"
                        : "bg-[#FEF3F2] text-[#B42318]"
                    }`}
                  >
                    {active ? "Successful" : "Failed"}
                  </p>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </TableContainer>
      </div>

      {/* Card view for small screens */}
      <div className="sm:!hidden space-y-4 p-4">
        {transactions.map((x) => {
          const active = x % 2;
          return (
            <div
              key={x}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <p>
                <strong>Transaction ID:</strong> 4HYE74793FS
              </p>
              <p>
                <strong>Date:</strong> April 11, 2005 — 11:00am
              </p>
              <p>
                <strong>Transaction Value:</strong> ₦ 10,000
              </p>
              <p>
                <strong>Game Applicable:</strong> Lekki House Raffle
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`py-[2px] px-2 rounded-xl inline-block font-medium ${
                    active
                      ? "bg-[#CCFBEF] text-[#06B280]"
                      : "bg-[#FEF3F2] text-[#B42318]"
                  }`}
                >
                  {active ? "Successful" : "Failed"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
