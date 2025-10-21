import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
  Box,
  Button,
  TextInput,
  Group,
  Select,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { BiSolidBell } from "react-icons/bi";
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
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

function Support() {
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
    `admin/customer-support-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportComplaintsMutation = useGetExportData(
    `admin/customer-support-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch support stats",
        message:
          (statsError as { message?: string })?.message ||
          "An error occurred",
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
                Support Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An snapshot of support issues raised by customer
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
                total number of support cases
              </Text>
              {isLoadingStats ? (
                <Skeleton height={36} width={50} radius="sm" my={7} />
              ) : (
                <Text
                  fw={500}
                  fz={32}
                  className="!text-primary-red !font-semibold"
                >
                  {supportStats?.total ?? 0}
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
                        value: supportStats?.[item.slug],
                        period: supportStats?.period?.days,
                        added: supportStats?.[item.added],
                      }}
                    />
                  ))}
            </SimpleGrid>
          </section>
        </Card>

        {/* === Complaint list table === */}

        <section className="text-secondary-text my-10">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  List of Users
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage users under this role
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportComplaintsMutation?.isPending}
                disabled={exportComplaintsMutation?.isPending}
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
              <Flex justify="space-between" align="center">
                <TabSwitcher
                  tabs={tabs}
                  activeTab={filterBy}
                  onChange={setFilterBy}
                />
              </Flex>
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!w-72 !rounded-xl shadow-md"
              />
              <Group>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  rightSection={<IoFilterOutline />}
                  placeholder="Sort by: Show all"
                  data={[
                    { value: "asc", label: "Oldest to Newest" },
                    { value: "desc", label: "Newest to Oldest" },
                  ]}
                  className="!shadow-md"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Group>
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Customer Name & ID", key: "name" },
                { label: "Case ID", key: "id" },
                { label: "Date Raised", key: "date" },
                { label: "Type of Issue", key: "type" },
                { label: "Raised Via", key: "via" },
                { label: "Status", key: "status" },
                { label: "Resolved Date", key: "resolved" },
                { label: "", key: "action" },
              ]}
              data={complaints}
              loading={isLoadingComplaints}
              emptyMessage="No complaints found"
              renderItems={(complaint) => [
                complaint.customer_id,
                complaint.uniqueID,
                complaint?.updated_at
                  ? format(new Date(complaint.updated_at), "MMMM d, yyyy")
                  : "-",
                complaint.issue_type,
                complaint.platform,
                complaint.platform,
                <Badge
                  color={complaint.status === "resolved" ? "green" : "#b54708"}
                  radius="md"
                  className="!capitalize !text-sm !h-[22px]"
                  variant="light"
                >
                  {complaint.status}
                </Badge>,
                <>
                  <Text className="!text-base !font-medium">
                    {complaint.time_resolved
                      ? format(
                          new Date(complaint.time_resolved),
                          "MMMM d, yyyy"
                        )
                      : " - "}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {complaint.time_resolved
                      ? format(new Date(complaint.time_resolved), "h:mm a")
                      : ""}
                  </Text>
                </>,

                <ActionIcon
                  onClick={() => navigate(complaint.uuid)}
                  size={35}
                  className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                >
                  <GoArrowUpRight />
                </ActionIcon>,
              ]}
            />

            {/* Pagination */}
            <TablePaginator
              currentPage={currentPage}
              isLoading={isLoadingComplaints}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        </section>
      </div>
    </>
  );
}

export default Support;

type GridCardProps = Omit<StatsCard, "added"> & {
  added?: number;
};

function GridCard({
  title,
  value,
  added,
  className,
  color,
  period,
}: GridCardProps) {
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
          <span className={` ${color}`}>
            {Number(added || 0) > 0 ? "+" + added : 0}
          </span>{" "}
          Added in last {period ?? 0} days
        </Text>
      </Stack>
    </Card>
  );
}
