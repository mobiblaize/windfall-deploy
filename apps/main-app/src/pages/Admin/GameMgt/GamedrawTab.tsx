import {
  Card,
  SimpleGrid,
  Flex,
  Box,
  Text,
  Avatar,
  Button,
  Group,
  Grid,
  Skeleton,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import StatusBadge from "../../../components/StatusBadge";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import Paginator from "../../../components/Paginator";

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

interface GameDrawProps {
  raffleId?: string;
  startDate?: string;
  endDate?: string;
}

function GamedrawTab({
  raffleId,
  startDate = "",
  endDate = "",
}: GameDrawProps) {
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
          format="secondary"
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
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {winners?.map((item) => (
              <DrawItem key={item.uuid} item={item} />
            ))}
          </SimpleGrid>

          {/* <InstantPrizes raffle={instantRaffle} /> */}

          {total > perPage && (
            <Box mt="xl">
              <Paginator
                currentPage={currentPage}
                isLoading={isLoadingWinners}
                total={total}
                pageSize={pageSize}
                onPageChange={setFilterPage}
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          fullWidth={true}
          title="No Draw Yet"
          description="There is no draw for this game yet"
          format="secondary"
        />
      )}
    </Box>
  );
}

export default GamedrawTab;

function DrawItem({ item }: { item: Winner }) {
  return (
    <Card withBorder radius={"md"}>
      <Box>
        <Text c="var(--primary-red)" tt="capitalize" fw={500} fz={"lg"}>
          {item.prize_name}
        </Text>
        <Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
          game price
        </Text>
      </Box>
      <Box my="lg">
        <Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
          draw pot
        </Text>
        <Text tt="capitalize" fw={500} fz={"md"}>
          5,200 ticket/ticket
        </Text>
      </Box>
      <SimpleGrid cols={2}>
        <Box>
          <Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
            prize distribution
          </Text>
          <Text tt="capitalize" fw={500} fz={"md"}>
            single
          </Text>
        </Box>
        <Box>
          <Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
            draw conducted by
          </Text>
          <Group align={"center"}>
            <Avatar radius="sm" className="border-2 border-primary-red" />
            <Box>
              <Text fz="sm">Adekunle ibrahim</Text>
              <Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
                operation manager
              </Text>
            </Box>
          </Group>
        </Box>
      </SimpleGrid>
      <Box my="md">
        <Text fz="xs" tt="capitalize">
          draw winner
        </Text>
        <Flex justify={"space-between"} align="center">
          <Group>
            <Avatar radius={"sm"} className="border-2 border-primary-red" />
            <Box>
              <Text fz="sm" c="var(--secondary-text)" tt="capitalize">
                Hameedat adekunle
              </Text>
              <Text fz="xs" c="var(--secondary-text)">
                ID:9044| +234903456789
              </Text>
              <StatusBadge status="verified" />
            </Box>
          </Group>
          <Button
            tt="capitalize"
            radius="sm"
            rightSection={<RiArrowRightUpLine />}
            variant="outline"
            className="!border-secondary-text/50 !text-secondary-text/50"
          >
            view details
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}
