import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Avatar,
  Divider,
  Group,
  Button,
  Box,
  TextInput,
  Select,
  Skeleton,
  SimpleGrid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import {
  useFetchData,
  useGetData,
  useGetExportData,
} from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import TablePaginator from "../../../components/TablePaginator";
import TransactionTable from "../TransactionMgt/TransactionTable";
import type { RaffleTransaction } from "../TransactionMgt/TransactionList";
import { format } from "date-fns";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import EmptyState from "../../../components/EmptyState";

const breadCrumbs: Crumb[] = [
  { label: "Customer Management", to: "/admin/customers" },
  { label: "View Customer Details" },
];

export interface CustomerDetails {
  user: Customer;
  stats: CustomerStats;
}
export interface Customer {
  uuid: string;
  uniqueID: string;
  email: string;
  phone_number: string;
  avatar: string;
  created_at: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: string;
  lga: string;
  area: string;
  spend_limit_status: string;
  referral_code: string;
  referral_link: string;
  referral_balance: string;
  exclusion_type: string;
  exclude_till: string;
  biometrics: string;
  notification_setting: NotificationSetting;
}

export interface NotificationSetting {
  uuid: string;
  user_id: string;
  push_notification: string;
  email_notification: string;
  game_draw: string;
  game_result_winners: string;
  game_suggestions: string;
  new_games: string;
  payment_transactions: string;
  promotional: string;
  account_security: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  successful_orders: number;
  games_played: number;
  games_played_percentage_increase: number;
  total_ticket_value: number;
  total_ticket_count: number;
  ticket_count_percentage_increase: number;
  average_entries_per_order: number;
  average_entries_per_game: number;
  total_wins: number;
}


  // Helper function to handle empty values
const getValueOrPlaceholder = (value: string | null | undefined): string => {
  if (!value || value.trim() === "") {
    return "N/A";
  }
  return value;
};


export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>();
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  // Helper function to get full name with fallback
  const getFullName = (): string => {
    const firstName = customerDetails?.user?.firstname?.trim() || "";
    const lastName = customerDetails?.user?.lastname?.trim() || "";
    if (!firstName && !lastName) {
      return "N/A";
    }
    return `${firstName} ${lastName}`.trim();
  };

  const transactionsQuery = useGetData(
    `admin/customer-management/all-customer-orders?customer_id=${id}&paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportTransactionsQuery = useGetExportData(
    `admin/customer-management/all-customer-orders?customer_id=${id}&paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  const {
    data: customerDetailsResponse,
    isLoading,
    isError,
    error,
  } = useFetchData(`admin/customer-management/view-customer/${id}`);

  useEffect(() => {
    setFilterPage(1);
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sortBy, filterBy]);

  function onPageChange(page: number) {
    setFilterPage(page);
    fetchTransactions();
  }

  async function fetchTransactions() {
    setTransactions([]);
    try {
      const response = await transactionsQuery.mutateAsync();
      setTransactions(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch customer transactions",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  // react to fetch result
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Customer",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (customerDetailsResponse) {
      setCustomerDetails(customerDetailsResponse.data);
    }
  }, [error, isError, customerDetailsResponse]);

  const handleExport = () => {
    exportTransactionsQuery.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `customer_transactions_export_${new Date()
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
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2 mb-7">
          <Flex justify="space-between" align="center">
            <div>
              {isLoading ? (
                <Skeleton height={35} width="100%" />
              ) : (
                <Title className="!text-primary-text text-2xl" order={2}>
                  {getFullName()}
                </Title>
              )}

              <Text className="!text-secondary-text">
                View and manage customer details
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-10 pt-10 pb-10 ">
        {!isLoading && !customerDetails?.user ? (
          <EmptyState
            title="Customer Not Found"
            description="The customer details you're looking for could not be found."
            format="secondary"
            fullWidth={true}
          />
        ) : (
          <Card
            shadow="sm"
            radius="lg"
            p="lg"
            className="w-full rounded-2xl border !mb-10 border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <Avatar
                src={customerDetails?.user?.avatar}
                alt="Profile"
                radius="md"
                size={40}
                className="!border-3 border-primary-red rounded-lg"
              />
              <Text className="!font-semibold !text-base !text-primary-text">
                Customer Details
              </Text>
            </div>

            <Divider c="#EFEEF2" className="mb-6" />

          {/* Details Grid */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">Customer Name</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {getFullName()}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Customer ID</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {getValueOrPlaceholder(customerDetails?.user?.uniqueID)}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="mantine-md:border-l mantine-md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Email</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {getValueOrPlaceholder(customerDetails?.user?.email)}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">
                Phone Number
              </Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {getValueOrPlaceholder(customerDetails?.user?.phone_number)}
                </Text>
              )}
            </Grid.Col>
          </Grid>

          <Grid
            gutter="xl"
            className="md:mt-8 mb-4 pt-8 md:!border-t md:!border-gray-200"
          >
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">
                Onboarded Date  
              </Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {customerDetails?.user?.created_at
                    ? format(new Date(customerDetails?.user?.created_at), "MMMM d, yyyy")
                    : "N/A"}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">L.G.A</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {getValueOrPlaceholder(customerDetails?.user?.lga)}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">State</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  Lagos State
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Last Active</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {customerDetails?.user?.created_at
                    ? format(new Date(customerDetails?.user?.created_at), "MMMM d, yyyy h:mm a")
                    : "N/A"}
                </Text>
              )}
            </Grid.Col>
          </Grid>
          </Card>
        )}

        {/* Game History Overview - Dynamic and uses loading state */}
        {!isLoading && !customerDetails?.stats ? (
          <Card
            shadow="sm"
            radius="lg"
            p="lg"
            className="w-full rounded-2xl border !mb-10 border-gray-200"
          >
            <Box>
              <Text tt="capitalize" fz={"lg"} fw={600}>
                Game History Overview
              </Text>
              <Text className="!text-secondary-text !text-xs !capitalize">
                An insight into the customers for this draw.
              </Text>
            </Box>
            <Divider my="md" />
            <Box className="text-center py-8">
              <Text className="!text-secondary-text" fz="sm">
                No game statistics available for this customer yet.
              </Text>
            </Box>
          </Card>
        ) : (
          <Card
            shadow="sm"
            radius="lg"
            p="lg"
            className="w-full rounded-2xl border !mb-10 border-gray-200"
          >
            <Box>
              <Text tt="capitalize" fz={"lg"} fw={600}>
                Game History Overview
              </Text>
              <Text className="!text-secondary-text !text-xs !capitalize">
                An insight into the customers for this draw.
              </Text>
            </Box>
            <Divider my="md" />
            <Box mb={"lg"}>
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className="!text-secondary-text !flex !items-center !gap-x-2"
              >
                Total Number of Game Played{" "}
                <span>
                  <PiQuestionThin />
                </span>
              </Text>
              {isLoading ? (
                <Skeleton height={38} width={96} mb="lg" />
              ) : (
                <Text className="!text-primary-red" fz={32} fw={600} mb="xs">
                  {customerDetails?.stats?.games_played?.toLocaleString() ?? 0}
                </Text>
              )}
              {isLoading ? (
                <Skeleton height={18} width={180} />
              ) : (
                <Text
                  tt="capitalize"
                  fz="sm"
                  fw={600}
                  className="!text-secondary-text !item-center !flex !gap-2"
                  mb={5}
                >
                  <AiFillExclamationCircle />
                  <span className="!text-primary-green">
                    {(customerDetails?.stats?.games_played_percentage_increase ?? 0).toFixed(1)}%
                  </span>{" "}
                  increase over the last 30 days
                </Text>
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
              {/* Historical Ticket Purchased */}
              <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
                <Text
                  tt={"capitalize"}
                  fz={"sm"}
                  className=" !flex !items-center !gap-x-2"
                >
                  Historical Ticket Purchased
                </Text>
                {isLoading ? (
                  <Skeleton height={34} width={72} mb="lg" />
                ) : (
                  <Text fw={700} className="!text-primary-text" fz={28}>
                    {(customerDetails?.stats?.total_ticket_count ?? 0).toLocaleString()}
                  </Text>
                )}
                {isLoading ? (
                  <Skeleton height={18} width={140} />
                ) : (
                  <Text tt="capitalize" fz="sm">
                    <span className="!text-primary-green">
                      {(customerDetails?.stats?.ticket_count_percentage_increase ?? 0).toFixed(1)}%
                    </span>{" "}
                    increase in the last 3 days
                  </Text>
                )}
              </Box>
              {/* Average Number of Ticket (Using average_entries_per_order) */}
              <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
                <Text
                  tt={"capitalize"}
                  fz={"sm"}
                  className=" !flex !items-center !gap-x-2"
                >
                  Average Number of Ticket
                </Text>
                {isLoading ? (
                  <Skeleton height={28} width={52} mb="lg" />
                ) : (
                  <Text
                    fw={700}
                    className="!text-primary-text"
                    fz={22}
                    tt="capitalize"
                  >
                    {customerDetails?.stats?.average_entries_per_order ?? 0}
                  </Text>
                )}
                {isLoading ? (
                  <Skeleton height={18} width={140} />
                ) : (
                  <Text tt="capitalize" fz="sm">
                    <span className="!text-primary-green">
                      {(customerDetails?.stats?.ticket_count_percentage_increase ?? 0).toFixed(1)}%
                    </span>{" "}
                    increase in the last 3 days
                  </Text>
                )}
              </Box>
              {/* Number of Win */}
              <Box className="sm:!border-b-0  !border-secondary-text/40 py-3 sm:py-0">
                <Text
                  tt={"capitalize"}
                  fz={"sm"}
                  className=" !flex !items-center !gap-x-2"
                >
                  Number of Win
                </Text>
                {isLoading ? (
                  <Skeleton height={28} width={40} mb="lg" />
                ) : (
                  <Text fw={700} className="!text-primary-text" fz={22}>
                    {customerDetails?.stats?.total_wins ?? 0}
                  </Text>
                )}
              </Box>
            </SimpleGrid>
          </Card>
        )}

        {customerDetails?.user && (
          <section className="text-primary-text">
            <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            <Flex className="text-secondary-text" justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  Customer Game History
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage the game history of customer on Windfall platform
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportTransactionsQuery?.isPending}
                disabled={exportTransactionsQuery?.isPending}
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
                  data={[
                    { value: "approved", label: "Approved" },
                    { value: "pending", label: "Pending" },
                    { value: "declined", label: "Declined" },
                  ]}
                  className="!shadow-md"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Group>
            </Flex>

            <TransactionTable
              isLoading={transactionsQuery.isPending}
              transactions={transactions}
            />

            <TablePaginator
              currentPage={currentPage}
              isLoading={transactionsQuery.isPending}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        </section>
        )}
      </div>

    </div>
  );
}
