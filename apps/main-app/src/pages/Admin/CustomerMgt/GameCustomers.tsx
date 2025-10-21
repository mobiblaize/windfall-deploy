import {
  Card,
  Flex,
  Button,
  Divider,
  TextInput,
  Text,
  Box,
  Group,
  Select,
} from "@mantine/core";
import { FaFileArrowDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import TablePaginator from "../../../components/TablePaginator";
import type { TabSwitcherTab } from "../../../components/TabSwitcher";
import TabSwitcher from "../../../components/TabSwitcher";
import TransactionTable from "../TransactionMgt/TransactionTable";
import type { RaffleTransaction } from "../TransactionMgt/TransactionList";

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

function GameCustomers() {
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const [platform, setPlatform] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const baseUrl = `admin/transaction-management/all-transactions?paginate=1&limit=10&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&platform=${platform || ""}&payment_status=${filterBy || ""}`;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`${baseUrl}`);
  const exportTransactionsMutation = useGetExportData(`${baseUrl}&export=1`);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed To Fetch Transactions",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setTransactions(response.data?.records);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);
  
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
    <div>
      <Card withBorder radius={"md"} px={0} my="xl">
        <Flex
          justify={"space-between"}
          px="md"
          gap={"sm"}
          direction={{ base: "column", xs: "row" }}
        >
          <Box>
            <Text tt="capitalize" fz={"lg"} fw={600}>
              Game Customer List
            </Text>
            <Text className="!text-secondary-text !text-xs !capitalize">
              Show customer across purchase channel.
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
  );
}

export default GameCustomers;
