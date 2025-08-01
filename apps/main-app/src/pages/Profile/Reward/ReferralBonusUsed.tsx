import { Flex, Image, Table, Text } from "@mantine/core";
import TableContainer from "../../../components/TableContainer";
import visaIcon from "../../../assets/visa-icon.png";

export default function ReferralBonusUsed() {
  return (
    
          <TableContainer
            headers={[
              "Transaction ID",
              "Transaction date & time",
              "Paid Via",
              "Transaction Value",
              "Game Applicable",
              "Transaction status",
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
                    <Flex align={"center"} gap={10}>
                      <Image src={visaIcon} h={32} w={36} />
                      <Text className="!text-secondary-text !text-base">
                        ** 3904
                      </Text>
                    </Flex>
                  </Table.Td>
                  <Table.Td>₦ 10,000</Table.Td>
                  <Table.Td>
                    <Text className="!text-base">Lekki House Raffle</Text>
                  </Table.Td>
                  <Table.Td>
                    <p
                      className={`py-[2px] px-2 rounded-xl inline-block font-medium ${active ? "bg-[#CCFBEF] text-[#06B280]" : "bg-[#FEF3F2] text-[#B42318]"}`}
                    >
                      {active ? "Successful" : "Failed"}
                    </p>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </TableContainer>
  );
}
