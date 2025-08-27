import {
	Card,
	Flex,
	Group,
	Button,
	Divider,
	TextInput,
	Text,
	Box,
} from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { RaffleTable } from "./RaffleTable";
import { FaFileArrowDown } from "react-icons/fa6";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { SortMenu, FilterMenu } from "../../../components/FilterMenu";

const items = [
	{ title: "raffle management", href: "#" },
	{ title: "raffle list", href: "#" },
].map((item, index) => (
	<Anchor
		href={item.href}
		key={index}
		className="!text-secondary-text !capitalize"
	>
		{item.title}
	</Anchor>
));

function NavCrumbs() {
	return (
		<>
			<Breadcrumbs className="my-3 mx-3">{items}</Breadcrumbs>
		</>
	);
}
function RaffleList() {
	return (
		<>
			<NavCrumbs />
			<Divider />
			<div className="!text-primary-text mb-5 ">
				<Flex
					justify={"space-between"}
					px="md"
					py="sm"
					gap={"sm"}
					direction={{ base: "column", xs: "row" }}
				>
					<div>
						<Text tt="capitalize" fz={"lg"} fw={600}>
							all Raffle
						</Text>
						<Text className="!text-secondary-text !text-xs !capitalize">
							manage all your raffle on the system
						</Text>
					</div>

					<Group>
						<Button rightSection={<IoIosAdd size={18} className="" />}>
							Create new
						</Button>
					</Group>
				</Flex>
				<Divider my={"lg"} />

				<Card withBorder radius={"md"} mx={"md"} px={0} my="xl">
					<Flex
						justify={"space-between"}
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
							<SortMenu items={["draw pending", "draw completed"]} />
							<FilterMenu
								items={["live games", "draw completed", "upcoming games"]}
							/>
						</Flex>
					</Flex>
					<Divider my={"lg"} />
					<RaffleTable />
				</Card>
			</div>
		</>
	);
}

export default RaffleList;
