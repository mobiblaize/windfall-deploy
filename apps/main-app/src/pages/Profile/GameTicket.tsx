import { Box, Button, Flex, Text } from "@mantine/core";
import { HiMiniTicket } from "react-icons/hi2";
import CustomTickets from "../../components/CustomTickets";
import type { OrderTicket } from "./GamesTickets";
import type { Raffle } from "../../models/raffles";
import InstantBadge from "../raffles/InstantBadge";

type Props = {
  item: OrderTicket;
  game: Raffle;
  status?: "won" | "lost" | "pending" | "yet to be won";
  containerBgColor?: string;
  handleClick?: () => void;
};

function GameTicket({
  item,
  game,
  containerBgColor,
  handleClick,
}: Props) {
  // conditional styles
  const isWon = item.status === "won";
  const isPending = (item.status !== "won") && (item.status !== "lost");

  const borderColor = isWon ? "!border-primary-green" : "!border-primary-red";
  const statusBgColor = isWon ? "bg-white" : "bg-secondary-red";
  const bgColor = isWon ? "!bg-[#F6FEF9]" : "bg-white";
  const btnBorder = isWon ? "!border-primary-green" : "!border-primary-red";
  const btnBg = isWon ? "!bg-secondary-green" : "!bg-secondary-red";
  const btnText = isWon ? "!text-primary-green" : "!text-primary-red";
  const ticketText = isWon ? "!text-primary-green" : "!text-primary-red";
  const isInstant = game?.instant_game === "true";

  return (
    <>
      <CustomTickets
        key={item.uuid}
        className={borderColor}
        borderColor={borderColor}
        containerBgColor={containerBgColor}
        bgColor={bgColor}
        cardClick={handleClick}
      >
        <Flex justify="space-between" mb="xl" gap={10} wrap={"wrap"}>
          <div>
            <Text fw={700} fz="lg">
              {game.name}
            </Text>

            <Text c="dimmed" fz="sm">
              {game.description}
            </Text>
          </div>
          {isInstant && <InstantBadge size="sm" />}
        </Flex>

        <Box
          className={`${statusBgColor} py-2 rounded-lg border-dashed border ${borderColor} text-center`}
        >
          <Text fz="sm" mb={5}>
            Ticket Number
          </Text>
          <Text fw={700} fz="xl" className={ticketText}>
            {item.ticket_number}
          </Text>
        </Box>

        <Box
          mt={24}
          className={`flex items-center !justify-center${isPending ? " !opacity-0" : ""}`}
        >
          <Button
            rightSection={<HiMiniTicket />}
            className={`!tracking-wide !capitalize !rounded-2xl !border !border-dashed ${btnBorder} ${btnBg} ${btnText} !h-8`}
          >
            {item.status}
          </Button>
        </Box>
      </CustomTickets>
    </>
  );
}

export default GameTicket;
