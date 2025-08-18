import { Table, Text } from "@mantine/core";
import TableContainer from "../../../components/TableContainer";

export default function ReferralBonusEarned() {
  const referrals = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      {/* Table for larger screens */}
      <div className="!hidden sm:!block">
        <TableContainer
          headers={[
            "Transaction ID",
            "Transaction date & time",
            "User Referred",
            "Referee Sign Up status",
            "Bonus Earned",
          ]}
        >
          {referrals.map((x) => {
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
                <Table.Td>
                  <Text className="!text-base !font-medium">Mobi Blaize</Text>
                  <Text className="!text-secondary-text !text-sm">
                    ID: 9044
                  </Text>
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
                <Table.Td>₦ 10,000</Table.Td>
              </Table.Tr>
            );
          })}
        </TableContainer>
      </div>

      {/* Card view for small screens */}
      <div className="sm:!hidden space-y-4 p-4">
        {referrals.map((x) => {
          const active = x % 2;
          return (
            <div
              key={x}
              className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <p>
                <strong>Transaction ID:</strong> 4HYE74793FS
              </p>
              <p>
                <strong>Date:</strong> April 11, 2005 — 11:00am
              </p>
              <p>
                <strong>User Referred:</strong> Mobi Blaize (ID: 9044)
              </p>
              <p>
                <strong>Sign Up Status:</strong>{" "}
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
              <p>
                <strong>Bonus Earned:</strong> ₦ 10,000
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
