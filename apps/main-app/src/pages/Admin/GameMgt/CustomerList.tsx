import { AreaChart } from "@mantine/charts";
import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	SimpleGrid,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { FaFileArrowDown } from "react-icons/fa6";
import { PiQuestionThin } from "react-icons/pi";
import { SortMenu, FilterMenu } from "../../../components/FilterMenu";
import WebMobileTab from "./WebMobileTab";
import CustomerModal from "./CustomerModal";
import RaffleCustomTable from "./RaffleCustomTable";

function CustomerList() {
	return (
		<Box mt="xl" pb="xl" mx="xl">
			<Card withBorder radius={"md"}>
				<Box>
					<Text tt={"capitalize"} fz={"xl"} fw={"600"}>
						customer overview
					</Text>
					<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
						an insight into the customers for this draw
					</Text>
				</Box>
				<Divider my="md" />
				<Box mb={"lg"}>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total number of customer
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					<Text className="!text-primary-green " fz={32} fw={500} mb="xs">
						{(2000).toLocaleString()}
					</Text>

					<Text
						tt="capitalize"
						fz="sm"
						className="!text-secondary-text !item-center !flex !gap-2"
						mb={5}
					>
						<AiFillExclamationCircle />
						22.4% increase over the last days
					</Text>
				</Box>
				<Divider my="md" />
				<SimpleGrid
					my="lg"
					cols={{ base: 1, xs: 2, sm: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "lg", sm: "xl" }}
					mt="md"
				>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							total new customer{" "}
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text fw={500} fz={28}>
							5,000
						</Text>
						<Text tt="capitalize" fz="sm">
							29.3% new user
						</Text>
					</Box>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							total returning buyers
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text fw={500} fz={22} tt="capitalize">
							{(1000).toLocaleString()}
						</Text>
						<Text tt="capitalize" fz="sm">
							<span className="text-primary-green">+34.9% </span> increase in
							the last 3 days
						</Text>
					</Box>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							average ticket unit per customer
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text fw={500} fz={22}>
							2 ticket units
						</Text>
						<Text tt="capitalize" fz="sm">
							<span className="text-primary-green">+1.5 </span> increase in the
							last 3 days
						</Text>
					</Box>
				</SimpleGrid>
				<Card withBorder radius={"md"} mt="md">
					<Flex justify={"space-between"} align={"start"}>
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							customer trend analysis
							<span>
								<PiQuestionThin />
							</span>
						</Text>

						<Button
							variant="outline"
							className="!border-secondary-text/50 !text-primary-red"
							rightSection={
								<FaCalendarAlt className="text-secondary-text/50" />
							}
						>
							Date: 23/2025
						</Button>
					</Flex>
					<Divider my="md" />
					<Box my="lg" className="w-full h-full">
						<AreaChart
							h={300}
							data={data}
							dataKey="date"
							series={[{ name: "Apples", color: "var(--primary-red)" }]}
							curveType="bump"
							withDots={false}
						/>
					</Box>
				</Card>
			</Card>
			<Card
				mt="xl"
				px={0}
				radius={"md"}
				pb={0}
				mb={"lg"}
				withBorder
				className="!w-full"
			>
				<Flex
					direction={{ base: "column", xs: "row" }}
					gap={10}
					justify={"space-between"}
					px="sm"
				>
					<Box>
						<Text tt="capitalize" fz={"lg"} fw={600}>
							game transaction list
						</Text>
						<Text className="!text-secondary-text !text-xs !capitalize">
							track and manage games transaction list on the system
						</Text>
					</Box>

					<Button
						rightSection={<FaFileArrowDown />}
						variant="outline"
						className="!border-secondary-text !text-secondary-text"
					>
						Export
					</Button>
				</Flex>
				<Divider my="md" />
				<Flex
					direction={{ base: "column", xs: "row" }}
					gap={10}
					px="md"
					wrap={"wrap"}
					align={{ base: "start", md: "center" }}
					justify={{ base: "start", sm: "space-between" }}
				>
					<WebMobileTab />
					<Flex gap={{ base: "md" }} wrap={"wrap"}>
						<TextInput
							className="w-full sm:w-fit"
							placeholder="search"
							leftSection={<FaSearch />}
						/>

						<SortMenu items={[]} />
						<FilterMenu items={[]} />
					</Flex>
				</Flex>
				<Divider my="md" />
				<RaffleCustomTable
					headers={[
						"customer name & ID",
						"location (L.G.A)",
						"phone",
						"purchase source",
						"ticket price & number",
						"number of ticket",
						"",
					]}
				>
					{[1, 2, 3, 4, 5, 6, 7]?.map((element) => (
						<Table.Tr key={element}>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>

							<Table.Td>
								<CustomerModal />
							</Table.Td>
						</Table.Tr>
					))}
				</RaffleCustomTable>

				<Divider />
				<Flex justify={"space-between"} px="md" my={"xs"} py="xs">
					<Text fs={"italic"}>page 1 of 10</Text>
					<Group>
						<Button
							variant="outline"
							className="!border-secondary-text !text-secondary-text !italic !capitalize"
						>
							previous
						</Button>
						<Button
							variant="outline"
							className="!border-secondary-text !text-secondary-text !italic !capitalize"
						>
							next
						</Button>
					</Group>
				</Flex>
			</Card>
		</Box>
	);
}

export default CustomerList;

export const data = [
	{
		date: "Mar 22",
		Apples: 2890,
		Oranges: 2338,
		Tomatoes: 2452,
	},
	{
		date: "Mar 23",
		Apples: 2756,
		Oranges: 2103,
		Tomatoes: 2402,
	},
	{
		date: "Mar 24",
		Apples: 3322,
		Oranges: 986,
		Tomatoes: 1821,
	},
	{
		date: "Mar 25",
		Apples: 3470,
		Oranges: 2108,
		Tomatoes: 2809,
	},
	{
		date: "Mar 26",
		Apples: 3129,
		Oranges: 1726,
		Tomatoes: 2290,
	},
];
