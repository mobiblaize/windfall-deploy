import {
  Card,
  Flex,
  Button,
  Divider,
  TextInput,
  Text,
  Box,
  Title,
  Group,
  Select,
} from "@mantine/core";
import { FaFileArrowDown } from "react-icons/fa6";
import type { Crumb } from "../../../components/DynamicBreadCrumbs";
import DynamicBreadcrumbs from "../../../components/DynamicBreadCrumbs";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { HiSearch } from "react-icons/hi";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import TablePaginator from "../../../components/TablePaginator";
import TransactionTable from "./TransactionTable";
import type { GameCategory } from "../GameMgt/PerformanceMonitor";
import type { TabSwitcherTab } from "../../../components/TabSwitcher";
import TabSwitcher from "../../../components/TabSwitcher";
import { FaAngleDown } from "react-icons/fa";
import type { Raffle } from "../GameMgt/RaffleList";
import { DateInput } from "@mantine/dates";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";

export interface RaffleTransaction {
  uuid: string
  games: Raffle[];
  uniqueID: string
  customer_id: string
  platform: string
  payment_method: string
  payment_channel: string
  transaction_id: string
  promo_code_id: string
  reference: string
  quantity: number
  total_amount: string
  paid_amount: string
  promo_amount: string
  discount_amount: string
  referral_balance_amount: string
  promo_code: string
  referral_code: string
  status: string
  payment_status: string
  ip_address: string
  city: string
  region: string
  created_at: string
  updated_at: string
  order_details_count: number
  tickets_count: number
  games_count: number
  customer: Customer
}

export interface Customer {
  uuid: string
  firstname: string
  lastname: string
  uniqueID: string
  avatar: string
  email: string
  phone_number: string
  landmark?: string
  lga?: string
  area?: string
  referral_link: string
  notification_setting: NotificationSetting
}

export interface NotificationSetting {
  uuid: string
  user_id: string
  push_notification: string
  email_notification: string
  game_draw: string
  game_result_winners: string
  game_suggestions: string
  new_games: string
  payment_transactions: string
  promotional: string
  account_security: string
  created_at: string
  updated_at: string
}

export interface Link {
  url?: string
  label: string
  active: boolean
}

const breadCrumbs: Crumb[] = [
  { label: "Raffle Management", to: "/admin/raffles" },
  { label: "Raffle List" },
];

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

const tabs: TabSwitcherTab[] = [
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

function TransactionList() {
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const [raffleId, setRaffleId] = useState<string | null>("");
  const [categoryId, setCategoryId] = useState<string | null>("");
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const [platform, setPlatform] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const {
    data: categoriesResponse,
    isError: isErrorCategories,
    error: categoriesError,
  } = useFetchData(
    `admin/game-management/category/all?paginate=0&limit=10&page=1`
  );

  const {
    data: rafflesResponse,
    isError: isErrorRaffles,
    error: rafflesError,
  } = useFetchData(
    `admin/game-management/game-list/all?paginate=0&limit=10&page=1`
  );

  const baseUrl = `admin/transaction-management/all-transactions?paginate=1&limit=10&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&game_id=${raffleId}&game_category_id=${categoryId}&platform=${platform || ""}&payment_status=${filterBy || ""}&start_date=${startDate}&end_date=${endDate}`;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`${baseUrl}`);
  const exportTransactionsMutation = useGetExportData(`${baseUrl}&export=1`);

  const raffles: Raffle[] = rafflesResponse?.data;
  const rafflesData = (() => {
    if (!raffles) return [{ value: "", label: "Game: All" }];

    return [
      { value: "", label: "Game: All" },
      ...raffles.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  const categories: GameCategory[] | undefined =
    categoriesResponse?.data?.records;

  const categoriesData = (() => {
    if (!categories) return [{ value: "", label: "Game Category: All" }];

    return [
      { value: "", label: "Game Category: All" }, // 👈 empty option first
      ...categories.map((item) => ({
        value: item.uuid,
        label: item.name,
      })),
    ];
  })();

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed To Fetch Transactions",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    setTransactions([]);
    if (response) {
      setTransactions(response.data?.records?.data);
      setCurrentPage(response.data?.records?.current_page || 1);
      setTotal(response.data?.records?.total || 0);
      setPageSize(response.data?.records?.per_page || 10);
    }
  }, [error, isError, response]);

  useEffect(() => {
    if (isErrorCategories) {
      notifications.show({
        title: "Failed to fetch raffle categories",
        message:
          (categoriesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isErrorCategories, categoriesError]);

  useEffect(() => {
    if (isErrorRaffles) {
      notifications.show({
        title: "Failed to fetch raffles",
        message:
          (rafflesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [isErrorRaffles, rafflesError]);

  const handleExport = () => {
    exportTransactionsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_export_${new Date()
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

  return (
    <div className="pb-5">
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between" gap={15} wrap="wrap">
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                Raffle Transaction List
              </Title>
              <Text className="!text-secondary-text">
                List of all game transactions all in one place
              </Text>
            </div>
            <Group gap={10}>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                rightSection={<FaAngleDown />}
                placeholder="Game Category: "
                data={categoriesData}
                className="!shadow-md"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
              <Select
                value={raffleId}
                onChange={setRaffleId}
                rightSection={<FaAngleDown />}
                placeholder="Game: "
                data={rafflesData}
                className="!shadow-md"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />

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
        </div>
      </Card>

      <div className="!text-primary-text mb-5 px-6 md:px-10">
        <Card withBorder radius={"md"} px={0} my="xl">
          <Flex
            justify={"space-between"}
            px="md"
            gap={"sm"}
            direction={{ base: "column", xs: "row" }}
          >
            <Box>
              <Text tt="capitalize" fz={"lg"} fw={600}>
                Transaction List
              </Text>
              <Text className="!text-secondary-text !text-xs !capitalize">
                Show customer transaction for game
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
                tabs={tabs}
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

          <TransactionTable isLoading={isLoading} transactions={transactions} />

          <TablePaginator
            currentPage={currentPage}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            onPageChange={setFilterPage}
          />
        </Card>
      </div>
    </div>
  );
}

export default TransactionList;
