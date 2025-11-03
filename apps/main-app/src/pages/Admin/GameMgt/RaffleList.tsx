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
  Select
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
import TablePaginator from "../../../components/TablePaginator";
import { type RaffleStatus } from "../../../models/raffles";
import RaffleTable from "./RaffleTable";

export interface Raffle {
  uuid: string
  name: string
  uniqueID: string
  description: string
  long_description: string
  category_id: string
  prize_cost: string
  percentage_markup: string
  ticket_price: string
  total_tickets: number
  available_tickets: number
  minimum_ticket_number_purchase: number
  maximum_ticket_number_purchase: number
  maximum_ticket_amount_purchase: string
  discount_type: string
  discount_percentage: string
  is_scheduled: string
  instant_game: string
  total_tickets_sold: number
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  cta_text: string
  supporting_text: string
  competition_details: string
  sponsorship_details: string
  other_infomration: string
  documents: string
  card_image: string
  gallery_images: string
  status: string
  approvalStatus: string
  unlocked: string
  allow_promo_code_usage: string
  allow_referral_balance_usage: string
  minimum_referral_balance_amount: string
  maximum_referral_balance_amount: string
  is_active: string
  is_default: string
  is_featured: string
  updated_by: string
  created_at: string
  main_active_status: RaffleStatus
  prizes: RafflePrize[]
  ticket_tiers: TicketTier[]
  category: Category
}

export interface RafflePrize {
  id: number
  uuid: string
  name: string
  prize_cost: string
  description: string
  image: string
  quantity: number
  game_id: string
  created_at: string
  updated_at: string
}

export interface TicketTier {
  uuid: string
  name: string
  number_of_entry_start: number
  number_of_entry_end: number
  discount_percentage: string
  game_id: string
  updated_by: string
  created_at: string
}

export interface Category {
  uuid: string
  name: string
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

          <RaffleTable isLoading={isLoading} raffles={raffles} />

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
