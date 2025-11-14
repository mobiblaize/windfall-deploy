import { Box, Button, Grid, Text, Card, Skeleton } from "@mantine/core";
import CustomTickets from "../../../components/CustomTickets";
import { HiMiniTicket } from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../../components/EmptyState";
import InstantPrizes from "../../raffles/InstantPrizes";
import { transformPrizeGroupsToRafflePrizes } from "../../../utils/helper/transformPrizeGroupsToRafflePrizes";

interface WinnerTabProps {
  raffleId?: string;
  isInstantGame: boolean;
}

export interface WinnersData {
  game: Game;
  summary: Summary;
  prize_groups: PrizeGroup[];
}

export interface Game {
  uuid: string;
  unique_id: string;
  name: string;
  category: Category;
  ticket_price: string;
  instant_game: boolean;
  start_date: string;
  end_date: string;
}

export interface Category {
  uuid: string;
  name: string;
}

export interface Summary {
  total_prizes: number;
  total_tickets: number;
  total_winning_tickets: number;
  total_customers: number;
}

export interface PrizeGroup {
  prize: Prize;
  counts: Counts;
  tickets: Ticket[];
}

export interface Prize {
  uuid?: string;
  name: string;
  image?: string;
  description?: string;
  prize_cost?: string;
}

export interface Counts {
  total_tickets: number;
  winning_tickets: number;
}

export interface Ticket {
  ticket: Ticket2;
  customer?: Customer;
}

export interface Ticket2 {
  uuid: string;
  number: string;
  validation_number: string;
  is_winner: boolean;
  issued_at?: string;
}

export interface Customer {
  uuid: string;
  unique_id: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

function WinnerTab({ raffleId, isInstantGame }: WinnerTabProps) {
  const [winnersData, setWinnersData] = useState<WinnersData>();

  // Build API URL
  const winnersUrl = useMemo(() => {
    if (!raffleId) return null;
    const params = new URLSearchParams();
    params.append("limit", "10");
    return `admin/game-management/game-list/single-game/${raffleId}/winner-list-drill-down?${params.toString()}`;
  }, [raffleId]);

  // Fetch winners
  const {
    data: winnersResponse,
    isLoading: isLoadingWinners,
    isError: isErrorWinners,
    error: winnersError,
  } = useFetchData(winnersUrl);

  // Handle winners response
  useEffect(() => {
    if (isErrorWinners) {
      notifications.show({
        title: "Failed to fetch winners",
        message:
          (winnersError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
      setWinnersData(undefined);
    }

    if (winnersResponse) {
      setWinnersData(winnersResponse?.data);
    }
  }, [isErrorWinners, winnersError, winnersResponse]);

  // Show empty state if no raffle ID
  if (!raffleId) {
    return (
      <Box mt="xl" pb="xl" mx="xl">
        <EmptyState
          fullWidth={true}
          title="No Raffle Selected"
          description="Please select a raffle to view winners"
        />
      </Box>
    );
  }

  return (
    <Box mt="xl" pb="xl" mx="xl">
      {isLoadingWinners ? (
        <Grid columns={5}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid.Col span={{ base: 5, sm: 3 }} key={index}>
              <Card withBorder radius="md" p="lg">
                <Skeleton height={120} mb="md" />
                <Skeleton height={20} width="80%" mb="sm" />
                <Skeleton height={15} width="60%" mb="lg" />
                <Skeleton height={80} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : winnersData?.prize_groups?.length ? (
        <>
          {!isInstantGame && (
            <Grid columns={5}>
              {winnersData?.prize_groups?.map((prizeGroup) => (
                <>
                  {prizeGroup.tickets.map((ticket) => (
                    <Grid.Col
                      span={{ base: 5, sm: 3 }}
                      key={ticket.ticket.uuid}
                    >
                      <WinnerCard
                        prizeName={prizeGroup.prize.name}
                        shortDescription={prizeGroup.prize.description}
                        ticketNumber={ticket.ticket.number}
                      />
                    </Grid.Col>
                  ))}
                </>
              ))}
            </Grid>
          )}

          {isInstantGame && (
            <InstantPrizes
              prizes={transformPrizeGroupsToRafflePrizes(
                winnersData.prize_groups
              )}
            />
          )}
        </>
      ) : (
        <EmptyState
          fullWidth={true}
          format="secondary"
          title="No Winners Announced Yet"
          description="This game is not concluded hence, a winner is yet to be announced."
        />
      )}
    </Box>
  );
}

export default WinnerTab;

function WinnerCard({
  prizeName,
  shortDescription,
  ticketNumber,
}: {
  prizeName?: string;
  shortDescription?: string;
  ticketNumber?: string;
}) {
  return (
    <CustomTickets
      bgColor="bg-secondary-green"
      borderColor="border-primary-green"
    >
      <Text fw={700} fz={20}>
        {prizeName}
      </Text>

      <Text c="dimmed" fz={14} mb="md">
        {shortDescription || "Win this amazing prize"}
      </Text>

      <Box className="bg-white py-2 rounded-lg border-dashed border border-primary-green text-center">
        <Text fz={14} mb={2}>
          Ticket Number
        </Text>
        <Text fw={700} fz={24} className="!text-primary-red">
          {ticketNumber}
        </Text>
      </Box>
      <Box mt={30} className={`flex items-center !justify-center`}>
        <Button
          rightSection={<HiMiniTicket />}
          className={`!tracking-wide !capitalize !rounded-2xl !border !border-dashed !border-primary-green !bg-secondary-green !text-primary-green !h-8`}
        >
          Won
        </Button>
      </Box>
    </CustomTickets>
  );
}
