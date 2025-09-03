import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { BiSolidBell } from "react-icons/bi";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { RaffleTable } from "./RaffleTable";
import PerformanceMonitor from "./PerformanceMonitor";
import { FilterMenu, SortMenu } from "../../../components/FilterMenu";

const cards = [
	{
		title: "live rafles",
		value: 50,
		added: "+2",
		className:
			"!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
		color: "!text-primary-green",
	},
	{
		title: "upcoming rafles",
		value: 35,
		added: "+2",
		className:
			"!bg-primary-warning/10 !text-primary-warning/50 !border-primary-warning/50 ",
		color: "!text-primary-warning",
	},
	{
		title: "draw completed",
		value: 45,
		added: "+2 ",
		className: "!bg-light-blue !text-instant-blue/50 !border-instant-blue/50",
		color: "!text-instant-blue",
	},
];
function RaffleManagement() {
	const navigate = useNavigate();
	return (
		<div className="text-primary-text mx-7 ">
			<Card withBorder mt={"xl"} radius={"md"} py={24}>
				<Flex
					justify={{ base: "start", xs: "space-between" }}
					align={{ base: "start", xs: "center" }}
					direction={{ base: "column", xs: "row" }}
					gap={"md"}
				>
					<div>
						<Text tt={"capitalize"} fz={"lg"} fw={600}>
							Dashboard overview
						</Text>
						<Text className="!text-secondary-text !text-xs">
							An snapshot of raffle draw / games on the system
						</Text>
					</div>
					<Button
						variant="outline"
						className="!border-secondary-text flex"
						rightSection={<FaCalendarAlt size={18} />}
					>
						Date:
						<span className="text-secondary-text font-medium">
							{" "}
							Last 3 month
						</span>
					</Button>
				</Flex>
				<Divider my="md" />
				<section>
					<div>
						<Text tt={"capitalize"} className="!text-secondary-text !text-xs">
							total number of games
						</Text>
						<Text fw={500} fz={32} className="!text-primary-red">
							150
						</Text>
					</div>
					<SimpleGrid
						cols={{ base: 1, sm: 2, lg: 3 }}
						spacing={{ base: 10, sm: "xl" }}
						verticalSpacing={{ base: "md", sm: "xl" }}
					>
						{cards.map((item) => (
							<GridCard key={item.title} item={item} />
						))}
					</SimpleGrid>
				</section>
			</Card>
			<Card withBorder mt={"xl"} radius={"md"} px={0}>
				<Flex
					justify={{ base: "start", xs: "space-between" }}
					px="md"
					gap={"sm"}
					direction={{ base: "column", xs: "row" }}
				>
					<Box>
						<Text tt="capitalize" fz={"lg"} fw={600}>
							Raffle list
						</Text>
						<Text className="!text-secondary-text !text-xs !capitalize">
							a list of all raffled on the system
						</Text>
					</Box>

					<Group>
						<Button
							className="!border-secondary-text !text-secondary-text !capitalize"
							variant="outline"
							rightSection={<RiArrowRightUpLine />}
							onClick={() => navigate("list")}
						>
							view all
						</Button>
						<Button rightSection={<IoIosAdd size={18} className="" />}>
							Create new
						</Button>
					</Group>
				</Flex>
				<Divider my={"lg"} />
				<Flex
					justify={"space-between"}
					px="md"
					gap={"sm"}
					direction={{ base: "column", sm: "row" }}
				>
					<TextInput
						className=" w-full md:!w-1/2"
						radius={"sm"}
						placeholder="search"
						leftSection={<FaSearch />}
					/>
					<Flex gap={"md"}>
						<FilterMenu items={[]} />
						<SortMenu items={[]}/>
						{/* <Button
							className="!border-secondary-text !text-secondary-text !capitalize"
							variant="outline"
							rightSection={<IoFilterOutline size={18} />}
						>
							sort by: show all
						</Button> */}
						{/* <Button
							className="!border-secondary-text !text-secondary-text !capitalize"
							variant="outline"
							rightSection={<IoFilterOutline size={18} />}
						>
							filter by: show all
						</Button> */}
					</Flex>
				</Flex>
				<Divider my={"lg"} />
				<RaffleTable />
			</Card>
			<PerformanceMonitor />
		</div>
	);
}

export default RaffleManagement;

function GridCard({ item }: { item: any }) {
	return (
		<Card radius={"md"} className={`border ${item.className}`}>
			<Stack gap={"xs"}>
				<Flex gap="sm" align="center">
					<BiSolidBell />
					<Text tt="capitalize" fz="sm" className="!text-primary-text">
						{item.title}
					</Text>
				</Flex>
				<Text fw={500} fz={32} className={item.color}>
					{item.value}
				</Text>
				<Text
					tt="capitalize"
					className="!text-primary-text !capitalize !text-xs"
				>
					<span className={` ${item.color}`}>{item.added}</span> Added in last 3
					days
				</Text>
			</Stack>
		</Card>
	);
}
