import { Flex, Text, Select, Divider, Container, SimpleGrid } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import GamesCard from "./GamesCard";

function GamesTab() {
	return (
		<div className="">
			<Flex className="flex flex-col md:flex-row gap-3 justify-between  !bg-white/60 py-5 px-10 shadow-md">
				<div>
					<Text className="!text-2xl !font-semibold">Game list</Text>
					<Text className="!text-secondary-text">
						A list of your Games and their respective status
					</Text>
				</div>
				<Select
					data={[""]}
					placeholder="My Games: Show All"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</Flex>
			<Divider />
			<Container size="xl" my="lg">
				<SimpleGrid
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "md", sm: "xl" }}
				>
					{[1, 2, 3].map((item) => (
						<GamesCard key={item} />
					))}
				</SimpleGrid>
			</Container>
		</div>
	);
}

export default GamesTab;
