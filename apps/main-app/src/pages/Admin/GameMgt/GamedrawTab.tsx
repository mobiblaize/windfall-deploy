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
  Badge,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import Paginator from "../../../components/Paginator";
import { useNavigate } from "react-router-dom";

interface Winner {
  uuid: string
  customer_id: string
  ticket_id: string
  game_draw_id: string
  game_draw_line_id: string
  prize_name: string
  status: string
  announce_status: string
  approvalStatus: string
  announced_by_id: string
  announce_time: string
  claim_officer_id: string
  claimed_time: string
  short_description: string
  evidence: TemplateStringsArray
  document_checklist: DocumentChecklist[]
  won_at: string
  initiated_by_id: string
  created_at: string
  prize_cost: string
  game_uuid: string
  game_unique_id: string
  game_name: string
  game_ticket_price: string
  claim_date: string
  game_category_uuid: string
  game_category_name: string
  customer: Customer
  game_draw: GameDraw
  game_draw_line: GameDrawLine
  ticket: Ticket
}

export interface DocumentChecklist {
  name: string
  path: string
  description: string
}

export interface Customer {
  uuid: string
  firstname: string
  lastname: string
  uniqueID: string
  avatar: string
  lga: string
  area: string
  phone_number: string
  referral_link: string
  total_amount_spent: string
}

export interface GameDraw {
  uuid: string
  game_id: string
  prize_id: string
  game: Game
}

export interface Game {
  uuid: string
  ticket_price: string
  name: string
  total_tickets: number
  available_tickets: number
  start_date: string
  end_date: string
  main_active_status: string
}

export interface GameDrawLine {
  uuid: string
  game_id: string
  game_draw_id: string
  prize_id: string
  admin_id: string
  customer_id: string
  draw_at: string
  status: string
  approvalStatus: string
  video_url: string
  created_at: string
  prize: Prize
  initiated_by: InitiatedBy
}

export interface Prize {
  uuid: string
  name: string
  image: string
  description: string
  prize_cost: string
}

export interface InitiatedBy {
  uuid: string
  name: string
  avatar: string
  uniqueID: string
  enforce_password_change: boolean
  unread_notifications_count: number
}

export interface Ticket {
  uuid: string
  customer_id: string
  ticket_number: string
}

export interface Link {
  url?: string
  label: string
  active: boolean
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
          <Grid.Col span={{ base: 5, sm: 3 }}>
            <Card withBorder radius="md" p="lg">
              <Skeleton height={120} mb="md" />
              <Skeleton height={20} width="80%" mb="sm" />
              <Skeleton height={15} width="60%" mb="lg" />
              <Skeleton height={80} />
            </Card>
          </Grid.Col>
        </Grid>
      ) : winners.length ? (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {winners?.map((item) => (
              <DrawItem key={item.uuid} winner={item} />
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

function DrawItem({ winner }: { winner: Winner }) {
  const navigate = useNavigate();

  return (
    <Card withBorder radius={"md"}>
      <Box>
        <Text c="var(--primary-red)" tt="capitalize" fw={700} fz={"xl"}>
          {winner.prize_name}
        </Text>
        <Text c="var(--secondary-text)" fz={"sm"} tt="capitalize">
          game prize
        </Text>
      </Box>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Box my="lg">
          <Text c="var(--secondary-text)" fz={"sm"} tt="capitalize">
            draw pot
          </Text>
          <Text tt="capitalize" fw={600} fz={"md"}>
            {(winner.game_draw.game.total_tickets || 0) - (winner.game_draw.game.available_tickets || 0)} tickets
          </Text>
        </Box>
        <Box>
          <Text c="var(--secondary-text)" fz={"sm"} tt="capitalize">
            draw conducted by
          </Text>
          <Group align={"center"}>
            <Avatar radius="md" src={winner.game_draw_line?.initiated_by?.avatar} className="border-2 border-primary-red" />
            <Box>
              <Text fz="sm" fw={600}>
                {winner.game_draw_line?.initiated_by?.name}
              </Text>
              <Text c="var(--secondary-text)" fz={"sm"} tt="capitalize">
                ID:{" "}
                <span className="text-[#575757] font-medium">
                  {winner.game_draw_line?.initiated_by?.uniqueID}
                </span>
              </Text>
            </Box>
          </Group>
        </Box>
      </SimpleGrid>
      <Box my="md">
        <Text fz="sm" c="var(--secondary-text)" tt="capitalize">
          draw winner
        </Text>
        <Flex justify={"space-between"} align="center" gap={15} wrap={"wrap"}>
          <Group>
            <Avatar
              radius={"md"}
              src={winner.customer?.avatar}
              className="border-2 border-primary-red !h-15 !w-15"
            />
            <Box>
              <Text fz="sm" c="var(--secondary-text)" tt="capitalize">
                {winner.customer?.firstname} {winner.customer?.lastname}
              </Text>
              <Text fz="sm" mb={3} c="var(--secondary-text)">
                ID:{" "}
                <span className="text-[#575757] font-medium">
                  {winner.customer?.uniqueID} | {winner.customer?.phone_number}
                </span>
              </Text>
              <Badge
                className="!capitalize"
                style={{
                  backgroundColor: "var(--color-secondary-green)",
                  color: "var(--color-primary-green)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Verified
              </Badge>
            </Box>
          </Group>
          <Button
            tt="capitalize"
            radius="sm"
            rightSection={<RiArrowRightUpLine />}
            onClick={()=>navigate(`/admin/draws/${winner.game_draw_line_id}`)}
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
