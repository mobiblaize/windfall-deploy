import { Box, Button, Grid, Text, Card, Skeleton } from "@mantine/core";
import CustomTickets from "../../../components/CustomTickets";
import { HiMiniTicket } from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import Paginator from "../../../components/Paginator";
import EmptyState from "../../../components/EmptyState";

interface WinnerTabProps {
  raffleId?: string;
  startDate?: string;
  endDate?: string;
}

interface Winner {
  uuid: string;
  customer_id: string;
  ticket_id: string;
  prize_name: string;
  status: string;
  announce_status: string;
  approvalStatus: string;
  announced_by_id: string;
  announce_time: string;
  claim_officer_id: string | null;
  claimed_time: string | null;
  short_description: string;
  evidence: string | null;
  document_checklist: string | null;
  won_at: string | null;
  created_at: string;
  prize_cost: string;
  game_uuid: string;
  game_unique_id: string;
  game_name: string;
  game_ticket_price: string;
  claim_date: string | null;
  game_category_uuid: string;
  game_category_name: string;
  ticket: {
    uuid: string;
    customer_id: string;
    ticket_number: string;
  };
  customer: {
    uuid: string;
    firstname: string;
    lastname: string;
    uniqueID: string;
    avatar: string | null;
    referral_link: string;
    total_amount_spent: string;
  };
  game_draw: {
    uuid: string;
    game_id: string;
    prize_id: string;
    game: {
      uuid: string;
      ticket_price: string;
      name: string;
      category_id: string;
      main_active_status: string;
    };
  };
}

function WinnerTab({
  raffleId,
  startDate = "",
  endDate = "",
}: WinnerTabProps) {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  // Build API URL
  const winnersUrl = useMemo(() => {
    if (!raffleId) return null;
    const params = new URLSearchParams();
    params.append("limit", "10");
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    params.append("paginate", "1");
    params.append("page", filterPage.toString());
    params.append("export", "0");
    return `admin/game-management/game-list/single-game/${raffleId}/winner-list?${params.toString()}`;
  }, [raffleId, startDate, endDate, filterPage]);

  // Fetch winners
  const {
    data: winnersResponse,
    isLoading: isLoadingWinners,
    isError: isErrorWinners,
    error: winnersError,
  } = useFetchData(winnersUrl);

  // Reset page to 1 when date filters change
  useEffect(() => {
    setFilterPage(1);
  }, [startDate, endDate]);

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
      setWinners([]);
      setTotal(0);
    }

    if (winnersResponse) {
      const record = winnersResponse.data?.record;
      setWinners(record?.data || []);
      setCurrentPage(record?.current_page || filterPage || 1);
      setPerPage(record?.per_page || 10);
      setTotal(record?.total || 0);
      setPageSize(record?.per_page || 10);
    }
  }, [isErrorWinners, winnersError, winnersResponse, filterPage]);

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
      ) : winners.length ? (
        <>
          <Grid columns={5}>
            {winners?.map((item) => (
              <Grid.Col span={{ base: 5, sm: 3 }} key={item.uuid}>
                <WinnerCard item={item} />
              </Grid.Col>
            ))}
          </Grid>
          {total>perPage && <Box mt="xl">
            <Paginator
              currentPage={currentPage}
              isLoading={isLoadingWinners}
              total={total}
              pageSize={pageSize}
              onPageChange={setFilterPage}
            />
          </Box>}
        </>
      ) : (
        <EmptyState
          fullWidth={true}
          format="secondary"
          title="No Winners Announced Yet"
          description="This game is still live hence, a winner is yet to be announced."
        />
      )}
    </Box>
  );
}

export default WinnerTab;

function WinnerCard({ item }: { item: Winner }) {
  return (
    <CustomTickets
      bgColor="bg-secondary-green"
      borderColor="border-primary-green"
    >
      <Text fw={700} fz={20}>
        {item.prize_name}
      </Text>

      <Text c="dimmed" fz={14} mb="md">
        {item.short_description || "Win this amazing prize"}
      </Text>

      <Box className="bg-white py-2 rounded-lg border-dashed border border-primary-green text-center">
        <Text fz={14} mb={2}>
          Ticket Number
        </Text>
        <Text fw={700} fz={24} className="!text-primary-red">
          {item.ticket.ticket_number}
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
