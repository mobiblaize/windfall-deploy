import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  Box,
  Group,
} from "@mantine/core";
import { useFetchData } from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import { useNavigate } from "react-router-dom";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";
import CustomerDistribution from "./CustomerDistribution";
import GameCustomers from "./GameCustomers";

interface SupportStats {
  total: number;
  pending: number;
  resolved: number;
  last_period_days_total: number;
  last_period_days_pending: number;
  last_period_days_resolved: number;
  period: string;
}

function CustomerDashboard() {
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");

  const navigate = useNavigate();

  const {
    data: statsResponse,
    // isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(
    `admin/customer-support-management/stats?start_date=${startDate}&end_date=${endDate}`
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

  const supportStats: SupportStats = statsResponse?.data;

  console.log(supportStats);
  

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
              <CustomButton
                border={false}
                className="!rounded-lg"
                size="sm"
                onClick={() => navigate("create")}
                rightSection={
                  <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                    <BsPlus className=" !text-white" />
                  </div>
                }
              >
                Create New
              </CustomButton>
            </Flex>
          </Flex>
          <Divider my="md" />

          <Box mb={"lg"}>
            <Text
              tt={"capitalize"}
              fz={"sm"}
              className="!text-secondary-text !flex !items-center !gap-x-2"
            >
              Total Number of Customer{" "}
              <span>
                <PiQuestionThin />
              </span>
            </Text>
            <Text className="!text-primary-green" fz={32} fw={600} mb="xs">
              {(2000000)?.toLocaleString()}
            </Text>
            <Text
              tt="capitalize"
              fz="sm"
              fw={600}
              className="!text-secondary-text !item-center !flex !gap-2"
              mb={5}
            >
              <AiFillExclamationCircle />
              <span className="!text-primary-green">22.4%</span> increase over
              the last days
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
                5,000
              </Text>
              <Text tt="capitalize" fz="sm">
                <span className="!text-primary-green">22.4%</span> increase in
                last 3 days
              </Text>
            </Box>
            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Total Returning Buyers{" "}
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
                increase in last 3 days
              </Text>
              <Text tt="capitalize" fz="sm">
                <span className="!text-primary-green">22.4%</span> ticket sales
                across channel
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
                2 Tickets Unit
              </Text>
              <Text tt="capitalize" fz="sm">
                <span className="!text-primary-green"> + 0.4 Ticket</span>{" "}
                increase in last 3 days
              </Text>
            </Box>
          </SimpleGrid>
        </Card>

        {/* === Complaint list table === */}

        <div className="text-secondary-text my-10">
          <Card withBorder mt={"xl"} radius={"md"} px={"md"}>
            {/* Header */}
            <Flex justify="space-between" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-text">
                  Customer Distribution by Channel
                </Text>
                <Text className="!text-secondary-text">
                  Distribution of customer Purchase by Channels
                </Text>
              </div>

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
            
            
            <Divider my="md" />

            <CustomerDistribution />
          </Card>
        </div>

        <GameCustomers />
      </div>
    </>
  );
}

export default CustomerDashboard;
