import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
  Button,
  TextInput,
  Group,
  Select,
  ActionIcon,
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
import CustomBadge from "../../../components/CustomBadge";
import type { User } from "../UserMgt/UserMgt";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";

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

export interface PrizeClaim {
  uuid: string;
  uniqueID: string;
  issue_type: string;
  platform: string;
  customer: Customer;
  customer_id: string;
  customer_complaint: string;
  other_information: string;
  created_by: string;
  staff_created_comment: string;
  resolved_by: User;
  time_resolved: string;
  staff_resolution_comment: string;
  status: string;
  updated_at: string;
}

export interface Customer {
  uuid: string;
  firstname: string;
  lastname: string;
  uniqueID: string;
  avatar: string;
  email: string;
  phone_number: string;
  landmark?: string;
  lga?: string;
  area?: string;
  referral_link: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const cards: StatsCard[] = [
  {
    title: "Total Prize Claimed",
    value: 0,
    slug: "resolved",
    added: "last_period_days_resolved",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    period: 3,
  },
  {
    title: "Pending Prize to be Claimed",
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
    label: "Claimed",
    value: "claimed",
  },
  {
    label: "Unclaimed",
    value: "unclaimed",
  },
];

function PrizeClaims() {
  const [claims, setClaims] = useState<PrizeClaim[]>([]);
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
      setClaims(complaintsResponse.data?.records?.data);
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
                Claim Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An snapshot of support prize claim by customer
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
                Number of Prizes Won
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
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {isLoadingStats
                ? Array.from({ length: 2 }).map((_, i) => (
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

        <section className="text-primary-text my-10">
          <Card withBorder mt={"xl"} radius={"md"} p={0}>
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-green">
                  Prize Claim List
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage prize claim on the system
                </Text>
              </div>
              <Group>
                <CustomButton
                  border={false}
                  className="!rounded-lg !h-12"
                  size="sm"
                  onClick={() => navigate("create")}
                  rightSection={
                    <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                      <BsPlus className=" !text-white" />
                    </div>
                  }
                >
                  New Claim
                </CustomButton>
                <Button
                  variant="outline"
                  className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                  rightSection={<HiDocumentArrowDown />}
                  onClick={handleExport}
                  loading={exportComplaintsMutation?.isPending}
                  disabled={exportComplaintsMutation?.isPending}
                  size="sm"
                >
                  Export
                </Button>
              </Group>
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
              data={claims}
              loading={isLoadingComplaints}
              emptyMessage="No complaints found"
              renderItems={(claim) => [
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {claim.customer?.firstname} {claim.customer?.lastname}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {claim.uniqueID}
                  </Text>
                </>,
                claim.uniqueID,
                claim?.updated_at
                  ? format(new Date(claim.updated_at), "MMMM d, yyyy")
                  : "-",
                claim.issue_type,
                claim.platform,

                <CustomBadge
                  status={
                    claim.status === "resolved" ? "successful" : "pending"
                  }
                  label={claim.status}
                />,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {claim.time_resolved
                      ? format(new Date(claim.time_resolved), "MMMM d, yyyy")
                      : " - "}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {claim.time_resolved
                      ? format(new Date(claim.time_resolved), "h:mm a")
                      : ""}
                  </Text>
                </>,

                <ActionIcon
                  onClick={() => navigate(claim.uuid)}
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
          </Card>
        </section>
      </div>
    </>
  );
}

export default PrizeClaims;

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
