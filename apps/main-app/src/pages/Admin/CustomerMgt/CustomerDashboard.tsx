import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  Box,
  Button,
  TextInput,
  Group,
  Select,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import TablePaginator from "../../../components/TablePaginator";
import { HiDocumentArrowDown } from "react-icons/hi2";
import TabSwitcher, {
  type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import { HiSearch } from "react-icons/hi";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
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
  period: Period;
}

export interface Period {
  days: number;
  start_date: string;
  end_date: string;
}

type StatsCard = {
  title: string;
  value: number;
  slug: "pending" | "resolved";
  added: "last_period_days_pending" | "last_period_days_resolved";
  className: string;
  color: string;
  period: string | number;
};

export interface Complaints {
  uuid: string;
  uniqueID: string;
  issue_type: string;
  platform: string;
  customer_id: string;
  customer_complaint: string;
  other_information: string;
  created_by: string;
  staff_created_comment: string;
  resolved_by: string;
  time_resolved: string;
  staff_resolution_comment: string;
  status: string;
  updated_at: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const cards: StatsCard[] = [
  {
    title: "Resolved Issues",
    value: 0,
    slug: "resolved",
    added: "last_period_days_resolved",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    period: 3,
  },
  {
    title: "Pending Issues",
    value: 0,
    slug: "pending",
    added: "last_period_days_pending",
    className:
      "!bg-primary-warning/10 !text-primary-warning/50 !border-primary-warning/50 ",
    color: "!text-primary-warning",
    period: 3,
  },
];

const tabs: TabSwitcherTab[] = [
  {
    label: "Show All",
    value: "",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

function CustomerDashboard() {
  const [complaints, setComplaints] = useState<Complaints[]>([]);
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const navigate = useNavigate();

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(
    `admin/customer-support-management/stats?start_date=${startDate}&end_date=${endDate}`
  );

  const {
    data: complaintsResponse,
    isLoading: isLoadingComplaints,
    isError: isErrorComplaints,
    error: complaintsError,
  } = useFetchData(
    `admin/promo-code-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportComplaintsMutation = useGetExportData(
    `admin/promo-code-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch support stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  useEffect(() => {
    if (isErrorComplaints) {
      notifications.show({
        title: "Failed to fetch complaints",
        message:
          (complaintsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    if (complaintsResponse) {
      setComplaints(complaintsResponse.data?.records?.data);
      setCurrentPage(complaintsResponse.data?.records?.current_page || 1);
      setTotal(complaintsResponse.data?.records?.total || 0);
      setPageSize(complaintsResponse.data?.records?.per_page || 10);
    }
  }, [complaintsError, isErrorComplaints, complaintsResponse]);

  const handleExport = () => {
    exportComplaintsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `customer_complaints_export_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`; // adjust extension if CSV/PDF
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Export Successful",
          message: "Your file has been downloaded",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Export Failed",
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  function onPageChange(page: number) {
    setFilterPage(page);
  }

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

        <section className="text-secondary-text my-10">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white" px={"md"}>
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
          </Box>
        </section>

        <GameCustomers />
      </div>
    </>
  );
}

export default CustomerDashboard;
