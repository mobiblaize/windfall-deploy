import {
	Card,
	Container,
	Divider,
	Flex,
	Select,
	SimpleGrid,
	Text,
	Box,
	Button,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import EmptyDraw from "./EmptyDraw";
import { useNavigate } from "react-router-dom";

function ResultsTab() {
	const navigate = useNavigate();
	const data = [1, 2, 3];

	return (
		<div>
			<MyGameHeader
				count="0"
				title="game result"
				description="A list of result pertaining to your games"
			>
				<Select
					data={[""]}
					placeholder="My Games: Show All"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</MyGameHeader>

			<Divider />
			<Container size="xl">
				{data?.length > 0 ?
					<SimpleGrid
						my={54}
						py="lg"
						cols={{ base: 1, sm: 2, lg: 3 }}
						spacing={{ base: 10, sm: "md" }}
						verticalSpacing={{ base: "md", sm: "xl" }}
					>
						{data?.map((item) => (
							<Card withBorder className="!p-10 !rounded-xl !space-y-5">
								<Card.Section>
									<Text className="!text-2xl !font-bold">
										Secure a Luxury Studio Apartment in Lekki, Lagos State,
										Nigeria
									</Text>
									<Text className="!text-secondary-text !my-3">
										Enter now to grab the opportunity of a brand new S
									</Text>
								</Card.Section>
								<Box className="!text-secondary-text">
									<Flex justify="space-between">
										<Text>Draw Date: Apr 11,2025</Text>
										<Text>Number of Tickets: 7</Text>
									</Flex>
								</Box>
								<Button
									onClick={() => navigate(`${item}`)}
									className="!h-12 !text-lg !rounded-xl !border-2 !border-dashed !border-secondary-red"
								>
									View Result
								</Button>
							</Card>
						))}
					</SimpleGrid>
				:	<EmptyDraw />}
			</Container>
		</div>
	);
}

export default ResultsTab;
