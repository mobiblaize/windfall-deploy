import { Button, Card, Image, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import RaffleBadge from "../../components/RaffleBadge";

function GamesCard({item}:{item:number}) {
    const navigate=useNavigate()
	return (
		<Card withBorder className="!relative !p-7 !rounded-xl">
			<Card.Section className="!relative text-center">
				<Image src="/src/assets/raffle-img.png" className="!rounded-md" />
				<RaffleBadge date={"June 2, 2025 | 10:00am"} status={"active"} className="absolute left-0 right-0 w-fit bottom-0 translate-y-1/2" />
			</Card.Section>

			<Card.Section className="!text-center" mt={44}>
				<Text fw={700} fz="xl">
					Game 1
				</Text>
				<Text className="!text-secondary-text">
					Enter now to grab the opportunity of a brand new S
				</Text>
			</Card.Section>
            <Button
                onClick={()=>navigate(`${item}`)}
				mt="lg"
				className="!border !h-12 !border-dashed !border-secondary-red"
			>
				My Tickets
			</Button>
		</Card>
	);
}

export default GamesCard;
