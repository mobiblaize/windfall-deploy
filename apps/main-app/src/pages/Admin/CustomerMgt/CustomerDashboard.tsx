import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  Box,
  Group,
  Skeleton,
} from "@mantine/core";
import { useFetchData } from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import CustomerDistribution from "./CustomerDistribution";
import GameCustomers from "./GameCustomers";
import EmptyState from "../../../components/EmptyState";

interface CustomerStats {
  total_customers: number;
  total_customers_percentage_increase: number;
  new_customers: number;
  new_customers_percentage_increase: number;
  ticket_stats_last_7_days_count: number;
  returning_ticket_buyers_percentage_change: number;
  returning_ticket_buyers: number;
  average_tickets_per_customer: number;
  ticket_revenue: string;
  period: string;
}

function CustomerDashboard() {
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(
    `admin/customer-management/overview-stats?start_date=${startDate}&end_date=${endDate}`
  );

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

  const customerStats: CustomerStats = statsResponse?.data;

  return (
    <>
      <div className="text-primary-text px-6 md:px-10 pb-10">
        <Card withBorder mt={"xl"} radius={"md"} py={24}>
          <Flex
            justify={{ base: "start", xs: "space-between" }}
            align={{ base: "start", xs: "center" }}
            direction={{ base: "column", xs: "row" }}
            gap={"md"}
          >
            <div>
              <Text tt={"capitalize"} fz={"lg"} fw={600}>
                Customer Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An insight into the game customers on the system
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
              <Group>
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
              </Group>
            </Flex>
          </Flex>
          <Divider my="md" />

          {isLoadingStats ? (
            <>
              <Box mb={"lg"}>
                <Skeleton height={16} width={240} mb={8} />
                <Skeleton height={40} width={180} />
              </Box>
              <Divider my="sm" />
              <SimpleGrid
                className="text-secondary-text"
                my="lg"
                cols={{ base: 1, xs: 2, sm: 3 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "lg", sm: "xl" }}
                mt="md"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} className="py-3 sm:py-0">
                    <Skeleton height={16} width={200} mb={8} />
                    <Skeleton height={32} width={120} mb={6} />
                    <Skeleton height={16} width={220} />
                  </Box>
                ))}
              </SimpleGrid>
            </>
          ) : !customerStats ? (
            <EmptyState
              title="No Customer Stats"
              description="No customer overview data found for the selected period"
              format="secondary"
              fullWidth={true}
            />
          ) : (
            <>
              <Box mb={"lg"}>
                <Text
                  tt={"capitalize"}
                  fz={"sm"}
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  Total Number of Customer {" "}
                  <span>
                    <PiQuestionThin />
                  </span>
                </Text>
                <Text className="!text-primary-green" fz={32} fw={600} mb="xs">
                  {customerStats?.total_customers?.toLocaleString()}
                </Text>
                <Text
                  tt="capitalize"
                  fz="sm"
                  fw={600}
                  className="!text-secondary-text !item-center !flex !gap-2"
                  mb={5}
                >
                  <AiFillExclamationCircle />
                  <span className="!text-primary-green">
                    +{customerStats?.total_customers_percentage_increase}%
                  </span>{" "}
                  increase over the last {customerStats?.period}
                </Text>
              </Box>
              <Divider my="sm" />
              <SimpleGrid
                className="text-secondary-text"
                my="lg"
                cols={{ base: 1, xs: 2, sm: 3 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "lg", sm: "xl" }}
                mt="md"
              >
                <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
                  <Text
                    tt={"capitalize"}
                    fz={"sm"}
                    className=" !flex !items-center !gap-x-2"
                  >
                    Total New Customers
                  </Text>
                  <Text fw={700} className="!text-primary-text" fz={28}>
                    {customerStats?.new_customers?.toLocaleString()}
                  </Text>
                  <Text tt="capitalize" fz="sm">
                    <span className="!text-primary-green">
                      +{customerStats?.new_customers_percentage_increase}%
                    </span>{" "}
                    increase in last {customerStats?.period}
                  </Text>
                </Box>
                <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
                  <Text
                    tt={"capitalize"}
                    fz={"sm"}
                    className=" !flex !items-center !gap-x-2"
                  >
                    Total Returning Buyers {" "}
                    <span>
                      <PiQuestionThin />
                    </span>
                  </Text>
                  <Text
                    fw={700}
                    className="!text-primary-text"
                    fz={22}
                    tt="capitalize"
                  >
                    {customerStats?.returning_ticket_buyers?.toLocaleString()}
                  </Text>
                  <Text tt="capitalize" fz="sm">
                    <span className="!text-primary-green">
                      +{customerStats?.returning_ticket_buyers_percentage_change}%
                    </span>{" "}
                    increase in last 7 days
                  </Text>
                </Box>
                <Box className="sm:!border-b-0  !border-secondary-text/40 py-3 sm:py-0">
                  <Text
                    tt={"capitalize"}
                    fz={"sm"}
                    className=" !flex !items-center !gap-x-2"
                  >
                    Average Ticket Unit per Customer
                    <span>
                      <PiQuestionThin />
                    </span>
                  </Text>
                  <Text fw={700} className="!text-primary-text" fz={22}>
                    {customerStats?.average_tickets_per_customer?.toLocaleString()} {" "}
                    Tickets Unit
                  </Text>
                  <Text tt="capitalize" fz="sm">
                    <span className="!text-primary-green"> {" "}
                      + {customerStats?.ticket_stats_last_7_days_count} Ticket
                    </span>{" "}
                    in last 7 days
                  </Text>
                </Box>
              </SimpleGrid>
            </>
          )}
        </Card>

        <CustomerDistribution />

        <GameCustomers />
      </div>
    </>
  );
}

export default CustomerDashboard;
