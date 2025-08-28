import {
  Select,
  Divider,
  Group,
  Box,
  Flex,
  Text,
  Button,
  TextInput,
  ActionIcon,
  Table,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import TableContainer from "../../components/TableContainer";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine } from "react-icons/ri";

function TransactionsTab() {
  const navigate = useNavigate();
  const transactions = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      <MyGameHeader
        title="My Transaction"
        description="Manage your transaction with ease today."
      >
        <Select
          data={[""]}
          placeholder="Date: all time"
          rightSection={<FaAngleDown />}
          className="w-[180px]"
        />
      </MyGameHeader>
      <Divider />

      <section className="mx-4 sm:mx-10 my-10">
        <Box className="border !border-secondary-text/50 rounded-xl bg-white">
          <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
            <div>
              <Text fz={20} fw="bold">
                Game Transaction List
              </Text>
              <Text className="!text-secondary-text">
                Track and manage transaction with ease.
              </Text>
            </div>
            <Button
              variant="outline"
              className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
              rightSection={<HiDocumentArrowDown />}
            >
              Export
            </Button>
          </Flex>

          <Divider mt="md" mb="lg" />

          <Flex
            justify="space-between"
            px="md"
            mb="lg"
            wrap="wrap"
            gap={8}
            align="center"
          >
            <TextInput
              leftSection={<HiSearch />}
              placeholder="Search"
              className="!w-72 !rounded-xl shadow-md"
            />
            <Group>
              <Select
                rightSection={<IoFilterOutline />}
                placeholder="sort by: show all"
                className="!shadow-md"
              />
              <Select
                rightSection={<IoFilterOutline />}
                placeholder="filter by: show all"
                className="!shadow-md"
              />
            </Group>
          </Flex>

          {/* Table for larger screens */}
          <div className="!hidden sm:!block">
            <TableContainer
              headers={[
                "Transaction ID",
                "Transaction date & time",
                "Transaction value",
                "Payment channel",
                "Transaction status",
                "Receipt",
              ]}
            >
              {transactions.map((x) => {
                const active = x % 2;
                return (
                  <Table.Tr key={x}>
                    <Table.Td className="text-secondary-text !pr-0 !text-base">
                      4HYE74793FS
                    </Table.Td>
                    <Table.Td>
                      <Text className="!text-base !font-medium">
                        April 11, 2005
                      </Text>
                      <Text className="!text-secondary-text !pr-0 !text-sm">
                        11:00am
                      </Text>
                    </Table.Td>
                    <Table.Td className="!pr-0">₦ 10,000</Table.Td>
                    <Table.Td className="!pr-0">
                      <Text className="!text-base">Paystack</Text>
                    </Table.Td>
                    <Table.Td className="!pr-0">
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
                    <Table.Td>
                      <ActionIcon
                        onClick={() => navigate("1")}
                        size={35}
                        className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                      >
                        <RiArrowRightUpLine />
                      </ActionIcon>
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
                    <strong>Value:</strong> ₦ 10,000
                  </p>
                  <p>
                    <strong>Channel:</strong> Paystack
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
                  <ActionIcon
                    onClick={() => navigate("1")}
                    size={35}
                    className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                  >
                    <RiArrowRightUpLine />
                  </ActionIcon>
                </div>
              );
            })}
          </div>

          <Flex my="md" justify="space-between" gap={2} wrap="wrap" px="lg" align="center">
            <Text>Page 1 of 10</Text>
            <Group>
              <Button
                variant="outline"
                className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
              >
                Next
              </Button>
            </Group>
          </Flex>
        </Box>
      </section>
    </div>
  );
}

export default TransactionsTab;
