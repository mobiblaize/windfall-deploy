import {
	Box,
	Card,
	Divider,
	Flex,
	Text,
	
	Button,
	SimpleGrid,
	Select,
	Stack,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { RiArrowRightUpLine } from "react-icons/ri";
import { formatCurrency } from "../../../utils/helper";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaAngleDown, FaRegCircle } from "react-icons/fa";
import Salestabs from "./Salestabs";

function PerformanceMonitor() {
	return (
		<Card withBorder mt={"xl"} radius={"md"} mx="xl">
			<Flex
				align={{ base: "start", md: "center" }}
				justify={{ base: "start", sm: "space-between" }}
				gap={{ base: "sm", sm: "lg" }}
				direction={{ base: "column", md: "row" }}
			>
				<Box>
					<Text
						fz={"lg"}
						fw={600}
						tt={"capitalize"}
						className="!text-primary-green"
					>
						Live games:{" "}
						<span className="text-primary-text">performance monitor</span>
					</Text>
				</Box>
				<Flex gap={{ base: "sm", sm: "md" }}>
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
				</Flex>
			</Flex>
			<Divider my="lg" />
			<Flex
				justify={{ base: "start", xs: "space-between" }}
				direction={{ base: "column", xs: "row" }}
				gap={{base:"md"}}
			>
				<Box>
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
				</Box>
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
					Comparison analyses of ticket sales across tiers and categories.{" "}
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
					<SimpleGrid cols={{base: 1, xs: 2, sm: 3}} spacing="xl" mt="md">
						<Stack gap={"xs"} className="sm:border-r border-secondary-text/30">
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
						<Stack gap={"xs"} className="sm:border-r border-secondary-text/30">
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
						<Stack gap={"xs"}>
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
					<SimpleGrid
						my="lg"
						cols={{ base: 1, xs: 2, sm: 3 }}
						spacing={{ base: 10, sm: "xl" }}
						verticalSpacing={{ base: "lg", sm: "xl" }}
						
					>
						<Stack gap={"xs"} className="sm:border-r border-secondary-text/30">
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
						<Stack gap={"xs"} className="sm:border-r border-secondary-text/30">
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
						<Stack gap={"xs"}>
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
	);
}

export default PerformanceMonitor;
