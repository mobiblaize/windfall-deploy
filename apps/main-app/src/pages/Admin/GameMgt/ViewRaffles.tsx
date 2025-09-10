import { Box, Button, Divider, Flex, Group, Text } from "@mantine/core";
import StatusBadge from "../../../components/StatusBadge";
import { FaCalendarAlt } from "react-icons/fa";
import ViewRafflesTabs from "./ViewRafflesTabs";
import { TakeAction } from "../../../components/FilterMenu";
import DynamicBreadcrumbs, { type Crumb } from "../../../components/DynamicBreadCrumbs";


function ViewRaffles() {

	const breadCrumbs: Crumb[] = [
	{ label: "Raffle Management", to: "/admin/raffles" },
	{ label: "view a raffle", to: "/admin/raffles/list" },
	{ label: "The raffle game name", to: ` ` },
];
	return (
		<div className="text-primary-text">
			<DynamicBreadcrumbs items={breadCrumbs} />
			<Divider />
			<Flex
				px={"lg"}
				my="sm"
				align={{ base: "start", sm: "center" }}
				justify={{ base: "start", sm: "space-between" }}
				gap={{ base: "sm", sm: "lg" }}
				direction={{ base: "column", sm: "row" }}
			>
				<Box>
					<Text tt={"capitalize"} fz={"lg"} fw={"600"}>
						Lekki house raffle, lagos state
					</Text>
					<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
						viewDistribution of Purchase by Channels
					</Text>
				</Box>
				<Group>
					<StatusBadge status="live" />
					<Button
						variant="outline"
						className="!text-secondary-text !border-secondary-text !py-2 scale-90 sm:scale-100"
						rightSection={<FaCalendarAlt className="text-primary-red" />}
					>
						Date: April 2025
					</Button>
					<TakeAction />
				</Group>
			</Flex>
			<ViewRafflesTabs />
		</div>
	);
}

export default ViewRaffles;
