import { Container, Flex, Select, SimpleGrid, Text } from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import type { Crumb } from "../../components/DynamicBreadCrumbs";
import { useEffect, useState } from "react";
import GameTicketItem from "./GameTicketItem";
import type { ExtendedRaffle, OrderTicket } from "./GamesTickets";
import { useFetchData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Paginator from "../../components/Paginator";
import GameBadge from "../../components/GameBadge";

type ContextType = { setCrumbs: React.Dispatch<React.SetStateAction<Crumb[]>> };
const items: Crumb[] = [
  { label: "Game Results", to: "/profile/result" },
  { label: "View Specific Game Result" },
];

function GameResultsTickets() {
  const [includeUnassigned, setIncludeUnassigned] = useState<string>("false");
  const [tickets, setTickets] = useState<OrderTicket[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [game, setGame] = useState<ExtendedRaffle>();
  const { setCrumbs } = useOutletContext<ContextType>();
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/games/order/details/${id}/tickets?page=${filterPage}&limit=${12}&include_unassigned=${includeUnassigned}`
  );

  useEffect(() => {
    setCrumbs(items);
  }, [setCrumbs]);

  useEffect(() => {
    setIncludeUnassigned("false");
    setFilterPage(1);
  }, [id]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch order tickets",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
      setTickets([]);
      setTotal(0);
      setGame(undefined);
    }
    if (response) {
      setGame(response.data.game);
      setTickets(response.data?.tickets?.data || []);
      setCurrentPage(response.data?.tickets?.current_page || 1);
      setTotal(response.data?.tickets?.total || 0);
      setPageSize(response.data?.tickets?.per_page || 10);
    }
  }, [error, isError, response]);

  const isInstant = game?.status === "instant" || game?.instant_game === "true";

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  return (
    <div>
      <MyGameHeader
        count={total}
        title="game result"
        description="A list of result pertaining to your games"
      >
        {isInstant && (
          <Flex gap={10}>
            <Select
              data={[
                { value: "true", label: "Show All" },
                { value: "false", label: "My tickets" },
              ]}
              value={includeUnassigned}
              onChange={(value) => {
                setIncludeUnassigned(value as string);
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
          </Flex>
        )}
      </MyGameHeader>
      <Container size="xl" fluid className="!px-6 md:!px-16" mt={32}>
        {isLoading && (
          <LoadingState description="Fetching your games tickets." />
        )}
        {!isLoading && (
          <>
            <Flex
              align="center"
              justify="space-between"
              className="gap-x-10 gap-y-5 my-10 flex-wrap md:flex-nowrap"
            >
              <div>
                <Text className="!text-2xl !font-semibold">
                  {game?.name}:{" "}
                  <span className="text-primary-red">({total} Ticket)</span>
                </Text>
                <Text className="!text-secondary-text">
                  {game?.description}
                </Text>
              </div>

              {game && (
                <div className="text-nowrap">
                  <GameBadge
                    date={game?.start_date}
                    status={game?.status}
                    gameType={isInstant ? "instant" : "raffle"}
                  />
                </div>
              )}
            </Flex>
            <SimpleGrid
              py="lg"
              cols={{ base: 1, md: 2 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {tickets.map((item) => {
                return (
                  <GameTicketItem
                    game={game as ExtendedRaffle}
                    item={item}
                    key={item.uuid}
                  />
                );
              })}
            </SimpleGrid>
            {!tickets.length && (
              <EmptyState
                description="No tickets found"
                title="No Tickets Found"
              />
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

export default GameResultsTickets;
