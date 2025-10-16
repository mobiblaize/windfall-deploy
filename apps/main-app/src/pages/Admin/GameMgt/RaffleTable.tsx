import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Box,
  Text,
  Button,
  Divider,
  TextInput,
  Group,
  Select,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Raffle } from "./RaffleList";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { format } from "date-fns";
import { colorMap } from "../../../models/raffles";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";

export function RaffleTable() {
  const navigate = useNavigate();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `admin/game-management/game-list/all?paginate=1&limit=10&search=${debouncedSearch}&page=1&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
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
    }
  }, [error, isError, response]);

  return (
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
              a list of raffles on the system
            </Text>
          </Box>
          <Group>
            <Button
              className="!border-[#D0D5DD] !text-secondary-text !capitalize"
              size="sm"
              variant="outline"
              rightSection={
                <div className="!inline-flex !bg-secondary-text p-1 w-fit rounded-md">
                  <GoArrowUpRight className="!text-white" />
                </div>
              }
              onClick={() => navigate("list")}
            >
              view all
            </Button>
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
      </Card>
    </div>
  );
}
