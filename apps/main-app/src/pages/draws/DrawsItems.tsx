import { Card, Grid, Divider, Image, Text } from "@mantine/core";

function DrawsItems({ item }: { item: any }) {
	console.log(item);
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Card.Section className="!m-3">
				<Image
					className="!rounded-xl "
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
					alt="Norway"
				/>
			</Card.Section>
			<Card.Section className="mx-1 md:!mx-3 !my-4 !text-center">
				<Text size="xl">Discover a dream vacation in maldives</Text>
				<Text size="sm" className="!text-gray-300">
					Discover a dream vacation in maldives
				</Text>

				<Grid className="!mt-10">
					<Grid.Col span="auto" className="!text-center">
						<Text size="md" className="!text-gray-500 !capitalize">
							raffle winner
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
							value ticket bought
						</Text>
						<Text size="xl" className="!capitalize">
							{(50000).toLocaleString()}
						</Text>
					</Grid.Col>
				</Grid>
			</Card.Section>
		</Card>
	);
}

export default DrawsItems;
