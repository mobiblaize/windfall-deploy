import {
  Card,
  Text,
  Box,
  Divider,
  SimpleGrid,
  Flex,
  Button,
  Group,
  TextInput,
  Select,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaFileArrowDown } from "react-icons/fa6";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import { useEffect, useState, useMemo } from "react";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import type { RaffleTransaction } from "../TransactionMgt/TransactionList";
import TransactionTable from "../TransactionMgt/TransactionTable";
import TablePaginator from "../../../components/TablePaginator";
import TabSwitcher, {
  type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import RenderSkeletonText from "../../../components/RenderSkeletonText";

interface RaffleTransactionalListProps {
  raffleId?: string;
  startDate?: string;
  endDate?: string;
}

interface RaffleStats {
  total_tickets_sold: number;
  total_revenue: string;
  average_ticket_price: number;
  tickets_by_channel: Array<{
    platform: string;
    tickets: number;
  }>;
  tickets_by_channel_total: number;
  percentage_increase_last_3_days: number;
  total_unique_customers: number;
  unique_customers_by_channel_percentage: {
    web: {
      unique_customers: number;
      percentage: number;
    };
    mobile: {
      unique_customers: number;
      percentage: number;
    };
  };
  top_purchase_channels: Array<{
    channel: string;
    tickets: number;
    percentage: number;
  }>;
  peak_sales_times: Array<{
    date: string;
    time: string;
    tickets: number;
  }>;
}

const paymentStatus: TabSwitcherTab[] = [
  {
    label: "Filter by: All",
    value: "",
  },
  {
    label: "Successful",
    value: "successful",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Failed",
    value: "failed",
  },
];

const platformTabs: TabSwitcherTab[] = [
  {
    label: "Show All",
    value: "",
  },
  {
    label: "Web",
    value: "web",
  },
  {
    label: "Mobile App",
    value: "mobile",
  },
];

function RaffleTransactionalList({
  raffleId,
  startDate = "",
  endDate = "",
}: RaffleTransactionalListProps) {
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("desc");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const [platform, setPlatform] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  // Build stats API URL
  const statsUrl = useMemo(() => {
    if (!raffleId) return null;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    return `admin/game-management/game-list/single-game/${raffleId}/transaction-stats${params.toString() ? `?${params.toString()}` : ""}`;
  }, [raffleId, startDate, endDate]);

  // Fetch stats
  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(statsUrl);

  // Build transactions API URL
  const transactionsUrl = useMemo(() => {
    if (!raffleId) return null;
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "10");
    if (sortBy) params.append("sort_by", sortBy);
    if (filterBy) params.append("filter_by", "payment_status");
    if (filterBy) params.append("filter_value", filterBy);
    if (platform) params.append("platform_source", platform);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    params.append("paginate", "1");
    params.append("page", filterPage.toString());
    params.append("export", "0");
    return `admin/game-management/game-list/single-game/${raffleId}/transaction-list?${params.toString()}`;
  }, [
    raffleId,
    debouncedSearch,
    sortBy,
    filterBy,
    platform,
    startDate,
    endDate,
    filterPage,
  ]);

  // Fetch transactions
  const {
    data: transactionsResponse,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: transactionsError,
  } = useFetchData(transactionsUrl);

  // Build export URL
  const exportUrl = useMemo(() => {
    if (!raffleId) return "";
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "10");
    if (sortBy) params.append("sort_by", sortBy);
    if (filterBy) params.append("filter_by", "payment_status");
    if (filterBy) params.append("filter_value", filterBy);
    if (platform) params.append("platform", platform);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    params.append("paginate", "0");
    params.append("export", "1");
    return `admin/game-management/game-list/single-game/${raffleId}/transaction-list?${params.toString()}`;
  }, [
    raffleId,
    debouncedSearch,
    sortBy,
    filterBy,
    platform,
    startDate,
    endDate,
  ]);

  const exportTransactionsMutation = useGetExportData(exportUrl);

  const stats: RaffleStats | undefined = statsResponse?.data?.record;

  // Handle stats error
  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch game statistics",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [isErrorStats, statsError]);

  // Handle transactions
  useEffect(() => {
    if (isErrorTransactions) {
      notifications.show({
        title: "Failed to fetch transactions",
        message:
          (transactionsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
      setTransactions([]);
      setTotal(0);
    }

    if (transactionsResponse) {
      setTransactions(transactionsResponse.data?.records?.data || []);
      setCurrentPage(
        transactionsResponse.data?.records?.current_page || filterPage || 1
      );
      setTotal(transactionsResponse.data?.records?.total || 0);
      setPageSize(transactionsResponse.data?.records?.per_page || 10);
    }
  }, [
    isErrorTransactions,
    transactionsError,
    transactionsResponse,
    filterPage,
  ]);

  const handleExport = () => {
    exportTransactionsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `raffle_transactions_${new Date()
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
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  // Get top purchase channel
  const topChannel = stats?.top_purchase_channels?.[0];
  const peakTime = stats?.peak_sales_times?.[0];

  if (!raffleId) {
    return (
      <Box mt="xl" pb="xl" mx="xl">
        <Card withBorder radius="md" p="xl">
          <Text className="!text-secondary-text" ta="center">
            No raffle selected
          </Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box mt="xl" pb="xl" mx="xl">
      <Card withBorder radius={"md"}>
        <Box>
          <Text tt="capitalize" fz={"lg"} fw={600}>
            Game Statistics
          </Text>
          <Text className="!text-secondary-text !text-xs !capitalize">
            Overview of game performance and revenue
          </Text>
        </Box>
        <Divider my="md" />
        <Box mb={"lg"}>
          <Text
            tt={"capitalize"}
            fz={"sm"}
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            total revenue generated{" "}
            <span>
              <PiQuestionThin />
            </span>
          </Text>
          {isLoadingStats ? (
            <Box className="space-y-2">
              <RenderSkeletonText height={40} width="40%" />
              <RenderSkeletonText height={16} width="50%" />
            </Box>
          ) : (
            <>
              <Text className="!text-primary-green" fz={32} fw={600} mb="xs">
                {formatCurrency(stats?.total_revenue || "0")}
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
                  {stats?.percentage_increase_last_3_days || 0}%
                </span>{" "}
                increase over the last 3 days
              </Text>
            </>
          )}
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
              total unique customers
            </Text>
            {isLoadingStats ? (
              <Box className="space-y-2">
                <RenderSkeletonText height={32} width="60%" />
                <RenderSkeletonText height={14} width="70%" />
              </Box>
            ) : (
              <>
                <Text fw={700} className="!text-primary-text" fz={28}>
                  {stats?.total_unique_customers?.toLocaleString() || 0}
                </Text>
                <Text tt="capitalize" fz="sm">
                  <span className="!text-primary-green">
                    {stats?.total_tickets_sold || 0}
                  </span>{" "}
                  tickets sold
                </Text>
              </>
            )}
          </Box>
          <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
            <Text
              tt={"capitalize"}
              fz={"sm"}
              className=" !flex !items-center !gap-x-2"
            >
              top purchase channel{" "}
              <span>
                <PiQuestionThin />
              </span>
            </Text>
            {isLoadingStats ? (
              <Box className="space-y-2">
                <RenderSkeletonText height={28} width="80%" />
                <RenderSkeletonText height={14} width="70%" />
              </Box>
            ) : (
              <>
                <Text
                  fw={700}
                  className="!text-primary-text"
                  fz={22}
                  tt="capitalize"
                >
                  {topChannel?.channel || "N/A"} ~{" "}
                  {topChannel?.tickets?.toLocaleString() || 0} Tickets
                </Text>
                <Text tt="capitalize" fz="sm">
                  <span className="!text-primary-green">
                    {topChannel?.percentage || 0}%
                  </span>{" "}
                  ticket sales across channel
                </Text>
              </>
            )}
          </Box>
          <Box className="sm:!border-b-0  !border-secondary-text/40 py-3 sm:py-0">
            <Text
              tt={"capitalize"}
              fz={"sm"}
              className=" !flex !items-center !gap-x-2"
            >
              peak sales time
              <span>
                <PiQuestionThin />
              </span>
            </Text>
            {isLoadingStats ? (
              <Box className="space-y-2">
                <RenderSkeletonText height={28} width="60%" />
                <RenderSkeletonText height={14} width="70%" />
              </Box>
            ) : (
              <>
                <Text fw={700} className="!text-primary-text" fz={22}>
                  {peakTime?.time || "N/A"}
                </Text>
                <Text tt="capitalize" fz="sm">
                  <span className="!text-primary-green">
                    {peakTime?.tickets || 0}
                  </span>{" "}
                  sold this period
                </Text>
              </>
            )}
          </Box>
        </SimpleGrid>
      </Card>



      <Card withBorder radius={"md"} my={"lg"} px={0}>
        <Flex
          direction={{ base: "column", xs: "row" }}
          gap={10}
          justify={"space-between"}
          px="md"
        >
          <Box>
            <Text tt="capitalize" fz={"lg"} fw={600}>
              Transaction List
            </Text>
            <Text className="!text-secondary-text !text-xs !capitalize">
              Track and manage game transaction list on the system
            </Text>
          </Box>

          <Button
            rightSection={<FaFileArrowDown />}
            variant="outline"
            className="!border-secondary-text !text-secondary-text"
            onClick={handleExport}
            loading={exportTransactionsMutation?.isPending}
            disabled={exportTransactionsMutation?.isPending}
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
              tabs={platformTabs}
              activeTab={platform}
              onChange={setPlatform}
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
            <Select
              value={filterBy}
              onChange={setFilterBy}
              rightSection={<IoFilterOutline />}
              placeholder="Filter by: Show all"
              data={paymentStatus}
              className="!shadow-md"
              classNames={{
                label: "!capitalize ",
                options: "text-primary-text",
              }}
            />
          </Group>
        </Flex>

        <TransactionTable
          isLoading={isLoadingTransactions}
          transactions={transactions}
        />

        <TablePaginator
          currentPage={currentPage}
          isLoading={isLoadingTransactions}
          total={total}
          pageSize={pageSize}
          onPageChange={setFilterPage}
        />
      </Card>
    </Box>
  );
}

export default RaffleTransactionalList;
