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
  ActionIcon,
  Badge,
} from "@mantine/core";
import { FaFileArrowDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import type { Crumb } from "../../../components/DynamicBreadCrumbs";
import DynamicBreadcrumbs from "../../../components/DynamicBreadCrumbs";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { format } from "date-fns";
import TablePaginator from "../../../components/TablePaginator";
import { colorMap, type RaffleStatus } from "../../../models/raffles";

export interface Raffle {
  uuid: string;
  name: string;
  uniqueID: string;
  description: string;
  long_description: string;
  category_id: string;
  prize_cost: string;
  percentage_markup: string;
  ticket_price: string;
  total_tickets: number;
  available_tickets: number;
  minimum_ticket_number_purchase: number;
  maximum_ticket_number_purchase: number;
  maximum_ticket_amount_purchase: string;
  discount_type: string;
  discount_percentage: string;
  is_scheduled: string;
  instant_game: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  cta_text: string;
  supporting_text: string;
  competition_details: string;
  sponsorship_details: string;
  other_infomration: string;
  documents: string;
  card_image: string;
  gallery_images: string;
  status: "draft" | "published";
  approvalStatus: string;
  allow_promo_code_usage: string;
  allow_referral_balance_usage: string;
  minimum_referral_balance_amount: string;
  maximum_referral_balance_amount: string;
  is_active: string;
  is_default: string;
  is_featured: string;
  updated_by: string;
  created_at: string;
  total_draws: number;
  total_draw_lines: number;
  completed_draw_lines: number;
  open_draw_lines: number;
  main_active_status: RaffleStatus;
  category: Category;
}

export interface Category {
  uuid: string;
  name: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const breadCrumbs: Crumb[] = [
  { label: "Raffle Management", to: "/admin/raffles" },
  { label: "Raffle List" },
];

function RaffleList() {
  const navigate = useNavigate();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `admin/game-management/game-list/all?paginate=1&limit=10&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );
  const exportRafflesMutation = useGetExportData(
    `admin/game-management/game-list/all?paginate=1&limit=10&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed To Fetch Raffles",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setRaffles(response.data?.data);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);

  const handleExport = () => {
    exportRafflesMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `raffles_export_${new Date()
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
          <Flex mb="lg" justify="space-between">
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                All Raffle
              </Title>
              <Text className="!text-secondary-text">
                Manage all your raffle on the system
              </Text>
            </div>
            <Flex gap={15}>
              <CustomButton
                border={false}
                className="!rounded-lg"
                size="md"
                onClick={() => navigate("/admin/raffles/create")}
                rightSection={
                  <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                    <BsPlus className="!text-xl !text-white" />
                  </div>
                }
              >
                Create New Raffle
              </CustomButton>
            </Flex>
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
                Raffle list
              </Text>
              <Text className="!text-secondary-text !text-xs !capitalize">
                a list of all raffles on the system
              </Text>
            </Box>
            <Button
              rightSection={<FaFileArrowDown />}
              variant="outline"
              className="!border-secondary-text !text-secondary-text"
              onClick={handleExport}
              loading={exportRafflesMutation?.isPending}
              disabled={exportRafflesMutation?.isPending}
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
                  { value: "", label: "All" },
                  { value: "live", label: "Live" },
                  { value: "upcoming", label: "Upcoming Games" },
                  { value: "instant", label: "Instant Games" },
                  { value: "ended", label: "Ended Games" },
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
              { label: "Raffle Name", key: "name" },
              { label: "Raffle Category", key: "category" },
              { label: "Date Created", key: "date" },
              { label: "Raffle Duration", key: "duration" },
              { label: "Raffle Status", key: "main_active_status" },
              { label: "Draw Status", key: "status" },
              { label: "", key: "action" },
            ]}
            data={raffles}
            loading={isLoading}
            renderItems={(raffle: Raffle) => {
              // Calculate days between start_date and end_date
              let duration = "-";
              if (raffle.start_date && raffle.end_date) {
                const start = new Date(raffle.start_date);
                const end = new Date(raffle.end_date);
                duration = `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
              }
              return [
                raffle.name,
                raffle.category.name,
                raffle?.created_at
                  ? format(new Date(raffle.created_at), "MMMM d, yyyy")
                  : "-",
                duration,
                <Badge
                  color={colorMap[raffle.main_active_status]?.bg}
                  radius="md"
                  className="!capitalize !text-sm !h-[22px]"
                  variant="light"
                >
                  {raffle.main_active_status}
                </Badge>,

                <Badge
                  color={
                    raffle.status === "published"
                      ? "green"
                      : raffle.status === "draft"
                        ? "#f79009"
                        : "gray"
                  }
                  radius="md"
                  className="!capitalize !text-sm !h-[22px]"
                  variant="light"
                >
                  {raffle.status}
                </Badge>,
                <ActionIcon
                  onClick={() => navigate(`/admin/raffles/list/${raffle.uuid}`)}
                  size={35}
                  className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                >
                  <GoArrowUpRight />
                </ActionIcon>,
              ];
            }}
          />

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

export default RaffleList;
