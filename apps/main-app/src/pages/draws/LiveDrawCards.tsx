import { Button, Card, Divider, Grid, Image, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";

function LiveDrawCards({ item }: { item: unknown }) {
	console.log(item);
	return (
		<Card withBorder>
			<Card.Section className="!m-3">
				<Image
					className="!rounded-xl "
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
					alt="Norway"
				/>
			</Card.Section>
			<Card.Section className="!mx-3 !my-4 !text-center">
				<Text size="xl">Discover a dream vacation in maldives</Text>
				<Text size="sm" className="!text-gray-300">
					Discover a dream vacation in maldives
				</Text>
				<Grid className="!mt-10">
					<Grid.Col span="auto" className="!text-center">
						<Text size="md" className="!text-gray-500 !capitalize">
							draw winner
						</Text>
						<Text size="xl" className="!text-primary-red !capitalize">
							samuel john
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" my="md" />

					<Grid.Col span="auto">
						<Text size="md" className="!text-gray-500 !capitalize">
							draw date
						</Text>
						<Text size="xl" className="!capitalize">
							12/12/2023
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" my="md" />

					<Grid.Col span="auto">
						<Text size="md" className="!text-gray-500 !capitalize">
							total ticket
						</Text>
						<Text size="xl" className="!capitalize">
							{(2000).toLocaleString()}
						</Text>
					</Grid.Col>
				</Grid>
				<Divider my="lg" mx="lg" />
				<Grid className="!mt-10">
					<Grid.Col span="auto" className="!text-center">
						<Text size="md" className="!text-gray-500 !capitalize">
							conducted by
						</Text>
						<Text size="xl" className="!capitalize">
							samuel john
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" my="md" />

					<Grid.Col span="auto">
						<Text size="md" className="!text-gray-500 !capitalize">
							draw date
						</Text>
						<Text size="xl" className="!capitalize">
							12/12/2023
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" my="md" />

					<Grid.Col span="auto">
						<Text size="md" className="!text-gray-500 !capitalize">
							number of winners
						</Text>
						<Text size="xl" className="!capitalize">
							02
						</Text>
					</Grid.Col>
				</Grid>
			</Card.Section>
			<Button
				my="lg"
				rightSection={
					<GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
				}
				className="!bg-[#FFD5D6]  !text-primary-red !h-12 !capitalize !border !rounded-lg !border-primary-red !border-dashed !tracking-wide"
			>
				watch live draw
			</Button>
		</Card>
	);
}

export default LiveDrawCards;
