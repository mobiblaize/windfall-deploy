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
  Skeleton,
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
import type { Raffle } from "../GameMgt/RaffleList";
import CustomBadge from "../../../components/CustomBadge";

export interface Period {
  days: number;
  start_date: string;
  end_date: string;
}

export interface PromoCodeItem {
  uuid: string;
  uniqueID: string;
  name: string;
  code: string;
  description: string;
  type: string;
  type_value: number;
  start_date: string;
  end_date: string;
  is_active: string;
  updated_by: UpdatedBy;
  created_at: string;
  approvalStatus: string;
  updated_at: string;
  total_discount: string;
  usage_count: number;
  status: string;
  games: Raffle[];
}

export interface UpdatedBy {
  uuid: string;
  name: string;
  enforce_password_change: boolean;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface PromoCodeStats {
  total: number;
  total_percentage_change_period: number;
  active: number;
  active_percentage_change_period: number;
  inactive: number;
  inactive_percentage_change_period: number;
  pending: number;
  discount_amount: number;
  total_usage: number;
  most_used_promo_name: string;
  most_used_promo_count: number;
  most_used_promo_percentage_change_period: number;
  period: string;
}

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

const renderStatValue = (
  value: number | string | undefined,
  loading: boolean
) => {
  if (loading) {
    return <Skeleton height={28} width="50%" mb={12} />;
  }
  return value?.toLocaleString() ?? "N/A";
};

// Helper function to render percentage change
const renderPercentageChange = (
  value: number | undefined,
  period: string | undefined,
  loading: boolean,
  text: string = "increase in the last"
) => {
  if (loading) {
    return <Skeleton height={16} width="80%" />;
  }
  return (
    <>
      <span className="!text-primary-green">{value?.toLocaleString()}%</span>{" "}
      {text} {period}
    </>
  );
};

function PromoCode() {
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([]);
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
    `admin/promo-code-management/stats?start_date=${startDate}&end_date=${endDate}`
  );

  const {
    data: promoCodesResponse,
    isLoading: isLoadingPromoCodes,
    isError: isErrorPromoCodes,
    error: promoCodesError,
  } = useFetchData(
    `admin/promo-code-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&start_date=${startDate}&end_date=${endDate}`
  );

  const exportPromoCodesMutation = useGetExportData(
    `admin/promo-code-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch promo stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  useEffect(() => {
    if (isErrorPromoCodes) {
      notifications.show({
        title: "Failed to fetch promo codes",
        message:
          (promoCodesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    if (promoCodesResponse) {
      setPromoCodes(promoCodesResponse.data?.records?.data);
      setCurrentPage(promoCodesResponse.data?.records?.current_page || 1);
      setTotal(promoCodesResponse.data?.records?.total || 0);
      setPageSize(promoCodesResponse.data?.records?.per_page || 10);
    }
  }, [promoCodesError, isErrorPromoCodes, promoCodesResponse]);

  const handleExportPromoCodes = () => {
    exportPromoCodesMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `promo_codes_export_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
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
          message:
            (error as { message?: string })?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  function handlePageChange(page: number) {
    setFilterPage(page);
  }

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to Load Promo Stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  const stats: PromoCodeStats = statsResponse?.data;

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
                Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An insight into the promo-code usage on the system
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

          <Box mb={"lg"}>
            <Text
              tt={"capitalize"}
              fz={"sm"}
              className="!text-secondary-text !flex !items-center !gap-x-2"
            >
              total value discounted{" "}
              <span>
                <PiQuestionThin />
              </span>
            </Text>
            <Text className="!text-primary-green" fz={32} fw={600} mb="xs">
              {isLoadingStats ? (
                <Skeleton height={40} width={200} />
              ) : (
                formatCurrency(stats?.discount_amount)
              )}
            </Text>
            <Text
              tt="capitalize"
              fz="sm"
              fw={600}
              className="!text-secondary-text !item-center !flex !gap-2"
              mb={5}
            >
              <AiFillExclamationCircle />
              {renderPercentageChange(
                stats?.total_percentage_change_period,
                stats?.period,
                isLoadingStats,
                "increase over the last"
              )}
            </Text>
          </Box>

          <Divider my="sm" />
          <SimpleGrid
            className="text-secondary-text"
            my="lg"
            cols={{ base: 1, xs: 2, sm: 4 }}
            spacing={{ base: 10, sm: "lg" }}
            verticalSpacing={{ base: "lg", sm: "xl" }}
            mt="md"
          >
            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                total promo codes
              </Text>
              <Text fw={700} className="!text-primary-text" fz={28}>
                {renderStatValue(stats?.total, isLoadingStats)}
              </Text>
              <Text tt="capitalize" fz="sm">
                {renderPercentageChange(
                  stats?.total_percentage_change_period,
                  stats?.period,
                  isLoadingStats
                )}
              </Text>
            </Box>

            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Active Promo Codes{" "}
                <span>
                  <PiQuestionThin />
                </span>
              </Text>
              <Text fw={700} className="!text-primary-text" fz={22}>
                {renderStatValue(stats?.active, isLoadingStats)}
              </Text>
              <Text tt="capitalize" fz="sm">
                {renderPercentageChange(
                  stats?.active_percentage_change_period,
                  stats?.period,
                  isLoadingStats
                )}
              </Text>
            </Box>

            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Inactive Promo Codes{" "}
                <span>
                  <PiQuestionThin />
                </span>
              </Text>
              <Text fw={700} className="!text-primary-text" fz={22}>
                {renderStatValue(stats?.inactive, isLoadingStats)}
              </Text>
              <Text tt="capitalize" fz="sm">
                {renderPercentageChange(
                  stats?.inactive_percentage_change_period,
                  stats?.period,
                  isLoadingStats
                )}
              </Text>
            </Box>

            <Box className="sm:!border-b-0 !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Most Used Promo-Code{" "}
                <span>
                  <PiQuestionThin />
                </span>
              </Text>
              <Text fw={700} className="!text-primary-text" fz={22}>
                {isLoadingStats ? (
                  <Skeleton height={22} width="80%" />
                ) : (
                  (stats?.most_used_promo_name ?? "N/A")
                )}
              </Text>
              <Text tt="capitalize" fz="sm">
                {renderPercentageChange(
                  stats?.most_used_promo_percentage_change_period,
                  stats?.period,
                  isLoadingStats
                )}
              </Text>
            </Box>
          </SimpleGrid>
        </Card>

        {/* === Promo-Code list table === */}

        <section className="text-secondary-text my-10">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-text">
                  Promo-Code List
                </Text>
                <Text className="!text-secondary-text">
                  A List of promo-code created
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExportPromoCodes}
                loading={exportPromoCodesMutation?.isPending}
                disabled={exportPromoCodesMutation?.isPending}
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
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Promo-code Name & ID", key: "name" },
                { label: "Date Created", key: "date" },
                { label: "Duration", key: "duration" },
                { label: "Promo Value", key: "value" },
                { label: "No. of Usage", key: "usage" },
                { label: "Total Value Discounted", key: "total" },
                { label: "Status", key: "status" },
                { label: "Approval Status", key: "approval" },
                { label: "", key: "action" },
              ]}
              data={promoCodes}
              loading={isLoadingPromoCodes}
              emptyMessage="No promo codes found"
              renderItems={(promoCode) => [
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {promoCode.name}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    ID: {promoCode.uniqueID}
                  </Text>
                </>,
                <span className="text-nowrap">
                  {format(
                    new Date(promoCode.created_at),
                    "MMMM d, yyyy h:mm a"
                  )}
                </span>,
                <>
                  <Text>
                    {format(new Date(promoCode.start_date), "MMM d, yyyy")} -
                    {format(new Date(promoCode.end_date), "MMM d, yyyy")}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !text-primary-text">
                    {promoCode.type === "percentage"
                      ? `${promoCode.type_value}%`
                      : formatCurrency(promoCode.type_value)}
                  </Text>
                </>,
                promoCode.usage_count?.toLocaleString(),
                formatCurrency(promoCode.total_discount),
                <CustomBadge
                  status={
                    promoCode.is_active === "true" ? "successful" : "failed"
                  }
                  label={promoCode.is_active === "true" ? "Active" : "Inactive"}
                />,
                <CustomBadge
                  status={
                    promoCode?.approvalStatus === "approved"
                      ? "successful"
                      : promoCode?.approvalStatus === "pending"
                        ? "pending"
                        : "failed"
                  }
                  label={promoCode?.approvalStatus}
                />,
                <ActionIcon
                  onClick={() => navigate(promoCode.uuid)}
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
              isLoading={isLoadingPromoCodes}
              total={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </Box>
        </section>
      </div>
    </>
  );
}

export default PromoCode;
