import { Badge, Container, Flex, SimpleGrid, Text } from "@mantine/core";
import RaffleTicketModal from "../../components/Modals/RaffleTicketModal";

function RaffleGroups() {
	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="lg" className="!mx-3 sm:!mx-auto">
				<header className="grid md:grid-cols-2 gap-x-10  gap-y-5">
					<div>
						<Text className="!text-2xl !font-semibold">
							1 Bed Room Flat at Banana Island, Lagos State, Nigeria:
							<span className="text-primary-red">(32 Ticket)</span>
						</Text>
						<Text className="!text-secondary-text">
							Seize the chance to win a stunning 3 bedroom condo in a
							sought-after area
						</Text>
					</div>
					<div className=" flex justify-end">
						<div className="shadow-md p-2 rounded-4xl h-fit">
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
					</div>
				</header>
				<SimpleGrid
					type="container"
					cols={{ base: 1, "680px": 2,  }}
					spacing={{ base: 20, "720px": "xl" }}
					my="xl"
				>
					{[1, 2, 3].map((item) => (
						<RaffleTicketModal key={item} item={item} />
					))}
				</SimpleGrid>
			</Container>
		</div>
	);
}

export default RaffleGroups;
