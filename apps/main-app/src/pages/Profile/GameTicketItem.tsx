import { Box, Button, Text } from "@mantine/core";
import { HiMiniTicket } from "react-icons/hi2";
import CustomTickets from "../../components/CustomTickets";

type Props = {
  item: any;
  status?: "won" | "lost";
  containerBgColor?: string;
  handleClick?: () => void;
};

function GameTicketItem({ item, status, containerBgColor, handleClick }: Props) {
	console.log(status);
	
  // conditional styles
  status = status ?? "lost";
  const isWon = status === "won";

  const borderColor = isWon ? "!border-primary-green" : "!border-primary-red";
  const statusBgColor = isWon ? "bg-white" : "bg-secondary-red";
  const bgColor = isWon ? "!bg-[#F6FEF9]" : "bg-white";
  const btnBorder = isWon ? "!border-primary-green" : "!border-primary-red";
  const btnBg = isWon ? "!bg-secondary-green" : "!bg-secondary-red";
  const btnText = isWon ? "!text-primary-green" : "!text-primary-red";
  const ticketText = isWon ? "!text-primary-green" : "!text-primary-red";

  return (
    <CustomTickets
      key={item}
      className={borderColor}
      borderColor={borderColor}
	  containerBgColor={containerBgColor}
      bgColor={bgColor}
      cardClick={handleClick}
    >
      <Text fw={700} fz="lg">
        {item} Bed Room Flat at Banana Island, Lagos State, Nigeria
      </Text>

      <Text c="dimmed" fz="sm" mb="xl">
        Win 3 bed room flat at the high prestige location
      </Text>

      <Box
        className={`${statusBgColor} py-2 rounded-lg border-dashed border ${borderColor} text-center`}
      >
        <Text fz="sm" mb={5}>
          Ticket Number
        </Text>
        <Text fw={700} fz="xl" className={ticketText}>
          #WF100423X8
        </Text>
      </Box>

      <Box mt={24} className="flex items-center !justify-center">
        <Button
          rightSection={<HiMiniTicket />}
          className={`!tracking-wide !capitalize !rounded-2xl !border !border-dashed ${btnBorder} ${btnBg} ${btnText} !h-8`}
        >
          {status}
        </Button>
      </Box>
    </CustomTickets>
  );
}

export default GameTicketItem;
