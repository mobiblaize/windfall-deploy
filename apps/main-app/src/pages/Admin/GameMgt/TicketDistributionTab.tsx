import {
	Box,
	SimpleGrid,
	Stack,
	Card,
	Flex,
	Divider,
    Container,
    Text
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper";
import { BarChart } from "@mantine/charts";

function TicketDistributionTab() {
	return (
		<>
			<Box>
				<Text
					tt={"capitalize"}
					fz={"sm"}
					className="!text-secondary-text !flex !items-center !gap-x-2"
				>
					total revenue generated
					<span>
						<PiQuestionThin />
					</span>
				</Text>
				<Text fw={500} fz={28} className="!text-primary-green">
					{formatCurrency(1230004)}
				</Text>
			</Box>
			<SimpleGrid
				my="lg"
				cols={{ base: 1, xs: 2, sm: 3 }}
				spacing={{ base: 10, sm: "xl" }}
				verticalSpacing={{ base: "lg", sm: "xl" }}
			>
				<Stack
					gap={"xs"}
					className="sm:border-r border-b sm:border-b-0 border-secondary-text/30"
				>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total revenue generated
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					<Text>{formatCurrency(1598000)}</Text>
					<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
						15 tickets sold in the last 6 hours
					</Text>
				</Stack>
				<Stack
					gap={"xs"}
					className="sm:border-r border-b sm:border-b-0 border-secondary-text/30"
				>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total revenue generated
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					<Text>{formatCurrency(1598000)}</Text>
					<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
						15 tickets sold in the last 6 hours
					</Text>
				</Stack>
				<Stack gap={"xs"} className="">
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total revenue generated
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					<Text>{formatCurrency(1598000)}</Text>
					<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
						15 tickets sold in the last 6 hours
					</Text>
				</Stack>
			</SimpleGrid>
			<Card withBorder my={"lg"}>
				<Flex justify={"space-between"}>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						sales trend analysis
						<span>
							<PiQuestionThin />
						</span>
					</Text>
				</Flex>
				<Divider my="md" />
				<Container className="!w-full !h-full">
					<BarChart
						h={300}
						data={data}
						withTooltip={false}
						dataKey="month"
						series={[{ name: "Smartphones", color: "blue" }]}
					/>
				</Container>
			</Card>
		</>
	);
}

export default TicketDistributionTab;

const data = [
	{ month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
	{ month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
	{ month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
	{ month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
	{ month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
	{ month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
];
