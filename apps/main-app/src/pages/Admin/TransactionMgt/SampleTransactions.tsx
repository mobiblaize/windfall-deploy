import { Card, Flex, Box, Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { GoArrowUpRight } from "react-icons/go";
import TransactionTable from "./TransactionTable";
import type { RaffleTransaction } from "./TransactionList";

export default function SampleTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `admin/transaction-management/all-transactions?paginate=1&limit=10`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed To Fetch Transactions",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setTransactions(response.data?.records?.data);
    }
  }, [error, isError, response]);

  return (
    <div className="!text-primary-text mb-5 px-6 md:px-10">
      <Card withBorder radius={"md"} px={0} my="xl">
        <Flex
          justify={"space-between"}
          px="md"
          gap={"sm"}
          mb={"md"}
          direction={{ base: "column", xs: "row" }}
        >
          <Box>
            <Text tt="capitalize" fz={"lg"} fw={600}>
              Transaction List
            </Text>
            <Text className="!text-secondary-text !text-xs !capitalize">
              Show customer transaction for game
            </Text>
          </Box>
          <Group>
            <Button
              className="!border-[#D0D5DD] !text-secondary-text !capitalize"
              size="md"
              radius={"lg"}
              variant="outline"
              rightSection={
                <div className="!inline-flex p-1 w-fit rounded-md">
                  <GoArrowUpRight className="!text-secondary-text" />
                </div>
              }
              onClick={() => navigate("all")}
            >
              view all transactions
            </Button>
          </Group>
        </Flex>

        <TransactionTable isLoading={isLoading} transactions={transactions} />
      </Card>
    </div>
  );
}
