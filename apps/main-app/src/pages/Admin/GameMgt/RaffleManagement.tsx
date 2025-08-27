import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { FaAngleDown, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { BiSolidBell } from "react-icons/bi";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa";
import { formatCurrency } from "../../../utils/helper";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";
import Salestabs from "./Salestabs";
import { useNavigate } from "react-router-dom";
import { RaffleTable } from "./RaffleTable";

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
				<Flex justify={"space-between"} align={"center"}>
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
					justify={"space-between"}
					px="md"
					gap={"sm"}
					direction={{ base: "column", xs: "row" }}
				>
					<div>
						<Text tt="capitalize" fz={"lg"} fw={600}>
							Raffle list
						</Text>
						<Text className="!text-secondary-text !text-xs !capitalize">
							a list of all raffled on the system
						</Text>
					</div>

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
						<Button
							className="!border-secondary-text !text-secondary-text !capitalize"
							variant="outline"
							rightSection={<IoFilterOutline size={18} />}
						>
							sort by: show all
						</Button>
						<Button
							className="!border-secondary-text !text-secondary-text !capitalize"
							variant="outline"
							rightSection={<IoFilterOutline size={18} />}
						>
							filter by: show all
						</Button>
					</Flex>
				</Flex>
				<Divider my={"lg"} />
				<RaffleTable  />
			</Card>
			<Card withBorder mt={"xl"} radius={"md"}>
				<Flex justify={"space-between"} align={"center"}>
					<div>
						<Text
							fz={"lg"}
							fw={600}
							tt={"capitalize"}
							className="!text-primary-green"
						>
							Live games:{" "}
							<span className="text-primary-text">performance monitor</span>
						</Text>
					</div>
					<Group>
						<Select
							rightSection={<FaAngleDown />}
							placeholder="game category: instance game"
						/>
						<Select
							rightSection={<FaAngleDown />}
							placeholder="game category: instance game"
						/>
						<Button
							variant="outline"
							className="!border-secondary-text/50 !text-secondary-text/50"
							leftSection={<FaRegCircle />}
						>
							Date: 3/04/2025
						</Button>
					</Group>
				</Flex>
				<Divider my="lg" />
				<Flex justify={"space-between"}>
					<div>
						<Text
							tt={"capitalize"}
							fz={"lg"}
							fw={"600"}
							className="!text-primary-red"
						>
							raffle overview
						</Text>
						<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
							an overview of the live draw financial performance
						</Text>
					</div>
					<Button
						tt={"capitalize"}
						rightSection={<RiArrowRightUpLine size={16} />}
					>
						raffle details
					</Button>
				</Flex>
				<Card mt={"md"} withBorder radius={"md"}>
					<Box mb={"lg"}>
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							total revenue generated{" "}
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text className="!text-primary-green " fz={32} fw={500}>
							{formatCurrency(2000000)}
						</Text>
					</Box>
					<SimpleGrid cols={2} spacing="lg">
						<Box>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								total number of tickets sold
								<span>
									<PiQuestionThin />
								</span>
							</Text>
							<Text fw={500} fz={"xl"}>
								5,000
							</Text>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								22 ticket sold in the last 6 hours
							</Text>
						</Box>
						<Box>
							<Divider orientation="vertical" />
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								total number of tickets sold
								<span>
									<PiQuestionThin />
								</span>
							</Text>
							<Text fw={500} fz={"xl"}>
								5,000
							</Text>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								22 ticket sold in the last 6 hours
							</Text>
						</Box>
					</SimpleGrid>
					<Divider my="xl" />
					<SimpleGrid cols={2} spacing="lg">
						<Box>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								total number of tickets sold
								<span>
									<PiQuestionThin />
								</span>
							</Text>
							<Text fw={500} fz={"xl"}>
								5,000
							</Text>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								22 ticket sold in the last 6 hours
							</Text>
						</Box>
						<Box>
							<Divider orientation="vertical" />
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								total number of tickets sold
								<span>
									<PiQuestionThin />
								</span>
							</Text>
							<Text fw={500} fz={"xl"}>
								5,000
							</Text>
							<Text
								tt={"capitalize"}
								fz={"xs"}
								className="!text-secondary-text !flex !items-center !gap-x-2"
							>
								22 ticket sold in the last 6 hours
							</Text>
						</Box>
					</SimpleGrid>
				</Card>
				<Box my={"xl"}>
					<Text
						tt={"capitalize"}
						fz={"lg"}
						fw={"600"}
						className="!text-primary-red"
					>
						ticket performance overview
					</Text>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						Comparison analyses of ticket sales across tiers and
						categories.{" "}
					</Text>
				</Box>
				<Card withBorder radius={"md"}>
					<Box>
						<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
							Total Number of Ticket Sold
						</Text>
						<Text className="!text-primary-green" fw={600} fz={28}>
							5,000
						</Text>
						<Flex gap={2} align={"center"}>
							<AiFillExclamationCircle className="text-secondary-text" />
							<Text
								className="!text-secondary-text"
								tt={"capitalize"}
								fz={"sm"}
								mt={4}
							>
								+ 20.4 % increase over the last 3 day
							</Text>
						</Flex>
						<Flex gap={2} align={"center"}>
							<AiFillExclamationCircle className="text-secondary-text" />
							<Text
								className="!text-secondary-text"
								tt={"capitalize"}
								fz={"sm"}
								mt={4}
							>
								₦ 20,000,000 in Total ticket revenue
							</Text>
						</Flex>
					</Box>
					<section className="my-7">
						<Text>Distribution of Ticket sales by Discounting Structure</Text>
						<SimpleGrid cols={3} spacing="xl" mt="md">
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
						</SimpleGrid>
						<Divider my="xl" />
						<SimpleGrid cols={3} spacing="xl" mt="md">
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
							<Stack gap={"xs"} className="border-r border-secondary-text/30">
								<Text className="!text-primary-red" fz={"lg"} fw={500}>
									2% Discount
								</Text>
								<Box>
									<Text>2,904 Tickets</Text>
									<Text>{formatCurrency(1598000)}</Text>
								</Box>
								<Text
									tt={"capitalize"}
									fz={"xs"}
									className="!text-secondary-text"
								>
									15 tickets sold in the last 6 hours
								</Text>
							</Stack>
						</SimpleGrid>
					</section>
				</Card>
				<Box my={"lg"}>
					<Text
						tt={"capitalize"}
						fz={"lg"}
						fw={"600"}
						className="!text-primary-red"
					>
						Ticket sales distribution
					</Text>
					<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
						Distribution of Purchase by Channels
					</Text>
					<Divider my="lg" />
				</Box>
				<Salestabs />
			</Card>
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
