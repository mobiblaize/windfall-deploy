import { Table, ActionIcon } from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import StatusBadge from "../../../components/StatusBadge";
import { useNavigate } from "react-router-dom";
import RaffleCustomTable from "./RaffleCustomTable";

export function RaffleTable() {
	const elements = [
		{
			raffle_name: "Holiday Bonanza",
			raffle_category: "Travel",
			date_created: "2025-01-10",
			raffle_duration: "14 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Tech Gadget Giveaway",
			raffle_category: "Electronics",
			date_created: "2025-01-15",
			raffle_duration: "30 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Luxury Watch Draw",
			raffle_category: "Fashion",
			date_created: "2025-02-01",
			raffle_duration: "7 days",
			raffle_status: "Closed",
			draw_status: "Completed",
		},
		{
			raffle_name: "Weekend Getaway",
			raffle_category: "Travel",
			date_created: "2025-02-05",
			raffle_duration: "10 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Smartphone Raffle",
			raffle_category: "Electronics",
			date_created: "2025-02-10",
			raffle_duration: "21 days",
			raffle_status: "Upcoming",
			draw_status: "Not started",
		},
		{
			raffle_name: "Back-to-School Pack",
			raffle_category: "Education",
			date_created: "2025-02-12",
			raffle_duration: "15 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Car Raffle 2025",
			raffle_category: "Automobile",
			date_created: "2025-02-15",
			raffle_duration: "60 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Grocery Basket",
			raffle_category: "Lifestyle",
			date_created: "2025-02-18",
			raffle_duration: "5 days",
			raffle_status: "Closed",
			draw_status: "Completed",
		},
		{
			raffle_name: "Fitness Gear Challenge",
			raffle_category: "Health",
			date_created: "2025-02-20",
			raffle_duration: "20 days",
			raffle_status: "Active",
			draw_status: "Pending",
		},
		{
			raffle_name: "Home Makeover Raffle",
			raffle_category: "Home & Living",
			date_created: "2025-02-22",
			raffle_duration: "25 days",
			raffle_status: "Upcoming",
			draw_status: "Not started",
		},
	];
	const navigate = useNavigate();
	const id = 2;
	

	return (
		<RaffleCustomTable headers={[
						"raffle name",
						"raffle category",
						"date created",
						"raffle duration",
						"raffle status",
						"draw status",
						"",
		]}>
			{elements?.map((element) => (
				<Table.Tr key={element.raffle_name}>
					<Table.Td>{element.raffle_name}</Table.Td>
					<Table.Td>{element.raffle_category}</Table.Td>
					<Table.Td>{element.date_created}</Table.Td>
					<Table.Td>{element.raffle_duration}</Table.Td>
					<Table.Td>
						<StatusBadge status={element.raffle_status} />
					</Table.Td>
					<Table.Td>
						<StatusBadge status={element.draw_status} />
					</Table.Td>
					<Table.Td>
						<ActionIcon
							className="!bg-[#FFD5D6]"
							onClick={() => navigate(`/admin/raffles/list/${id}`)}
						>
							<RiArrowRightUpLine className="text-primary-red" />
						</ActionIcon>
					</Table.Td>
				</Table.Tr>
			))}
		</RaffleCustomTable>
		
		
	);
}
