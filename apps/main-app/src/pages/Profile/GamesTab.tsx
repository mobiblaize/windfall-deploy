import { Select, Divider, Container, SimpleGrid } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import GamesCard from "./GamesCard";
import MyGameHeader from "./MyGameHeader";
import { useFetchData } from "../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import type { Raffle } from "../../models/raffles";
import Paginator from "../../components/Paginator";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export interface RaffleGame {
  uuid: string;
  game_id: string;
  order_id: string;
  quantity: number;
  unit_amount: string;
  total_amount: string;
  paid_amount: string;
  discount_amount: string;
  created_at: string;
  updated_at: string;
  game: Raffle;
}

function GamesTab() {
  const [statusFilter, setStatusFilter] = useState<
    "" | "live" | "upcoming" | "instant" | "ended" | "inactive"
  >("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [games, setGames] = useState<RaffleGame[]>([]);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/games/order-games?paginate=1&filter_by=${statusFilter}&page=${filterPage}&limit=${12}`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Games",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });

      setGames([]);
      setTotal(0);
    }
    if (response) {
      setGames(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  return (
    <div className="">
      <MyGameHeader
        title="game list"
        description="A list of your Games and their respective status"
      >
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
      </MyGameHeader>

      <Divider />

      <Container size="xl" fluid className="!px-6 md:!px-16" my="xl">
        {isLoading && (
          <LoadingState description="Fetching your games from the system." />
        )}

        {!isLoading && (
          <>
            {games.length > 0 && (
              <SimpleGrid
                py="lg"
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing={{ base: 10, sm: "xl" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
              >
                {games.map((game) => (
                  <GamesCard key={game.uuid} game={game} />
                ))}
              </SimpleGrid>
            )}
            {games.length <= 0 && (
              <EmptyState description="No games found" title="No Games Found" />
            )}
          </>
        )}

        <div className="mt-10">
          <Paginator
            currentPage={currentPage}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      </Container>
    </div>
  );
}

export default GamesTab;
