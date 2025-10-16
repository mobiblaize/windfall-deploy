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
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaFileArrowDown } from "react-icons/fa6";
import { FilterMenu, SortMenu } from "../../../components/FilterMenu";
import { FaSearch } from "react-icons/fa";
import TransactionDetailModal from "./TransactionDetailModal";
import WebMobileTab from "./WebMobileTab";
import RaffleCustomTable from "./RaffleCustomTable";
import { formatCurrency } from "../../../utils/helper/formatCurrency";

function RaffleTransactionalList() {
	return (
		<Box mt="xl" pb="xl" mx="xl">
			<Card withBorder radius={"md"}>
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
				<SimpleGrid
					my="lg"
					cols={{ base: 1, xs: 2, sm: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "lg", sm: "xl" }}
					mt="md"
				>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
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
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
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
					<Box className="sm:!border-r sm:!border-b-0  !border-secondary-text/40 py-3 sm:py-0">
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
						"transaction ID",
						"customer detail",
						"purchase date",
						"purchase via",
						"ticket price & number",
						"",
					]}
				>
					{[1, 2, 3, 4]?.map((element) => (
						<Table.Tr key={element}>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td>{element}</Table.Td>
							<Table.Td className="text-right">
								<TransactionDetailModal />
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

export default RaffleTransactionalList;
