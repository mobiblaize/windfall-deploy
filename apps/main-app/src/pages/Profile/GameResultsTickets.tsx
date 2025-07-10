import {
	Anchor,
	Box,
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Flex,
	Group,
	Select,
	SimpleGrid,
	Text,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import { HiMiniTicket } from "react-icons/hi2";
import CustomTickets from "../../components/CustomTickets";
import { PiWarningOctagonFill } from "react-icons/pi";

function GameResultsTickets() {
	const { id } = useParams();

	const items = [
		{ title: "Home", href: "/" },
		{ title: "results", href: "/profile/results" },
		{ title: "specific game result", href: `${id}` },
	].map((item, index) => (
		<Anchor
			className="!text-secondary-text !text-sm"
			href={item.href}
			key={index}
		>
			{item.title}
		</Anchor>
	));
	return (
		<div className="text-primary-text mb-32">
			<div className="px-10 bg-white py-3">
				<Breadcrumbs className="!text-secondary-text py-2 capitalize px-3">
					{items}
				</Breadcrumbs>
				<Divider className="!shadow-lg" />
			</div>
			<ProfileHeader />
			<MyGameHeader
				count="0"
				title="game result"
				description="A list of result pertaining to your games"
			>
				<Select
					data={[""]}
					placeholder="view: List view"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</MyGameHeader>
			<Container size="xl" mt={32}>
				<Box className="border border-primary-red rounded-xl py-4 bg-secondary-red !my-10 px-7">
					<Flex justify="space-between">
						<Group>
							<PiWarningOctagonFill className="text-primary-red text-3xl"/>
							<Text>
								So sorry you didn’t win this time. Stand a Chance to Win Next
								Time.{" "}
							</Text>
						</Group>
						<Button className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red">
							Explore Games
						</Button>
					</Flex>
				</Box>
				<SimpleGrid
					py="lg"
					cols={{ base: 1, md: 2 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "md", sm: "xl" }}
				>
					{[1, 2, 3, 4, 5, 6].map((item) => {
						return (
							<CustomTickets
								key={item}
								className="!border-primary-red"
								borderColor="!border-primary-red"
								// cardClick={handleClick}
							>
								<Text fw={700} fz="lg">
									{item} Bed Room Flat at Banana Island, Lagos State, Nigeria
								</Text>

								<Text c="dimmed" fz="sm" mb="xl">
									Win 3 bed room flat at the high prestige location
								</Text>

								<Box className="bg-secondary-red py-2 rounded-lg border-dashed border border-primary-red text-center">
									<Text fz="sm" mb={5}>
										Ticket Number
									</Text>
									<Text fw={700} fz="xl" className="!text-primary-red">
										#WF100423X8)
									</Text>
								</Box>
								<Box mt={24} className="flex items-center !justify-center">
									<Button
										rightSection={<HiMiniTicket />}
										className="!tracking-wide !capitalize !rounded-2xl !border !border-dashed !border-primary-red !h-8 !text-primary-red !bg-secondary-red"
									>
										lost
									</Button>
								</Box>
							</CustomTickets>
						);
					})}
				</SimpleGrid>
			</Container>
		</div>
	);
}

export default GameResultsTickets;
