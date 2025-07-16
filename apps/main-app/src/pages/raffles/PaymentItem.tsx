import { Badge, Card, Flex, Image, Text } from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { Link } from "react-router-dom";

function PaymentItem({ item }: { item: any }) {
	return (
		<div className="col-span-1">
			<Card className="!bg-transparent !w-full">
				<Flex justify="center" my="lg">
					<Image src="/src/assets/Wallet.png" h={200} w={200} />
				</Flex>
				<Link to="#">
					<Card
						withBorder
						radius="xl"
						py="lg"
						px="xl"
						className="text-center cursor-pointer hover:!bg-white/50 hover:!shadow-sm transition-all ease-in-out duration-300"
					>
						<Text className="!font-bold !text-lg md:!text-xl">
							1 Bed Room Flat at Banana Island, Lagos State, Nigeria
						</Text>
						<Text
							className="!text-secondary-text !text-sm md:!text-base"
							my="sm"
						>
							Win 3 bed room flat at the high prestige location
						</Text>
						<Flex
							justify="space-around"
							gap={5}
							my="lg"
							className="!text-secondary-text"
						>
							<Flex gap={3}>
								<BsFillTicketPerforatedFill className="text-primary-red text-xl" />
								<Text className="!text-nowrap">Ticket(s): 32</Text>
							</Flex>
							<Flex gap={3}>
								<FaCalendarAlt className="text-primary-red text-xl" />
								<Text className="!text-nowrap">Purchased: April 11, 2025</Text>
							</Flex>
						</Flex>
						<div className="shadow-md !rounded-5xl flex items-center justify-center py-2 px-1 md:px-0 rounded-4xl mb-5">
							<Flex
								align="center"
								gap="sm"
								className="!bg-[#15B79E] !py-3 !px-2 !rounded-3xl w-full sm:!w-11/12 !mx-auto !flex-nowrap"
							>
								<Badge className="!bg-[#125D56] !p-3  !font-medium">
									Draw Date
								</Badge>
								<Text className="!text-white !tracking-wide !text-sm ">
									July 10,2025 | 10:00am
								</Text>
							</Flex>
						</div>
					</Card>
				</Link>
			</Card>
		</div>
	);
}

export default PaymentItem;
