import { Button, Card, Image, Text, Badge, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function GamesCard({item}:{item:any}) {
    const navigate=useNavigate()
	return (
		<Card withBorder className="!relative !p-7 !rounded-xl">
			<Card.Section className="!relative">
				<Image src="/src/assets/raffle-img.png" className="!rounded-md" />
				<div className="shadow-md p-1 rounded-4xl h-fit absolute mx-auto left-0 right-0 w-fit bottom-0 translate-y-1/2">
					<Flex
						align="center"
						gap="sm"
						className="!bg-[#15B79E] !py-2 !px-3 !rounded-3xl "
					>
						<Badge className="!bg-[#125D56] !p-3  !font-medium">
							Draw Date
						</Badge>
						<Text className="!text-white !tracking-wide !text-sm ">
							July 10,2025 | 10:00am
						</Text>
					</Flex>
				</div>
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
