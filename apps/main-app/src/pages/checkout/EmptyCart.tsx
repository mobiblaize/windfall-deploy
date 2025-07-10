import { Card, Text, Image, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function EmptyCart() {
	const navigate = useNavigate();
	return (
		<Card
			withBorder
			shadow="sm"
			radius="md"
			className="!w-2/5 !mx-auto mt-10 !p-10"
		>
			<Card.Section className="!text-center !w-4/5 !mx-auto">
				<div className="p-3 rounded-full w-fit bg-secondary-red mx-auto">
					<Image src="/src/assets/card.png" w={72} h={72} />
				</div>
				<Text className="!font-semibold !text-2xl">No Ticket in Cart</Text>
				<Text className="!text-secondary-text" my="sm">
					You currently have no ticket (s) in your Cart. Explore raffle games to
					add ticket (s) to your Cart.
				</Text>
				<Button
					onClick={() => navigate("/")}
					className="!border !border-dashed !border-secondary-red !px-7 !h-12 !tracking-wide"
				>
					Explore All Games
				</Button>
			</Card.Section>
		</Card>
	);
}

export default EmptyCart;
