import { Table, Text } from "@mantine/core";
import TableContainer from "../../../components/TableContainer";

export default function ReferralBonusEarned() {
  return (
    
          <TableContainer
            headers={[
              "Transaction ID",
              "Transaction date & time",
              "User Referred",
              "Referee Sign Up status",
              "Bonus Earned",
            ]}
          >
            {[1, 2, 3, 4, 5, 6].map((x) => {
              const active = x % 2;
              return (
                <Table.Tr>
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
                    <Text className="!text-base !font-medium">
                      Mobi Blaize
                    </Text>
                    <Text className="!text-secondary-text !text-sm">
                      ID: 9044
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <p
                      className={`py-[2px] px-2 rounded-xl inline-block font-medium ${active ? "bg-[#CCFBEF] text-[#06B280]" : "bg-[#FEF3F2] text-[#B42318]"}`}
                    >
                      {active ? "Successful" : "Failed"}
                    </p>
                  </Table.Td>
                  <Table.Td>₦ 10,000</Table.Td>
                </Table.Tr>
              );
            })}
          </TableContainer>
  );
}
