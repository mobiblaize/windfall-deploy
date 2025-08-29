import {
	Card,
	SimpleGrid,
	Stack,
	Flex,
	Box,
	Image,
	Text,
	Avatar,
	Button,
	Group,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import StatusBadge from "../../../components/StatusBadge";

function GamedrawTab() {
	const draw: any[] = [1];
	return (
		
            <Box mx="lg">
                {draw.length ?
				<SimpleGrid cols={{ base: 1, sm: 2 }}>
					{draw?.map((item) => (
						<DrawItem item={item} />
					))}
				</SimpleGrid>
			:	<Card mx="md" withBorder>
					<Stack>
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
								no draw yet
							</Text>
							<Text tt={"capitalize"} fz={"xs"}>
								there is no draw for this game yet
							</Text>
						</Box>
					</Stack>
				</Card>
			}
            </Box>
		
	);
}

export default GamedrawTab;

function DrawItem({ item }: { item: any }) {
	return (
		<Card withBorder radius={"md"}>
			<Box>
				<Text c="var(--primary-red)" tt="capitalize" fw={500} fz={"lg"}>
					{item} plot of land in lekki
				</Text>
				<Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
					game price
				</Text>
			</Box>
			<Box my="lg">
				<Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
					draw pot
				</Text>
				<Text tt="capitalize" fw={500} fz={"md"}>
					5,200 ticket/ticket
				</Text>
			</Box>
			<SimpleGrid cols={2}>
				<Box>
					<Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
						prize distribution
					</Text>
					<Text tt="capitalize" fw={500} fz={"md"}>
						single
					</Text>
				</Box>
				<Box>
					<Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
						draw conducted by
					</Text>
					<Group align={"center"}>
						<Avatar radius="sm" className="border-2 border-primary-red" />
						<Box>
							<Text fz="sm">Adekunle ibrahim</Text>
							<Text c="var(--secondary-text)" fz={"xs"} tt="capitalize">
								operation manager
							</Text>
						</Box>
					</Group>
				</Box>
			</SimpleGrid>
			<Box my="md">
				<Text fz="xs" tt="capitalize">
					draw winner
				</Text>
				<Flex justify={"space-between"} align="center">
					<Group>
						<Avatar radius={"sm"} className="border-2 border-primary-red" />
						<Box>
							<Text fz="sm" c="var(--secondary-text)" tt="capitalize">
								Hameedat adekunle
							</Text>
							<Text fz="xs" c="var(--secondary-text)">
								ID:9044| +234903456789
							</Text>
							<StatusBadge status="verified" />
						</Box>
					</Group>
					<Button
						tt="capitalize"
						radius="sm"
						rightSection={<RiArrowRightUpLine />}
						variant="outline"
						className="!border-secondary-text/50 !text-secondary-text/50"
					>
						view details
					</Button>
				</Flex>
			</Box>
		</Card>
	);
}
