import { Box, Card, Flex, Image, SimpleGrid, Stack, Text } from "@mantine/core";
import CustomTickets from "../../../components/CustomTickets";

function WinnerTab() {
	const winner = [1];
	return (
		<Card withBorder radius={"md"} mx="xl">
			{winner.length ?
				<SimpleGrid cols={{base:1, sm:2, }}>
					{winner?.map((item) => (
						<Winners item={item} />
					))}
				</SimpleGrid>
			:	<Stack>
					<Flex justify={"center"}>
						<Image
							w={150}
							h={150}
							radius="md"
							src="/src/assets/Empty-winner.png"
						/>
					</Flex>
					<Box ta={"center"}>
						<Text tt="capitalize" fw={600} fz={"xl"}>
							no winners annouced yet
						</Text>
						<Text tt={"capitalize"} fz={"xs"}>
							This game is still live hence, a winner is yet to be
							announced.{" "}
						</Text>
					</Box>
				</Stack>
			}
		</Card>
	);
}

export default WinnerTab;

function Winners({ item }: { item: any }) {
	return (
		<CustomTickets bgColor="bg-secondary-green" borderColor="border-primary-green">
			<Text fw={700} fz="lg">
				{item} Bed Room Flat at Banana Island, Lagos State, Nigeria
			</Text>

			<Text c="dimmed" fz="sm" mb="xl">
				Win 3 bed room flat at the high prestige location
			</Text>

			<Box className="bg-white py-2 rounded-lg border-dashed border border-primary-green text-center">
				<Text fz="sm" mb={5}>
					Ticket Number
				</Text>
				<Text fw={700} fz="xl" className="!text-primary-red">
					#WF100423X8)
				</Text>
			</Box>
		</CustomTickets>
	);
}
