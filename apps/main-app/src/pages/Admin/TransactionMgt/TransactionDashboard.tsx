import {
  Card,
  Divider,
  Flex,
  Text,
  Box,
  SimpleGrid,
  Select,
} from "@mantine/core";
import { useFetchData } from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import { AiFillExclamationCircle } from "react-icons/ai";
import TransactionTrendGraph from "./TransactionTrendGraph";
import SampleTransactions from "./SampleTransactions";
import type { GameCategory } from "../GameMgt/PerformanceMonitor";
import type { Raffle } from "../GameMgt/RaffleList";
import { FaAngleDown } from "react-icons/fa";
import RenderSkeletonText from "../../../components/RenderSkeletonText";

export interface TransactionStats {
  total_transaction_value: string;
  total_transaction_volume: number;
  value_change_percentage: number;
  value_change_amount: number;
  volume_change_percentage: number;
  volume_change_amount: number;
  web_transactions: WebTransactions;
  mobile_transactions: MobileTransactions;
  comparison_period: number;
}

export interface WebTransactions {
  successful: Successful;
}

export interface Successful {
  volume: number;
  value: string;
}

export interface MobileTransactions {
  successful: Successful2;
}

export interface Successful2 {
  volume: number;
  value: string;
}

export interface PlatformTransactionStats {
  web_transactions: WebTransactions;
  mobile_transactions: MobileTransactions;
  monthly_counts?: Record<string, MonthlyTransactionCount>;
}

export interface MonthlyTransactionCount {
  web_transactions: number;
  mobile_transactions: number;
}

export interface N202503 {
  web_transactions: number;
  mobile_transactions: number;
}

export interface WebTransactions {
  successful: Successful;
}

export interface Successful {
  volume: number;
  value: string;
}

export interface MobileTransactions {
  successful: Successful2;
}

export interface Successful2 {
  volume: number;
  value: string;
}

function TransactionDashboard() {
  const [raffleId, setRaffleId] = useState<string | null>("");
  const [categoryId, setCategoryId] = useState<string | null>("");
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const {
    data: rafflesResponse,
    isError: isErrorRaffles,
    error: rafflesError,
  } = useFetchData(
    `admin/game-management/game-list/all?paginate=0&limit=10&page=1`
  );
  const {
    data: categoriesResponse,
    isError: isErrorCategories,
    error: categoriesError,
  } = useFetchData(
    `admin/game-management/category/all?paginate=0&limit=10&page=1`
  );
  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(
    `admin/transaction-management/transaction-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`
  );
  const {
    data: pltfResponse,
    isLoading: isLoadingPltf,
    isError: isErrorPltf,
    error: pltfError,
  } = useFetchData(
    `admin/transaction-management/platform-transaction-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`
  );

  const raffles: Raffle[] = rafflesResponse?.data;
  const rafflesData = (() => {
    if (!raffles) return [{ value: "", label: "Game: All" }];

    return [
      { value: "", label: "Game: All" },
      ...raffles.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  const categories: GameCategory[] | undefined =
    categoriesResponse?.data?.records;

  const categoriesData = (() => {
    if (!categories) return [{ value: "", label: "Game Category: All" }];

    return [
      { value: "", label: "Game Category: All" }, // 👈 empty option first
      ...categories.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  useEffect(() => {
    if (isErrorCategories) {
      notifications.show({
        title: "Failed to fetch raffle categories",
        message:
          (categoriesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isErrorCategories, categoriesError]);

  useEffect(() => {
    if (isErrorRaffles) {
      notifications.show({
        title: "Failed to fetch raffles",
        message:
          (rafflesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isErrorRaffles, rafflesError]);

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to Load Transactions Stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  const transactionStats: TransactionStats = statsResponse?.data;

  useEffect(() => {
    if (isErrorPltf) {
      notifications.show({
        title: "Failed to Load Platform Stats",
        message:
          (pltfError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [pltfError, isErrorPltf]);

  const platformStats: PlatformTransactionStats = pltfResponse?.data;
  return (
    <>
      <div className="text-primary-text px-6 md:px-10">
        <Card withBorder mt={"xl"} radius={"md"} py={24} mb={"md"}>
          <Flex
            justify={{ base: "start", xs: "space-between" }}
            align={{ base: "start", xs: "center" }}
            direction={{ base: "column", xs: "row" }}
            gap={"md"}
          >
            <div>
              <Text tt={"capitalize"} fz={"lg"} fw={600}>
                Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An overview of transaction on system
              </Text>
            </div>
            <Flex
              justify="flex-end"
              px="md"
              mb="lg"
              wrap="wrap"
              gap={8}
              align="center"
            >
              <Select
                value={categoryId}
                onChange={setCategoryId}
                rightSection={<FaAngleDown />}
                placeholder="Game Category: "
                data={categoriesData}
                className="!shadow-md"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
              <Select
                value={raffleId}
                onChange={setRaffleId}
                rightSection={<FaAngleDown />}
                placeholder="Game: "
                data={rafflesData}
                className="!shadow-md"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
              <DateInput
                placeholder="Start Date"
                withAsterisk
                valueFormat="DD/MM/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e)}
                classNames={{
                  label: "!capitalize",
                }}
                popoverProps={{
                  classNames: {
                    dropdown: "!text-primary-text",
                  },
                }}
                rightSection={
                  startDate ? (
                    <IoClose
                      className="cursor-pointer text-gray-500 hover:text-red-500"
                      onClick={() => setStartDate("")}
                    />
                  ) : (
                    <CiCalendar />
                  )
                }
              />

              <DateInput
                placeholder="End Date"
                withAsterisk
                rightSection={
                  endDate ? (
                    <IoClose
                      className="cursor-pointer text-gray-500 hover:text-red-500"
                      onClick={() => setEndDate("")}
                    />
                  ) : (
                    <CiCalendar />
                  )
                }
                valueFormat="DD/MM/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e)}
                classNames={{
                  label: "!capitalize",
                }}
                popoverProps={{
                  classNames: {
                    dropdown: "!text-primary-text",
                  },
                }}
              />
            </Flex>
          </Flex>
          <Divider my="md" />

          <Box mt={"md"} mb={"sm"}>
            {isLoadingStats ? (
              <Box className="space-y-4">
                <RenderSkeletonText height={10} width="50%" />
                <RenderSkeletonText className="!mb-7" height={24} width="30%" />
                <RenderSkeletonText height={10} width="50%" />
                <RenderSkeletonText height={10} width="50%" />
                <RenderSkeletonText height={10} width="50%" />
              </Box>
            ) : isErrorStats || !transactionStats ? (
              <Flex align="center" gap={8}>
                <AiFillExclamationCircle className="text-red-500 text-lg" />
                <Text c="dimmed" fz="sm">
                  Failed to load transaction stats. Please try again later.
                </Text>
              </Flex>
            ) : (
              <>
                <Text
                  tt={"capitalize"}
                  fz={"sm"}
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Total Transaction Value <PiQuestionThin />
                </Text>

                <Text className="!text-primary-green" fz={32} fw={600} mb="xs">
                  {formatCurrency(transactionStats?.total_transaction_value)}
                </Text>

                <Text
                  tt="capitalize"
                  fz="sm"
                  fw={500}
                  className="!text-secondary-text !item-center !flex !gap-2"
                  mb={5}
                >
                  <AiFillExclamationCircle />
                  <span className="!text-primary-green !font-semibold">
                    {transactionStats.value_change_percentage?.toFixed(2)}%
                  </span>{" "}
                  increase over the last{" "}
                  {transactionStats?.comparison_period?.toLocaleString()} days
                </Text>

                <Text
                  tt="capitalize"
                  fz="sm"
                  fw={500}
                  className="!text-secondary-text !item-center !flex !gap-2"
                  mb={5}
                >
                  <AiFillExclamationCircle />
                  Total number of transactions is at{" "}
                  <span className="!text-primary-green !font-semibold">
                    {transactionStats.volume_change_amount?.toLocaleString()}
                  </span>
                </Text>

                <Text
                  tt="capitalize"
                  fz="sm"
                  fw={500}
                  className="!text-secondary-text !item-center !flex !gap-2"
                  mb={5}
                >
                  <AiFillExclamationCircle />
                  Number of transactions increased by{" "}
                  <span className="!text-primary-green !font-semibold">
                    {transactionStats.volume_change_percentage?.toFixed(2)}%
                  </span>{" "}
                  in the last {transactionStats.comparison_period} days.
                </Text>
              </>
            )}
          </Box>

          <Divider my="md" />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <SimpleGrid cols={{ base: 1 }} spacing="lg">
              <Box className="!border-b !border-[#EBEAEF] pb-3">
                <Text className="!text-primary-red" mb={"md"} fw={"bold"}>
                  Web Site Transaction
                </Text>
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Total Number of transactions.
                </Text>

                {isLoadingPltf ? (
                  <Box className="space-y-2">
                    <RenderSkeletonText height={20} width="20%" />
                  </Box>
                ) : pltfError ? (
                  <Text c="dimmed" fz="sm">
                    No platform sales data available.
                  </Text>
                ) : (
                  <>
                    <Text fw={700} fz="xl">
                      {platformStats.web_transactions.successful.volume.toLocaleString()}
                    </Text>
                  </>
                )}
              </Box>

              <Box className="!border-b !border-[#EBEAEF] pb-3 mantine-sm:!border-b-0">
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Transaction Value
                </Text>

                {isLoadingPltf ? (
                  <Box className="space-y-2">
                    <RenderSkeletonText height={20} width="20%" />
                  </Box>
                ) : pltfError ? (
                  <Text c="dimmed" fz="sm">
                    No platform sales data available.
                  </Text>
                ) : (
                  <>
                    <Text fw={700} fz="xl">
                      {formatCurrency(
                        platformStats.web_transactions.successful.value
                      )}
                    </Text>
                  </>
                )}
              </Box>
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1 }} spacing="lg">
              <Box className="!border-b !border-[#EBEAEF] pb-3">
                <Text className="!text-primary-red" mb={"md"} fw={"bold"}>
                  Mobile App Transaction
                </Text>
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Total Number of transactions.
                </Text>

                {isLoadingPltf ? (
                  <Box className="space-y-2">
                    <RenderSkeletonText height={20} width="20%" />
                  </Box>
                ) : pltfError ? (
                  <Text c="dimmed" fz="sm">
                    No platform sales data available.
                  </Text>
                ) : (
                  <>
                    <Text fw={700} fz="xl">
                      {platformStats.mobile_transactions.successful.volume.toLocaleString()}
                    </Text>
                  </>
                )}
              </Box>

              <Box className="pb-3">
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Transaction Value
                </Text>

                {isLoadingPltf ? (
                  <Box className="space-y-2">
                    <RenderSkeletonText height={20} width="20%" />
                  </Box>
                ) : pltfError ? (
                  <Text c="dimmed" fz="sm">
                    No platform sales data available.
                  </Text>
                ) : (
                  <>
                    <Text fw={700} fz="xl">
                      {formatCurrency(platformStats.mobile_transactions.successful.value)}
                    </Text>
                  </>
                )}
              </Box>
            </SimpleGrid>
          </SimpleGrid>

          <Divider my="md" />

          {/* Graph Goes Here */}
          {platformStats?.monthly_counts && <TransactionTrendGraph graphData={platformStats.monthly_counts} />}
        </Card>
      </div>

      <div className="pb-10">
        <SampleTransactions />
      </div>
    </>
  );
}

export default TransactionDashboard;
