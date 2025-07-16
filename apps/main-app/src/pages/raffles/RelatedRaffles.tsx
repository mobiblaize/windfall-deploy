import { Link } from "react-router-dom";
import raffleImg from "../../assets/default-raffle.png";
import RaffleCard from "../../components/RaffleCard";
import { RiArrowRightUpLine } from "react-icons/ri";
import { Container, Flex, SimpleGrid, Text } from "@mantine/core";

function RelatedRaffles() {
	const raffles = [
		{
			title: "Win One Bed Room Flat in Akoka-Yaba, Lagos State, Nigeria",
			description: "Play for a chance to own the latest iPhone.",
			fee: "₦2K",
			image: raffleImg,
			sold: 70,
			date: "June 2, 2025 | 10:00am",
			status: "active",
		},
		{
			title: "Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria",
			description:
				"Enter now to grab the opportunity of a brand new Samsung Galaxy.",
			fee: "₦3K",
			image: raffleImg,
			sold: 60,
			date: "June 2, 2025 | 10:00am",
			status: "upcoming",
		},
		{
			title:
				"Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria",
			description: "Take part for a chance to win a MacBook Pro.",
			fee: "₦5K",
			image: raffleImg,
			sold: 50,
			date: "June 2, 2025 | 10:00am",
			status: "active",
		},
	];

	return (
		<Container size="xl" my="xl">
			<Flex className=" flex !flex-col md:!flex-row md:!justify-between"  mb="xl">
				<div>
					<Text fz="h2" fw={700}>
						Related Raffles
					</Text>
					<Text fz="md" className="!text-secondary-text">
						Checkout related raffle games and play now
					</Text>
				</div>
				<Link to="#">
					<Text className="!text-primary-red !flex !gap-x-3 !items-center hover:!underline hover:!text-primary-red/60 transition-all ease-linear duration-300">
						Explore All (60)
						<span>
							<RiArrowRightUpLine className="bg-black text-white font-light text-lg rounded-full" />
						</span>
					</Text>
				</Link>
			</Flex>
			<SimpleGrid
				type="container"
				cols={{ base: 1, "680px": 2, "1080px": 3 }}
				spacing={{ base: 10 }}
			>
				{raffles.map((raffle, idx) => (
					<RaffleCard key={idx} {...raffle} />
				))}
			</SimpleGrid>
		</Container>
	);
}

export default RelatedRaffles;
