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
  Box,
} from "@mantine/core";
import { BiSolidBell } from "react-icons/bi";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { useEffect, useState, useMemo } from "react";
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
import { AiFillExclamationCircle } from "react-icons/ai";
import RenderSkeletonText from "../../../components/RenderSkeletonText";
import type { Raffle } from "../GameMgt/RaffleList";
import type { Customer } from "../CustomerMgt/GameCustomers";
import { formatCurrency } from "../../../utils/helper/formatCurrency";

interface DrawStats {
  total_draws: number;
  total_draw_lines: number;
  games_eligible_today: number;
  games_eligible_next_7_days: number;
  games_eligible_next_14_days: number;
  winners_last_7_days: number;
  winners_last_14_days: number;
  winners_last_1_month: number;
  winners_announced_last_7_days: number;
}

type DrawStatsCard = {
  title: string;
  value: number;
  slug: keyof DrawStats;
  className: string;
  color: string;
  subtitle?: string;
};

export interface DrawRecord {
  uuid: string;
  status: string;
  draw_at: string | null;
  game: Raffle;
  prize: {
    uuid: string;
    name: string;
  };
  winner: {
    uuid: string;
    customer?: Customer;
  } | null;
  metrics: {
    total_ticket_paid_amount: string;
    tickets_left: number;
    tickets_sold: number;
    unique_players: number;
    potential_winner: number;
  };
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const drawStatsCards: DrawStatsCard[] = [
  {
    title: "Total Draw Lines",
    value: 0,
    slug: "total_draw_lines",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    subtitle: "Total number of draw lines in the system",
  },
  {
    title: "Games Eligible Today",
    value: 0,
    slug: "games_eligible_today",
    className:
      "!bg-primary-warning/10 !text-primary-warning/50 !border-primary-warning/50 ",
    color: "!text-primary-warning",
    subtitle: "Games available for draws today",
  },
];

const drawTabs: TabSwitcherTab[] = [
  {
    label: "Show All",
    value: "",
  },
  {
    label: "Open",
    value: "open",
  },
  {
    label: "Pending",
    value: "closed",
  },
  {
    label: "Closed",
    value: "closed",
  },
];

function DrawsOverview() {
  const [draws, setDraws] = useState<DrawRecord[]>([]);
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

  // Format dates for API (YYYY-MM-DD from DD/MM/YYYY)
  const formatDateForAPI = (dateString: string | null): string => {
    if (!dateString) return "";
    // Parse DD/MM/YYYY to Date, then format as YYYY-MM-DD
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  const startDateParam = formatDateForAPI(startDate);
  const endDateParam = formatDateForAPI(endDate);

  // Build stats API URL - only include date params if they have values
  const statsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (startDateParam) params.append("start_date", startDateParam);
    if (endDateParam) params.append("end_date", endDateParam);
    return `admin/draw-management/stats${params.toString() ? `?${params.toString()}` : ""}`;
  }, [startDateParam, endDateParam]);

  const {
    data: drawStatsResponse,
    isLoading: isLoadingDrawStats,
    isError: isErrorDrawStats,
    error: drawStatsError,
  } = useFetchData(statsUrl);

  // Build draws API URL with pagination
  const drawsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "10");
    if (sortBy) params.append("sort_by", sortBy);
    if (filterBy) params.append("filter_by", filterBy);
    if (startDateParam) params.append("start_date", startDateParam);
    if (endDateParam) params.append("end_date", endDateParam);
    params.append("paginate", "1");
    params.append("page", filterPage.toString());
    params.append("export", "0");
    return `admin/draw-management/all-draw-lines?${params.toString()}`;
  }, [
    debouncedSearch,
    sortBy,
    filterBy,
    startDateParam,
    endDateParam,
    filterPage,
  ]);

  const {
    data: drawsResponse,
    isLoading: isLoadingDraws,
    isError: isErrorDraws,
    error: drawsError,
  } = useFetchData(drawsUrl);

  // Build export API URL (no pagination, all records)
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "10");
    if (sortBy) params.append("sort_by", sortBy);
    if (filterBy) params.append("filter_by", filterBy);
    if (startDateParam) params.append("start_date", startDateParam);
    if (endDateParam) params.append("end_date", endDateParam);
    params.append("paginate", "0");
    params.append("export", "1");
    return `admin/draw-management/all-draw-lines?${params.toString()}`;
  }, [debouncedSearch, sortBy, filterBy, startDateParam, endDateParam]);

  const exportDrawsMutation = useGetExportData(exportUrl);

  useEffect(() => {
    if (isErrorDrawStats) {
      notifications.show({
        title: "Failed to fetch draw stats",
        message:
          (drawStatsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [drawStatsError, isErrorDrawStats]);

  useEffect(() => {
    if (isErrorDraws) {
      notifications.show({
        title: "Failed to fetch draws",
        message:
          (drawsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
      setDraws([]);
      setTotal(0);
    }

    if (drawsResponse) {
      setDraws(drawsResponse.data?.records?.data || []);
      console.log(drawsResponse.data);
      // Handle pagination metadata - check both possible response structures
      const paginationData = drawsResponse.data;
      setCurrentPage(paginationData?.records?.current_page || filterPage || 1);
      setTotal(paginationData?.records?.total || paginationData?.total || 0);
      setPageSize(
        paginationData?.records?.per_page || paginationData?.per_page || 10
      );
    }
  }, [drawsError, isErrorDraws, drawsResponse, filterPage]);

  const handleExport = () => {
    exportDrawsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `draws_export_${new Date()
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

  const drawStats: DrawStats = drawStatsResponse?.data;

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
                Draw Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An insight into the raffle draws on system
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

          {/* === Skeleton for total draws === */}
          <section>
            <div className="mb-5">
              <Text tt={"capitalize"} className="!text-secondary-text !text-sm">
                Total Number of Draws
              </Text>
              {isLoadingDrawStats ? (
                <Box className="space-y-5">
                  <RenderSkeletonText height={24} width="30%" />
                  <RenderSkeletonText height={10} width="50%" />
                </Box>
              ) : (
                <>
                  <Text
                    fw={500}
                    fz={32}
                    className="!text-primary-red !font-semibold"
                  >
                    {drawStats?.total_draws ?? 0}
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
                      {drawStats?.total_draw_lines ?? 0}
                    </span>{" "}
                    total draw lines
                  </Text>
                </>
              )}
            </div>

            {/* === Skeletons for Cards === */}
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {isLoadingDrawStats
                ? Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} radius="md" withBorder>
                      <Stack gap="xs">
                        <Skeleton height={20} width="60%" radius="sm" />
                        <Skeleton height={30} width="40%" my={13} radius="sm" />
                        <Skeleton height={14} width="80%" radius="sm" />
                      </Stack>
                    </Card>
                  ))
                : drawStatsCards.map((item) => (
                    <DrawGridCard
                      key={item.slug}
                      {...{
                        ...item,
                        value: drawStats?.[item.slug] ?? 0,
                      }}
                    />
                  ))}
            </SimpleGrid>
          </section>
        </Card>

        {/* === Draws list table === */}

        <section className="text-primary-text my-10">
          <Card withBorder mt={"xl"} radius={"md"} p={0}>
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-text">
                  Draw List
                </Text>
                <Text className="!text-secondary-text">
                  A list of your draws on the system
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportDrawsMutation?.isPending}
                disabled={exportDrawsMutation?.isPending}
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
                  tabs={drawTabs}
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
                { label: "Game Name", key: "game" },
                { label: "Projected Ticket Unit", key: "unit" },
                { label: "Ticket Sold", key: "sold" },
                { label: "Draw Date", key: "draw_date" },
                { label: "Draw status", key: "draw_status" },
                { label: "Draw winner", key: "draw_winner" },
                { label: "Conducted By", key: "conducted_by" },
                { label: "", key: "action" },
              ]}
              data={draws}
              loading={isLoadingDraws}
              emptyMessage="No draws found"
              renderItems={(draw) => [
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {draw.game?.name || "-"}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {draw.game.uniqueID}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {draw.game?.total_tickets?.toLocaleString() || "-"}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {formatCurrency(draw.metrics?.total_ticket_paid_amount) ||
                      "-"}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    Unit: {draw.game?.total_tickets_sold?.toLocaleString() || "-"}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {draw.draw_at
                      ? format(new Date(draw.draw_at), "MMMM d, yyyy")
                      : "-"}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {draw.draw_at
                      ? format(new Date(draw.draw_at), "h:mm a")
                      : ""}
                  </Text>
                </>,
                <CustomBadge
                  status={
                    draw.status === "closed"
                      ? "successful"
                      : draw.status === "pending"
                        ? "active"
                        : "pending"
                  }
                  label={draw.status}
                />,
                <>
                  {draw.winner?.customer ? (
                    <>
                      <Text className="!text-base !text-primary-text !font-medium">
                        {draw.winner?.customer?.customer_name}
                      </Text>
                      <Text className="!text-secondary-text !text-sm">
                        {draw.winner?.customer?.uniqueID}
                      </Text>
                    </>
                  ) : (
                    "N/A"
                  )}
                </>,
                <>
                  {draw.winner?.customer ? (
                    <>
                      <Text className="!text-base !text-primary-text !font-medium">
                        {draw.winner?.customer?.customer_name}
                      </Text>
                      <Text className="!text-secondary-text !text-sm">
                        {draw.winner?.customer?.uniqueID}
                      </Text>
                    </>
                  ) : (
                    "-"
                  )}
                </>,
                <ActionIcon
                  onClick={() => navigate(draw.uuid)}
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
              isLoading={isLoadingDraws}
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

export default DrawsOverview;

type DrawGridCardProps = DrawStatsCard;

function DrawGridCard({
  title,
  value,
  className,
  color,
  subtitle,
}: DrawGridCardProps) {
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
        {subtitle && (
          <Text
            tt="capitalize"
            className="!text-secondary-text !capitalize !text-sm"
          >
            {subtitle}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
