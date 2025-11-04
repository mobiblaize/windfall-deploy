import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
} from "@mantine/core";
import { BiSolidBell } from "react-icons/bi";
import PerformanceMonitor from "./PerformanceMonitor";
import { useFetchData } from "../../../utils/hooks/useApis";
import { useEffect, useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import SampleRaffles from "./SampleRaffles";
import { useLocation } from "react-router-dom";

type StatsCard = {
  title: string;
  value: number;
  slug: string;
  added: string;
  className: string;
  color: string;
  period: string | number;
};

const cards: StatsCard[] = [
  {
    title: "live raffles",
    value: 0,
    slug: "live_games",
    added: "live_games_added_last_period_days",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    period: 3,
  },
  {
    title: "upcoming raffles",
    value: 0,
    slug: "upcoming_games",
    added: "upcoming_games_added_last_period_days",
    className:
      "!bg-primary-warning/10 !text-primary-warning/50 !border-primary-warning/50 ",
    color: "!text-primary-warning",
    period: 3,
  },
  {
    title: "draw completed",
    value: 0,
    slug: "concluded_games",
    added: "concluded_games_added_last_period_days",
    className: "!bg-light-blue !text-instant-blue/50 !border-instant-blue/50",
    color: "!text-instant-blue",
    period: 3,
  },
];

function RaffleManagement() {
  const location = useLocation();
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  
  // Detect if we're on instant-raffles route
  const isInstantRaffleRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles");
  }, [location.pathname]);

  // Build API URL with instant_game param when on instant-raffles route
  const statsApiUrl = useMemo(() => {
    const baseUrl = `admin/game-management/dashboard/stats?start_date=${startDate}&end_date=${endDate}`;
    if (isInstantRaffleRoute) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [startDate, endDate, isInstantRaffleRoute]);

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(statsApiUrl);

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to Load Raffle Stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  const dashboardStats = statsResponse?.data;

  return (
    <>
      <div className="text-primary-text px-6 md:px-10">
        <Card withBorder mt={"xl"} radius={"md"} py={24}>
          <Flex
            justify={{ base: "start", xs: "space-between" }}
            align={{ base: "start", xs: "center" }}
            direction={{ base: "column", xs: "row" }}
            gap={"md"}
          >
            <div>
              <Text tt={"capitalize"} fz={"lg"} fw={600}>
                Dashboard overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                A snapshot of raffle draws / games on the system
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

          {/* === Skeleton for total games === */}
          <section>
            <div>
              <Text tt={"capitalize"} className="!text-secondary-text !text-sm">
                total number of games
              </Text>
              {isLoadingStats ? (
                <Skeleton height={36} width={50} radius="sm" my={7} />
              ) : (
                <Text
                  fw={500}
                  fz={32}
                  className="!text-primary-red !font-semibold"
                >
                  {dashboardStats?.total_games ?? 0}
                </Text>
              )}
            </div>

            {/* === Skeletons for Cards === */}
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {isLoadingStats
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} radius="md" withBorder>
                      <Stack gap="xs">
                        <Skeleton height={20} width="60%" radius="sm" />
                        <Skeleton height={30} width="40%" my={13} radius="sm" />
                        <Skeleton height={14} width="80%" radius="sm" />
                      </Stack>
                    </Card>
                  ))
                : cards.map((item) => (
                    <GridCard
                      key={item.slug}
                      {...{
                        ...item,
                        value: dashboardStats?.[item.slug],
                        period: dashboardStats?.period,
                        added: dashboardStats?.[item.added],
                      }}
                    />
                  ))}
            </SimpleGrid>
          </section>
        </Card>
      </div>

      {/* === Raffle list table === */}
      <SampleRaffles isInstantRaffleRoute={isInstantRaffleRoute} />

      <PerformanceMonitor isInstantRaffleRoute={isInstantRaffleRoute} />
    </>
  );
}

export default RaffleManagement;

function GridCard({
  title,
  value,
  added,
  className,
  color,
  period,
}: Partial<StatsCard>) {
  return (
    <Card radius={"md"} className={`border ${className}`}>
      <Stack gap={"xs"}>
        <Flex gap="sm" align="center">
          <BiSolidBell />
          <Text tt="capitalize" fz="sm" className="!text-primary-text">
            {title}
          </Text>
        </Flex>
        <Text fw={500} fz={32} className={`!font-semibold ${color}`}>
          {value ?? 0}
        </Text>
        <Text
          tt="capitalize"
          className="!text-primary-text !capitalize !text-sm"
        >
          <span className={` ${color}`}>{Number(added || 0 )>0 ? '+'+added : 0}</span> Added in last{" "}
          {period ?? 0} days
        </Text>
      </Stack>
    </Card>
  );
}
