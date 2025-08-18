import { Select, Divider, Container, SimpleGrid } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import GamesCard from "./GamesCard";
import MyGameHeader from "./MyGameHeader";
import raffleImg from '../../assets/default-raffle.png';
import instantRaffleImg from '../../assets/instant-raffle.png';
import type { Raffle } from "../../models/raffles";

const raffles: Raffle[] = [
  {
	title: 'Win One Bed Room Flat in Akoka-Yaba, Lagos State, Nigeria',
	description: 'Play for a chance to own the latest iPhone.',
	fee: '₦2K',
	image: raffleImg,
	sold: 70,
	date: 'June 2, 2025 | 10:00am',
	status: 'active',
	category: 'apartment',
	prizeType: 'iPhone',
	ticketType: 'MacBook',
	drawTime: '8am',
	gameType: 'raffle',
  },
  {
	title: 'Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria',
	description: 'Enter now to grab the opportunity of a brand new Samsung Galaxy.',
	fee: '₦3K',
	image: instantRaffleImg,
	sold: 60,
	date: 'June 2, 2025 | 10:00am',
	status: 'active',
	category: 'apartment',
	prizeType: 'Samsung',
	ticketType: 'MacBook',
	drawTime: '9am',
	gameType: 'instant',
  },
  {
	title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
	description: 'Take part for a chance to win a MacBook Pro.',
	fee: '₦5K',
	image: raffleImg,
	sold: 0,
	date: 'June 2, 2025 | 10:00am',
	status: 'completed',
	category: 'apartment',
	prizeType: 'MacBook',
	ticketType: 'MacBook',
	drawTime: '10am',
	gameType: 'raffle',
  },
  {
	title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
	description: 'Take part for a chance to win a MacBook Pro.',
	fee: '₦5K',
	image: instantRaffleImg,
	sold: 0,
	date: 'June 2, 2025 | 10:00am',
	status: 'completed',
	category: 'apartment',
	prizeType: 'MacBook',
	ticketType: 'MacBook',
	drawTime: '10am',
	gameType: 'instant',
  },
  {
	title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
	description: 'Take part for a chance to win a MacBook Pro.',
	fee: '₦5K',
	image: raffleImg,
	sold: 0,
	date: 'June 2, 2025 | 10:00am',
	status: 'completed',
	category: 'apartment',
	prizeType: 'MacBook',
	ticketType: 'MacBook',
	drawTime: '10am',
	gameType: 'raffle',
  },
  {
	title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
	description: 'Take part for a chance to win a MacBook Pro.',
	fee: '₦5K',
	image: instantRaffleImg,
	sold: 0,
	date: 'June 2, 2025 | 10:00am',
	status: 'completed',
	category: 'apartment',
	prizeType: 'MacBook',
	ticketType: 'MacBook',
	drawTime: '10am',
	gameType: 'instant',
  },
];

function GamesTab() {
	return (
		<div className="">
			<MyGameHeader
				title="game list"
				description="A list of your Games and their respective status"
			>
				<Select
					data={[""]}
					placeholder="My Games: Show All"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</MyGameHeader>

			<Divider />
			<Container size="xl" my="xl">
				<SimpleGrid
					py="lg"
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "md", sm: "xl" }}
				>
					{raffles.map((item, index) => (
						<GamesCard key={index} {...item} />
					))}
				</SimpleGrid>
			</Container>
		</div>
	);
}

export default GamesTab;
