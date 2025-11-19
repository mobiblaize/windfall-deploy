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

interface PrizeClaimStats {
  total: number;
  claimed: number;
  claimedInLast7days: number;
  unclaimed: number;
  unclaimedInLast7days: number;
  nullified: number;
  announced: number;
  unannounced: number;
  period_in_days: string;
}

type PrizeClaimStatsCard = {
  title: string;
  value: number;
  slug: "claimed" | "unclaimed";
  added: "claimedInLast7days" | "unclaimedInLast7days";
  className: string;
  color: string;
  period: string;
};

export interface PrizeClaim {
  uuid: string;
  game_name: string;
  game_id: string;
  game_category: string;
  draw_index: string;
  prize_won: string;
  announce_status: string;
  status: string;
  claim_approval_status: string;
  claim_date: string;
  won_at: string;
  customer: PrizeClaimCustomer;
}

export interface PrizeClaimCustomer {
  uuid: string;
  firstname: string;
  lastname: string;
  avatar: string | null;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const prizeClaimCards: PrizeClaimStatsCard[] = [
  {
    title: "Total Prize Claimed",
    value: 0,
    slug: "claimed",
    added: "claimedInLast7days",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    period: "7 days",
  },
  {
    title: "Pending Prize to be Claimed",
    value: 0,
    slug: "unclaimed",
    added: "unclaimedInLast7days",
    className:
      "!bg-primary-warning/10 !text-primary-warning/50 !border-primary-warning/50 ",
    color: "!text-primary-warning",
    period: "7 days",
  },
];

const prizeClaimTabs: TabSwitcherTab[] = [
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
  const [prizeClaims, setPrizeClaims] = useState<PrizeClaim[]>([]);
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const navigate = useNavigate();

  const {
    data: prizeClaimsStatsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useFetchData(
    `admin/prize-claim-management/stats?start_date=${startDate}&end_date=${endDate}`
  );

  const {
    data: prizeClaimsResponse,
    isLoading: isLoadingPrizeClaims,
    isError: isErrorPrizeClaims,
    error: prizeClaimsError,
  } = useFetchData(
    `admin/prize-claim-management/all?search=${debouncedSearch}&limit=${pageSize || 10}&sort_by=${sortBy || "DESC"}&status=${statusFilter || ""}&start_date=${startDate}&end_date=${endDate}&export=0&paginate=1&page=${filterPage}`
  );

  const exportPrizeClaimsMutation = useGetExportData(
    `admin/prize-claim-management/all?search=${debouncedSearch}&limit=${pageSize || 10}&sort_by=${sortBy || "DESC"}&status=${statusFilter || ""}&start_date=${startDate}&end_date=${endDate}&export=1&paginate=1&page=${filterPage}`
  );

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch prize claim stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  useEffect(() => {
    if (isErrorPrizeClaims) {
      notifications.show({
        title: "Failed to fetch prize claims",
        message:
          (prizeClaimsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    if (prizeClaimsResponse) {
      setPrizeClaims(prizeClaimsResponse.data?.records?.data);
      setCurrentPage(prizeClaimsResponse.data?.records?.current_page || 1);
      setTotal(prizeClaimsResponse.data?.records?.total || 0);
      setPageSize(prizeClaimsResponse.data?.records?.per_page || 10);
    }
  }, [prizeClaimsError, isErrorPrizeClaims, prizeClaimsResponse]);

  const handleExportPrizeClaims = () => {
    exportPrizeClaimsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `prize_claims_export_${new Date()
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

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to Load Prize Claim Stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  const prizeClaimStats: PrizeClaimStats = prizeClaimsStatsResponse?.data;

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
                Prize Claim Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                A snapshot of all customer prize claim activity
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

          {/* === Skeleton for total prize claims === */}
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
                  {prizeClaimStats?.total ?? 0}
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
                : prizeClaimCards.map((item) => (
                    <PrizeClaimGridCard
                      key={item.slug}
                      {...{
                        ...item,
                        value: prizeClaimStats?.[item.slug],
                        period: prizeClaimStats?.period_in_days,
                        added: prizeClaimStats?.[item.added],
                      }}
                    />
                  ))}
            </SimpleGrid>
          </section>
        </Card>

        {/* === Prize Claim Table List === */}

        <section className="text-primary-text my-10">
          <Card withBorder mt={"xl"} radius={"md"} p={0}>
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-green">
                  Prize Claim List
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage prize claims on the system
                </Text>
              </div>
              <Group>
                <Button
                  variant="outline"
                  className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                  rightSection={<HiDocumentArrowDown />}
                  onClick={handleExportPrizeClaims}
                  loading={exportPrizeClaimsMutation?.isPending}
                  disabled={exportPrizeClaimsMutation?.isPending}
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
                  tabs={prizeClaimTabs}
                  activeTab={statusFilter}
                  onChange={setStatusFilter}
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
                { label: "Raffle Details", key: "game" },
                { label: "Game Category", key: "category" },
                { label: "Raffle Draw Winner", key: "winner" },
                { label: "Prize Won", key: "prize" },
                { label: "Draw Index", key: "draw" },
                { label: "Claim Date", key: "date" },
                { label: "Status", key: "status" },
                { label: "Approval Status", key: "approval" },
                { label: "", key: "action" },
              ]}
              data={prizeClaims}
              loading={isLoadingPrizeClaims}
              emptyMessage="No prize claims found"
              renderItems={(claim) => [
                <>
                  <Text className="!text-base !font-medium !capitalize">
                    {claim.game_name}
                  </Text>
                  <Text className="!text-secondary-text !text-sm !capitalize">
                    {claim.game_id}
                  </Text>
                </>,
                claim.game_category,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {claim.customer?.firstname} {claim.customer?.lastname}
                  </Text>
                </>,
                claim.prize_won,
                claim.draw_index,
                claim?.claim_date
                  ? format(new Date(claim.claim_date), "MMMM d, yyyy h:mm a")
                  : "-",
                <CustomBadge
                  status={claim.status === "claimed" ? "successful": claim.status === "submitted" ? "inactive" : "pending"}
                  label={claim.status}
                />,
                <CustomBadge
                  status={
                    claim?.claim_approval_status === "approved"
                      ? "successful"
                      : claim?.claim_approval_status === "pending"
                        ? "pending"
                        : "failed"
                  }
                  label={claim?.claim_approval_status}
                />,

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
              isLoading={isLoadingPrizeClaims}
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

type PrizeClaimGridCardProps = Omit<PrizeClaimStatsCard, "added"> & {
  added?: number;
};

function PrizeClaimGridCard({
  title,
  value,
  added,
  className,
  color,
  period,
}: PrizeClaimGridCardProps) {
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
          Added in last {period ?? "7 days"}
        </Text>
      </Stack>
    </Card>
  );
}
