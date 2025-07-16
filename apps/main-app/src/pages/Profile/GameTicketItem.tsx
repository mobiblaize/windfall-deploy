import { Box, Button, Text } from "@mantine/core";
import { HiMiniTicket } from "react-icons/hi2";
import CustomTickets from "../../components/CustomTickets";
type Props = {
	item: any;
	handleClick?: () => void;
};
function GameTicketItem({ item, handleClick }: Props) {
	return (
		<CustomTickets
			key={item}
			className="!border-primary-red"
			borderColor="!border-primary-red"
			cardClick={handleClick}
		>
			<Text fw={700} fz="lg">
				{item} Bed Room Flat at Banana Island, Lagos State, Nigeria
			</Text>

			<Text c="dimmed" fz="sm" mb="xl">
				Win 3 bed room flat at the high prestige location
			</Text>

			<Box className="bg-secondary-red py-2 rounded-lg border-dashed border border-primary-red text-center">
				<Text fz="sm" mb={5}>
					Ticket Number
				</Text>
				<Text fw={700} fz="xl" className="!text-primary-red">
					#WF100423X8)
				</Text>
			</Box>
			<Box mt={24} className="flex items-center !justify-center">
				<Button
					rightSection={<HiMiniTicket />}
					className="!tracking-wide !capitalize !rounded-2xl !border !border-dashed !border-primary-red !h-8 !text-primary-red !bg-secondary-red"
				>
					lost
				</Button>
			</Box>
		</CustomTickets>
	);
}

export default GameTicketItem;
