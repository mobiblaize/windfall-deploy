import { Box, Card, Divider, Flex, Text, Button, Select } from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import Salestabs from "./Salestabs";
import { useEffect, useState, useMemo, useCallback } from "react";
import type { Raffle } from "./RaffleList";
import { useFetchData, useGetData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import RaffleOverviewCard from "./RaffleOverviewCard";
import { useNavigate, useLocation } from "react-router-dom";
import TicketPerformanceCard from "./TicketPerformanceCard";
import { DateRangePicker } from "../../../components/DateRangePicker";

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
  days_count: number;
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

interface PerformanceMonitorProps {
  raffleId?: string;
  startDate?: string;
  endDate?: string;
  isInstantRaffleRoute?: boolean;
}

function PerformanceMonitor({
  raffleId: propRaffleId,
  startDate: propStartDate = "",
  endDate: propEndDate = "",
  isInstantRaffleRoute = false,
}: PerformanceMonitorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketSalesStats, setTicketSalesStats] = useState<TicketSalesStats>();
  const [ticketStats, setTicketStats] = useState<TicketStats[]>([]);
  const [ticketPerformance, setTicketPerformance] =
    useState<TicketPerformance>();
  const [localRaffleId, setLocalRaffleId] = useState<string | null>("");
  const [categoryId, setCategoryId] = useState<string | null>("");
  const [localStartDate, setLocalStartDate] = useState<string | null>("");
  const [localEndDate, setLocalEndDate] = useState<string | null>("");

  // Use prop values if provided, otherwise use local state
  const raffleId = propRaffleId || localRaffleId;
  const startDate = propRaffleId ? propStartDate : localStartDate;
  const endDate = propRaffleId ? propEndDate : localEndDate;
  const isEmbedded = !!propRaffleId; // Check if component is embedded in parent with raffleId
  
  // Determine base route for relative navigation
  const baseRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles") ? "/admin/instant-raffles" : "/admin/raffles";
  }, [location.pathname]);

  // Build API URLs with instant_game param when needed
  const rafflesApiUrl = useMemo(() => {
    if (isEmbedded) return null;
    const baseUrl = `admin/game-management/game-list/all?paginate=0&limit=10&page=1`;
    if (isInstantRaffleRoute) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [isEmbedded, isInstantRaffleRoute]);

  // Only fetch raffles and categories if not embedded (no raffleId prop)
  const {
    data: rafflesResponse,
    isError: isErrorRaffles,
    error: rafflesError,
  } = useFetchData(rafflesApiUrl);
  const {
    data: categoriesResponse,
    isError: isErrorCategories,
    error: categoriesError,
  } = useFetchData(
    !isEmbedded
      ? `admin/game-management/category/all?paginate=0&limit=10&page=1`
      : null
  );

  // Build API URLs with instant_game param
  // Note: When raffleId is provided (embedded mode), we don't need instant_game param
  // because we're already filtering by a specific game ID
  const ticketSalesApiUrl = useMemo(() => {
    const baseUrl = `admin/game-management/dashboard/ticket-sales-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`;
    if (isInstantRaffleRoute && !raffleId) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [raffleId, categoryId, startDate, endDate, isInstantRaffleRoute]);

  const ticketStatsApiUrl = useMemo(() => {
    const baseUrl = `admin/game-management/dashboard/ticket-stats?game_id=${raffleId}&game_category_id=${categoryId}&start_date=${startDate}&end_date=${endDate}`;
    if (isInstantRaffleRoute && !raffleId) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [raffleId, categoryId, startDate, endDate, isInstantRaffleRoute]);

  const ticketPerformanceApiUrl = useMemo(() => {
    const baseUrl = `admin/game-management/dashboard/ticket-performance-stats?game_id=${raffleId}&start_date=${startDate}&end_date=${endDate}`;
    if (isInstantRaffleRoute && !raffleId) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [raffleId, startDate, endDate, isInstantRaffleRoute]);

  const ticketSalesMutation = useGetData(ticketSalesApiUrl);
  const ticketStatsMutation = useGetData(ticketStatsApiUrl);
  const ticketPerformanceMutation = useGetData(ticketPerformanceApiUrl);

  const raffles: Raffle[] = rafflesResponse?.data;
  const rafflesData = (() => {
    if (!raffles) return [];

    return [
      ...raffles.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  const categories: GameCategory[] | undefined =
    categoriesResponse?.data?.records;

  const categoriesData = (() => {
    if (!categories) return [{ value: "", label: "Game Category: All"  }];

    return [
      { value: "", label: "Game Category: All"  }, // 👈 empty option first
      ...categories.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  useEffect(() => {
    if (isErrorCategories && !isEmbedded) {
      notifications.show({
        title: "Failed to fetch raffle categories",
        message:
          (categoriesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isErrorCategories, categoriesError, isEmbedded]);

  useEffect(() => {
    if (isErrorRaffles && !isEmbedded) {
      notifications.show({
        title: "Failed to fetch raffles",
        message:
          (rafflesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    
    if (rafflesResponse && !isEmbedded) {
      setLocalRaffleId(rafflesResponse.data?.[0]?.uuid || "");
    }

  }, [isErrorRaffles, rafflesError, rafflesResponse, isEmbedded]);

  async function getTicketSalesStats() {
    if (!raffleId) return;
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

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setLocalStartDate(start);
    setLocalEndDate(end);
  }, []);

  useEffect(() => {
    getTicketSalesStats();
    getTicketStats();
    getTicketPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleId, categoryId, startDate, endDate]);

  return (
    <Box className="!text-primary-text !px-6 md:!px-10 !pb-10 !mt-10">
      <Card withBorder radius={"md"}>
        {!isEmbedded && (
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
                <span className="text-primary-text">performance monitoring</span>
              </Text>
            </Box>
            <Flex gap={{ base: "sm", sm: "md" }} wrap={"wrap"}>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                rightSection={<FaAngleDown />}
                placeholder="Game Category: "
                data={categoriesData}
                className="!rounded-xl !shadow-sm"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
              <Select
                value={localRaffleId}
                onChange={setLocalRaffleId}
                rightSection={<FaAngleDown />}
                placeholder="Game: "
                data={rafflesData}
                className="!rounded-xl !shadow-sm"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                maxDate={new Date()}
                placeholder="Select date range"
              />
            </Flex>
          </Flex>
        )}
        {!isEmbedded && <Divider my="lg" />}
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
          {localRaffleId && (
            <Button
              tt={"capitalize"}
              rightSection={<RiArrowRightUpLine size={16} />}
              onClick={() => navigate(`${baseRoute}/${raffleId}`)}
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
          <TicketPerformanceCard
            loading={ticketPerformanceMutation.isPending}
            ticketPerformance={ticketPerformance}
          />
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
          loading={ticketStatsMutation.isPending}
        />
      </Card>
    </Box>
  );
}

export default PerformanceMonitor;
