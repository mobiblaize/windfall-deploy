import { Button, Card, Divider, Grid, Image, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function WinnersCard({ item }: { item: any }) {
	const navigate=useNavigate()

	return (
		<Card withBorder className="!rounded-lg">
			<Card.Section className="!m-3">
				<Image
					className="!rounded-xl h-[200px]"
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
					alt="Norway"
				/>
			</Card.Section>
			<Card.Section className="!mx-3 !my-4 !text-center ">
				<Text className=" !text-secondary-text !capitalize">price won</Text>
				<Text className=" !text-primary-red !text-xl !capitalize !font-semibold">
					Luxury suv
				</Text>
				<Text my="md" className="!text-[#575757]">
					I participated in the Lucky Ride Raffle and won a stunning luxury SUV!
					The moment I drove it home, I felt like a celebrity. Thanks to this
					amazing raffle, my daily commute has transformed into an extraordinary
					experience.
				</Text>
			</Card.Section>
			<Card.Section className="!mb-5 !text-center">
				<Grid className="!mt-10">
					<Grid.Col span="auto" className="!text-center">
						<Text size="md" className="!text-gray-500 !capitalize">
							raffle value
						</Text>
						<Text size="xl" className="!capitalize">
							{(150000).toLocaleString()}
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" />

					<Grid.Col span="auto">
						<Text size="md" className="!text-gray-500 !capitalize">
							raffle name
						</Text>
						<Text size="xl" className="!capitalize">
							samuel banks
						</Text>
					</Grid.Col>
					<Divider orientation="vertical" />

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
			<Button
				my="lg"
				onClick={()=>navigate(`${item}`)}
				rightSection={
					<GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
				}
				className="!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide"
			>
				Read Exclusive Winner Story
			</Button>
		</Card>
	);
}

export default WinnersCard;
