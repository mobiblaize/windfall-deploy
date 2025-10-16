import {
  Box,
  Card,
  Divider,
  Flex,
  Text,
  Button,
  Select,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import Salestabs from "./Salestabs";
import { useEffect, useState } from "react";
import type { Raffle } from "./RaffleList";
import { useFetchData, useGetData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import RaffleOverviewCard from "./RaffleOverviewCard";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import TicketPerformanceCard from "./TicketPerformanceCard";

export interface TicketSalesStats {
  total_tickets_sold: number;
  tickets_last_period_value: number;
  tickets_last_period: string;
  total_customers: number;
  customer_growth_percentage: number;
  new_customers_last_period_value: number;
  new_customers_last_period: string;
  new_customer_growth_period_value: number;
  new_customers_growth_period: string;
  highest_grossing_platform: HighestGrossingPlatform;
}

export interface HighestGrossingPlatform {
  highest_grossing: HighestGrossing[];
  platform_breakdown: PlatformBreakdown[];
  total_transaction_value: number;
  last_30_days_total_transaction_value: number;
  last_30_days_platform_breakdown: Last30DaysPlatformBreakdown[];
}

export interface HighestGrossing {
  type: string;
  name: string;
  total_revenue: number;
  tickets_sold: number;
}

export interface PlatformBreakdown {
  platform: string;
  total_revenue: number;
  tickets_sold: number;
  days_count: number;
}

export interface Last30DaysPlatformBreakdown {
  platform: string;
  total_revenue: number;
  tickets_sold: number;
}

export interface GameCategory {
  uuid: string;
  name: string;
  uniqueID: string;
  description: string;
  is_active: string;
  is_default: string;
  updated_by: string;
  created_at: string;
  games_count: number;
}

export interface TicketPerformance {
  highest_sold_ticket: HighestSoldTicket;
  all_tickets_stats: AllTicketsStat[];
}

export interface HighestSoldTicket {
  ticket_tier: string;
  ticket_count: number;
  total_revenue: string;
  percentage_increase_30_days: number;
  tickets_last_30_days: number;
}

export interface AllTicketsStat {
  ticket_tier: string;
  ticket_count: number;
  total_revenue: string;
  tickets_last_days: string;
  revenue_last_days: string;
  days_count: number;
}

export interface TicketStats {
  date: string;
  total: number;
}

function PerformanceMonitor() {
  const navigate = useNavigate();
  const [ticketSalesStats, setTicketSalesStats] = useState<TicketSalesStats>();
  const [ticketStats, setTicketStats] = useState<TicketStats[]>([]);
  const [ticketPerformance, setTicketPerformance] =
    useState<TicketPerformance>();
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

  const ticketSalesMutation = useGetData(
    `admin/game-management/dashboard/ticket-sales-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`
  );
  const ticketStatsMutation = useGetData(
    `admin/game-management/dashboard/ticket-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`
  );

  const ticketPerformanceMutation = useGetData(
    `admin/game-management/dashboard/ticket-performance-stats?game_id=${raffleId}&start_date=${startDate}&end_date=${endDate}`
  );

  const raffles: Raffle[] = rafflesResponse?.data;
  const rafflesData = (() => {
    if (!raffles) return [];
    return raffles?.map((item) => ({
      value: item.uuid,
      label: item.name,
    }));
  })();
  console.log(raffles);

  const categories: GameCategory[] | undefined =
    categoriesResponse?.data?.records;
  const categoriesData = (() => {
    if (!categories) return [];
    return categories?.map((item) => ({
      value: item.uuid,
      label: item.name,
    }));
  })();
  console.log(categories);

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

  async function getTicketSalesStats() {
    try {
      const response = await ticketSalesMutation.mutateAsync();
      setTicketSalesStats(response.data);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch performance stats",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function getTicketStats() {
    try {
      const response = await ticketStatsMutation.mutateAsync();
      setTicketStats(response.data);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch performance stats",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function getTicketPerformance() {
    try {
      const response = await ticketPerformanceMutation.mutateAsync();
      setTicketPerformance(response.data);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch performance stats",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  useEffect(() => {
    getTicketSalesStats();
    getTicketStats();
    getTicketPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleId, categoryId, startDate, endDate]);

  return (
    <Box className="!text-primary-text !px-6 md:!px-10 !pb-10 !mt-10">
      <Card withBorder radius={"md"}>
        <Flex
          align={{ base: "start", md: "center" }}
          justify={{ base: "start", sm: "space-between" }}
          gap={{ base: "sm", sm: "lg" }}
          direction={{ base: "column", md: "row" }}
        >
          <Box>
            <Text
              fz={"lg"}
              fw={600}
              tt={"capitalize"}
              className="!text-primary-green"
            >
              Live games:{" "}
              <span className="text-primary-text">performance monitor</span>
            </Text>
          </Box>
          <Flex gap={{ base: "sm", sm: "md" }}>
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
        <Divider my="lg" />
        <Flex
          justify={{ base: "start", xs: "space-between" }}
          direction={{ base: "column", xs: "row" }}
          gap={{ base: "md" }}
        >
          <Box>
            <Text
              tt={"capitalize"}
              fz={"lg"}
              fw={"600"}
              className="!text-primary-red"
            >
              raffle overview
            </Text>
            <Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
              an overview of the live draw financial performance
            </Text>
          </Box>
          {raffleId && (
            <Button
              tt={"capitalize"}
              rightSection={<RiArrowRightUpLine size={16} />}
              onClick={() => navigate(`/admin/raffles/list/${raffleId}`)}
            >
              raffle details
            </Button>
          )}
        </Flex>
        <RaffleOverviewCard
          loading={ticketSalesMutation.isPending}
          ticketSalesStats={ticketSalesStats}
        />
        <Box my={"xl"}>
          <Text
            tt={"capitalize"}
            fz={"lg"}
            fw={"600"}
            className="!text-primary-red"
          >
            ticket performance overview
          </Text>
          <Text
            tt={"capitalize"}
            fz={"sm"}
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            Comparison analyses of ticket sales across tiers and
            categories.{" "}
          </Text>
        </Box>
        <Card withBorder radius={"md"}>
          {/* <Box>
            <Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
              Total Number of Ticket Sold
            </Text>
            <Text className="!text-primary-green" fw={600} fz={28}>
              5,000
            </Text>
            <Flex gap={2} align={"center"}>
              <AiFillExclamationCircle className="text-secondary-text" />
              <Text
                className="!text-secondary-text"
                tt={"capitalize"}
                fz={"sm"}
                mt={4}
              >
                + 20.4 % increase over the last 3 day
              </Text>
            </Flex>
            <Flex gap={2} align={"center"}>
              <AiFillExclamationCircle className="text-secondary-text" />
              <Text
                className="!text-secondary-text"
                tt={"capitalize"}
                fz={"sm"}
                mt={4}
              >
                ₦ 20,000,000 in Total ticket revenue
              </Text>
            </Flex>
          </Box> */}
          <TicketPerformanceCard loading={ticketPerformanceMutation.isPending} ticketPerformance={ticketPerformance} />
        </Card>
        <Box my={"lg"}>
          <Text
            tt={"capitalize"}
            fz={"lg"}
            fw={"600"}
            className="!text-primary-red"
          >
            Ticket sales distribution
          </Text>
          <Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
            Distribution of Purchase by Channels
          </Text>
          <Divider my="lg" />
        </Box>
        <Salestabs
          salesStats={ticketSalesStats}
          ticketStats={ticketStats}
          loading={ticketSalesMutation.isPending}
        />
      </Card>
    </Box>
  );
}

export default PerformanceMonitor;
