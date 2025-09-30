import { Text, Center, Card, Button, Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function EmptyDraw() {
	const navigate = useNavigate();
	return (
		<div>
			<Center py={32}>
				<Card
					withBorder
					shadow="sm"
					radius="md"
					className=" !mx-auto mt-10 !p-10"
				>
					<Card.Section className="!text-center !w-4/5 !mx-auto">
						<div className="p-3 rounded-full w-fit bg-secondary-red mx-auto">
							<Image src="/src/assets/card.png" w={72} h={72} />
						</div>
						<Text className="!font-semibold !text-2xl">No result Yet</Text>
						<Text className="!text-secondary-text" my="sm">
							You currently do not have any results for any of your games/Raffle
							Draw yet
						</Text>
						<Button
							onClick={() => navigate("/raffles")}
							className="!border !border-dashed !border-secondary-red !px-7 !h-12 !tracking-wide"
						>
							Explore All Games
						</Button>
					</Card.Section>
				</Card>
            </Center>
		</div>
	);
}

export default EmptyDraw;
