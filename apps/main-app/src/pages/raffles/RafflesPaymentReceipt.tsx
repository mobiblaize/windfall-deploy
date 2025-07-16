import { Button, Container, Flex, SimpleGrid, Text } from "@mantine/core";
import PaymentItem from "./PaymentItem";
import RelatedRaffles from "./RelatedRaffles";

function RafflesPaymentReceipt() {
	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="xl" className="!mx-3 sm:!mx-auto">
				<Flex className="flex flex-col md:flex-row gap-3 justify-between">
					<div>
						<Text className="!text-2xl !font-semibold">
							Payment Receipt ID:
							<span className="text-primary-red">9049404GJSB</span>
						</Text>
						<Text className="!text-secondary-text">
							Buy Raffle ticket in very simple step and stand a chance to win
							big!!!
						</Text>
					</div>
					<Button className=" !text-white !border !border-dashed !border-secondary-red !h-12 !tracking-wide !rounded-xl !w-40 md:!w-fit">
						Download Receipt
					</Button>
				</Flex>
				<SimpleGrid
					type="container"
					cols={{ base: 1, "680px": 2, "1080px": 3 }}
					spacing={{ base: 1 }}
				>
					{[1, 2, 3, 4, 5].map((item) => (
						<PaymentItem key={item} item={item} />
					))}
				</SimpleGrid>
				<RelatedRaffles />
			</Container>
		</div>
	);
}

export default RafflesPaymentReceipt;
