import {
	Card,
	Text,
	Box,
	Divider,
	SimpleGrid,
	Flex,
	Button,
	Group,
	TextInput,
	Table,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaFileArrowDown } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FilterMenu, SortMenu } from "../../../components/FilterMenu";
import { FaSearch } from "react-icons/fa";
import TransactionDetailModal from "./TransactionDetailModal";

function RaffleTransactionalList() {
	return (
		<>
			<Card mt="lg" mb="xl" mx="lg" radius={"md"} withBorder>
				<Box>
					<Text tt="capitalize" fz={"lg"} fw={600}>
						Raffle list
					</Text>
					<Text className="!text-secondary-text !text-xs !capitalize">
						a list of all raffled on the system
					</Text>
				</Box>
				<Divider my="md" />
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
					<Text className="!text-primary-green " fz={32} fw={500} mb="xs">
						{formatCurrency(2000000)}
					</Text>
					<Text
						tt="capitalize"
						fz="sm"
						className="!text-secondary-text !item-center !flex !gap-2"
						mb={5}
					>
						<AiFillExclamationCircle />
						{formatCurrency(4000)} ticket average price
					</Text>
					<Text
						tt="capitalize"
						fz="sm"
						className="!text-secondary-text !item-center !flex !gap-2"
						mb={5}
					>
						<AiFillExclamationCircle />
						{formatCurrency(4000)} ticket was sold across channel
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
				<Divider my="sm" />
				<SimpleGrid my="lg" cols={3} spacing="xl" mt="md">
					<Box className="!border-r !border-secondary-text/40">
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
					<Box className="!border-r !border-secondary-text/40">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							top purchase channel{" "}
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text fw={500} fz={22} tt="capitalize">
							mobile app ~ 2.4k Tickets
						</Text>
						<Text tt="capitalize" fz="sm">
							29.3% ticket sales across channel
						</Text>
					</Box>
					<Box className="!border-r !border-secondary-text/40">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							peak sales time
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text fw={500} fz={22}>
							7 - 9 pm
						</Text>
						<Text tt="capitalize" fz="sm">
							1,003 sold this period
						</Text>
					</Box>
				</SimpleGrid>
			</Card>
			<Card mt="lg" mx="lg" px={0} radius={"md"} pb={0} mb={"lg"} withBorder>
				<Flex justify={"space-between"} px="sm">
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
				<Flex px="md" justify="space-between">
					<WebMobileTab />
					<Group>
						<TextInput placeholder="search" leftSection={<FaSearch />} />
						<SortMenu items={[]} />
						<FilterMenu items={[]} />
					</Group>
				</Flex>
				<Divider my="md" />

				<Table striped highlightOnHover >
					<Table.Thead>
						<Table.Tr className="capitalize">
							{[
								"transaction ID",
								"customer detail",
								"purchase date",
								"purchase via",
								"ticket price & number",
								"",
							]?.map((item) => (
								<Table.Th>{item}</Table.Th>
							))}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{[1, 2, 3, 4]?.map((element) => (
							<Table.Tr key={element}>
								<Table.Td>{element}</Table.Td>
								<Table.Td>{element}</Table.Td>
								<Table.Td>{element}</Table.Td>
								<Table.Td>{element}</Table.Td>
								<Table.Td>{element}</Table.Td>

								<Table.Td>
									<TransactionDetailModal/>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Divider />
				<Flex
					justify={"space-between"}
					px="md"
					my={"xs"}
				
					py="xs"
				>
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
		</>
	);
}

const WebMobileTab = () => {
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("status");
	const [activeStatus, setActiveStatus] = useState(tabFromUrl || "show all");
	const statuses = ["show all", "web", "mobile app"];

	// Keep activeStatus in sync with the URL
	useEffect(() => {
		setActiveStatus(tabFromUrl || "show all");
	}, [tabFromUrl]);

	const handleStatusFilter = (val: string) => {
		setActiveStatus(val);
	};
	return (
		<div className="capitalize text-sm w-fit">
			<ul className="flex items-center border divide-y sm:divide-y-0 divide-secondary-text md:divide-x border-secondary-text  rounded-md text-nowrap">
				{statuses.map((status) => {
					const isActive = activeStatus === status;
					const bgClass =
						isActive ?
							` bg-[#FFD5D6] text-primary-red`
						:	"hover:bg-secondary-red";

					return (
						<li key={status}>
							<button
								onClick={() => handleStatusFilter(status)}
								className={`px-3 py-1 rounded w-full  text-xs md:text-sm transition-colors duration-200 !capitalize ${bgClass}`}
							>
								{status}
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
export default RaffleTransactionalList;
