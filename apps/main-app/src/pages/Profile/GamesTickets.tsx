import { Container, Divider, Flex, Select, SimpleGrid } from "@mantine/core";
import MyGameHeader from "./MyGameHeader";
import ProfileHeader from "./ProfileHeader";
import { FaAngleDown } from "react-icons/fa";
import GamesTicketModal from "../../components/Modals/GamesTicketModal";
import { Anchor, Breadcrumbs } from "@mantine/core";
import { useParams } from "react-router-dom";

function GamesTickets() {
	const { id } = useParams();
	

	const items = [
		{ title: "all games", href: "/profile/all-games" },
		{ title: "view specific game", href: `/profile/all-games/${id}` },
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
				<Divider className="!shadow-lg"/>
			</div>
			<ProfileHeader />
			<div>
				<MyGameHeader
					title={"My Games Tickets"}
					description={"A list of your ticket bought for this game "}
				>
					<Flex gap={10}>
						<Select data={[]} rightSection={<FaAngleDown />} w={150} />
						<Select data={[]} rightSection={<FaAngleDown />} w={150} />
					</Flex>
				</MyGameHeader>
				<Container size="xl" mt={32}>
					<SimpleGrid
						py="lg"
						cols={{ base: 1, md: 2 }}
						spacing={{ base: 10, sm: "xl" }}
						verticalSpacing={{ base: "md", sm: "xl" }}
					>
						{[1, 2, 3, 4, 5].map((item) => {
							return <GamesTicketModal item={item} key={item} />;
						})}
					</SimpleGrid>
				</Container>
			</div>
		</div>
	);
}

export default GamesTickets;
