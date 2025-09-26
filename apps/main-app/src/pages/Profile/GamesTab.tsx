import { Select, Divider, Container, SimpleGrid } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import GamesCard from "./GamesCard";
import MyGameHeader from "./MyGameHeader";
import type { Raffle } from "../../models/raffles";

const raffles: Raffle[] = [];

function GamesTab() {
	return (
		<div className="">
			<MyGameHeader
				title="game list"
				description="A list of your Games and their respective status"
			>
				<Select
					data={[""]}
					placeholder="My Games: Show All"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</MyGameHeader>

			<Divider />
			<Container size="xl" my="xl">
				<SimpleGrid
					py="lg"
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "md", sm: "xl" }}
				>
					{raffles.map((item, index) => (
						<GamesCard key={index} {...item} />
					))}
				</SimpleGrid>
			</Container>
		</div>
	);
}

export default GamesTab;
