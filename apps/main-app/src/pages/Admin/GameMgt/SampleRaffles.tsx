import {
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
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { Raffle } from "./RaffleList";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { GoArrowUpRight } from "react-icons/go";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";
import RaffleTable from "./RaffleTable";

interface SampleRafflesProps {
  isInstantRaffleRoute?: boolean;
}

export default function SampleRaffles({ isInstantRaffleRoute = false }: SampleRafflesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  
  // Determine base route for relative navigation
  const baseRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles") ? "/admin/instant-raffles" : "/admin/raffles";
  }, [location.pathname]);

  // Build API URL with instant_game param when needed
  const apiUrl = useMemo(() => {
    const baseUrl = `admin/game-management/game-list/all?paginate=1&limit=10&search=${debouncedSearch}&page=1&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`;
    if (isInstantRaffleRoute) {
      return `${baseUrl}&instant_game=true`;
    }
    return baseUrl;
  }, [debouncedSearch, sortBy, filterBy, isInstantRaffleRoute]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(apiUrl);

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
              onClick={() => navigate(`${baseRoute}/all`)}
            >
              view all
            </Button>
            <CustomButton
              border={false}
              className="!rounded-lg"
              size="sm"
              onClick={() => navigate(`${baseRoute}/create`)}
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

        <RaffleTable isLoading={isLoading} raffles={raffles} baseRoute={baseRoute} />
      </Card>
    </div>
  );
}
