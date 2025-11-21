import {
  Select,
  Divider,
  Group,
  Box,
  Flex,
  Text,
  Button,
  TextInput,
  ActionIcon,
  Table,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import "@mantine/dates/styles.css";
import TableContainer from "../../components/TableContainer";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine } from "react-icons/ri";
import { useFetchData, useGetExportData } from "../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import TablePaginator from "../../components/TablePaginator";
import EmptySection from "../../components/EmptySection";
import LoadingState from "../../components/LoadingState";
import { DateInput } from "@mantine/dates";
import { IoClose } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { formatLocalDate } from "../../utils/helper/formatLocalDate";

export interface Transactions {
  uuid: string;
  uniqueID: string;
  customer_id: string;
  platform: string;
  payment_method: string;
  payment_channel: string;
  transaction_id?: string;
  promo_code_id: string;
  reference: string;
  quantity: number;
  total_amount: string;
  paid_amount: string;
  promo_amount: string;
  discount_amount: string;
  referral_balance_amount: string;
  promo_code: string;
  referral_code: string;
  status: string;
  payment_status: string;
  ip_address: string;
  city: string;
  region: string;
  created_at: string;
  updated_at: string;
  order_details_count: number;
  tickets_count: number;
  games_count: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

function TransactionsTab() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<
    "" | "live" | "upcoming" | "instant" | "ended" | "inactive"
  >("");
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/games/orders?paginate=1&filter_by=${statusFilter}&page=${filterPage}&search=${debouncedSearch}&start_date=${startDate}&end_date=${endDate}&limit=${12}`
  );

  const exportTransactionsMutation = useGetExportData(
    `customer/games/orders?paginate=1&filter_by=${statusFilter}&page=${filterPage}&search=${debouncedSearch}&start_date=${startDate}&end_date=${endDate}&limit=${12}&export=1`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Transactions",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });

      setTransactions([]);
      setTotal(0);
    }
    if (response) {
      setTransactions(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

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

  console.log(transactions?.[0]?.updated_at);
  console.log(new Date(transactions?.[0]?.updated_at));

  return (
    <div>
      <MyGameHeader
        title="My Transaction"
        description="Manage your transaction with ease today."
      >
        <div className="flex flex-wrap gap-3 items-center">
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
                  onClick={() => setStartDate("")}
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
        </div>
      </MyGameHeader>
      <Divider />

      <section className="mx-4 sm:mx-10 my-10">
        <Box className="border !border-secondary-text/50 rounded-xl bg-white">
          <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
            <div>
              <Text fz={20} fw="bold">
                Game Transaction List
              </Text>
              <Text className="!text-secondary-text">
                Track and manage transaction with ease.
              </Text>
            </div>
            <Button
              variant="outline"
              className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
              rightSection={<HiDocumentArrowDown />}
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
            <TextInput
              leftSection={<HiSearch />}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="!w-72 !rounded-xl shadow-sm"
            />
            <Group>
              {/* <Select
                rightSection={<IoFilterOutline />}
                placeholder="sort by: show all"
                className="!rounded-xl !shadow-sm"
              /> */}
              <Select
                data={[
                  { value: "", label: "Show All" },
                  { value: "live", label: "Live" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "instant", label: "Instant" },
                  { value: "ended", label: "Ended" },
                  { value: "inactive", label: "Inactive" },
                ]}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value as typeof statusFilter);
                  setFilterPage(1);
                }}
                placeholder="My Games: Show All"
                rightSection={<FaAngleDown />}
                className="w-[180px]"
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
                clearable
              />
            </Group>
          </Flex>

          {isLoading && (
            <LoadingState
              title="Loading transactions..."
              description="Fetching transactions"
            />
          )}

          {!isLoading && (
            <>
              {/* Table for larger screens */}
              <div className="!hidden sm:!block">
                <TableContainer
                  headers={[
                    "Transaction ID",
                    "Transaction date & time",
                    "Transaction value",
                    "Payment channel",
                    "Transaction status",
                    "Receipt",
                  ]}
                >
                  {transactions.map((transaction) => {
                    return (
                      <Table.Tr key={transaction.uuid}>
                        <Table.Td className="text-secondary-text !pr-0 !text-base">
                          {transaction.uniqueID}
                        </Table.Td>
                        <Table.Td>
                          <Text className="!text-base !font-medium">
                            {transaction.updated_at
                              ? formatLocalDate(
                                  transaction.updated_at,
                                  "MMMM d, yyyy"
                                )
                              : ""}
                          </Text>
                          <Text className="!text-secondary-text !text-sm">
                            {transaction.updated_at
                              ? formatLocalDate(
                                  transaction.updated_at,
                                  "h:mm a"
                                )
                              : ""}
                          </Text>
                        </Table.Td>
                        <Table.Td className="!pr-0">
                          {formatCurrency(transaction.paid_amount)}
                        </Table.Td>
                        <Table.Td className="!pr-0">
                          <Text className="!text-base !capitalize">
                            {transaction.payment_method}
                          </Text>
                          <Text className="!text-secondary-text !text-sm- !capitalize">
                            {transaction.payment_channel}
                          </Text>
                        </Table.Td>
                        <Table.Td className="!pr-0">
                          <p
                            className={`py-[2px] px-2 rounded-xl inline-block font-medium ${
                              transaction.payment_status?.toLowerCase() ===
                              "successful"
                                ? "bg-[#CCFBEF] text-[#06B280]" // green
                                : transaction.payment_status?.toLowerCase() ===
                                    "pending"
                                  ? "bg-[#FEF9C3] text-[#B45309]" // yellow
                                  : "bg-[#FEF3F2] text-[#B42318]" // red (failed/others)
                            }`}
                          >
                            {transaction.payment_status}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            onClick={() => navigate(transaction.uuid)}
                            size={35}
                            className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                          >
                            <RiArrowRightUpLine />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </TableContainer>
              </div>

              {/* Card view for small screens */}
              <div className="sm:!hidden space-y-4 p-4">
                {transactions.map((transaction) => {
                  return (
                    <div
                      key={transaction.uuid}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
                    >
                      <p>
                        <strong>Transaction ID:</strong> {transaction.uniqueID}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {transaction.updated_at
                          ? formatLocalDate(
                              transaction.updated_at,
                              "MMMM d, yyyy"
                            )
                          : ""}{" "}
                        —{" "}
                        {transaction.updated_at
                          ? formatLocalDate(transaction.updated_at, "h:mm a")
                          : ""}
                      </p>
                      <p>
                        <strong>Value:</strong>{" "}
                        {formatCurrency(transaction.paid_amount)}
                      </p>
                      <p className="capitalize">
                        <strong>Channel:</strong> {transaction.payment_method} -{" "}
                        {transaction.payment_channel}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`py-[2px] px-2 rounded-xl capitalize inline-block font-medium ${
                            transaction.payment_status?.toLowerCase() ===
                            "successful"
                              ? "bg-[#CCFBEF] text-[#06B280]" // green
                              : transaction.payment_status?.toLowerCase() ===
                                  "pending"
                                ? "bg-[#FEF9C3] text-[#B45309]" // yellow
                                : "bg-[#FEF3F2] text-[#B42318]" // red
                          }`}
                        >
                          {transaction.payment_status}
                        </span>
                      </p>
                      <ActionIcon
                        onClick={() => navigate(transaction.uuid)}
                        size={35}
                        className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                      >
                        <RiArrowRightUpLine />
                      </ActionIcon>
                    </div>
                  );
                })}
              </div>

              {!transactions.length && (
                <EmptySection
                  format="secondary"
                  description="No transactions found"
                  title="No records found"
                />
              )}
            </>
          )}

          <TablePaginator
            currentPage={currentPage}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </Box>
      </section>
    </div>
  );
}

export default TransactionsTab;
