import { Text, Box } from "@mantine/core";
import CustomTickets from "../../components/CustomTickets";

function RaffleGroupItem({ item, onclick }: { item: any; onclick?: any }) {
	return (
		<CustomTickets cardClick={onclick}>
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
		</CustomTickets>
	);
}

export default RaffleGroupItem;
