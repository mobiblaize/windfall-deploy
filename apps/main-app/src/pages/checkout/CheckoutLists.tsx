import {
	Card,
	Text,
	Stack,
	Flex,
	Image,
	Button,
	Divider,
	TextInput,
} from "@mantine/core";
import CheckoutItem from "./CheckoutItem";

function CheckoutLists() {
	return (
		<div className="grid grid-flow-row lg:grid-cols-5 gap-7">
			<Card withBorder className="!space-y-10 !rounded-xl h-fit !col-span-5 sm:col-span-3">
				<header>
					<Text className=" !font-semibold !text-lg !tracking-wide">
						<span className="text-primary-red">Review:</span> Raffle Ticket
						Order WindFall
					</Text>
					<Text className="!text-secondary-text !tracking-wide">
						List of raffle ticket(s) you intend to purchase
					</Text>
				</header>
				<section className="space-y-5">
					{[1, 2, 2, 2].map((item) => (
						<CheckoutItem key={item} item={item} />
					))}
				</section>
			</Card>
			<Card
				withBorder
				className="!rounded-xl h-fit !col-span-5 md:!col-span-2 !space-y-10 !px-5"
			>
				<header>
					<Text className=" !font-semibold !text-lg !tracking-wide">
						Pay Via
					</Text>
					<Text className="!text-secondary-text !tracking-wide">
						Select your preferred payment provider
					</Text>
				</header>
				<section className="space-y-5 mb-10">
					<Card withBorder className="!rounded-xl">
						<Flex justify="space-between" align="center">
							<div className="flex gap-x-3 items-center">
								<Image src="/src/assets/visa-icon.png" h={32} w={36} />
								<Text fw={500} fz="lg">
									PayStack
								</Text>
							</div>
							<Button variant="outline" className=" !w-20 !tracking-wide">
								Pay
							</Button>
						</Flex>
					</Card>
					<Card withBorder className="!rounded-xl">
						<Flex justify="space-between" align="center">
							<div className="flex gap-x-3 items-center">
								<Image src="/src/assets/stripe-icon.png" h={32} w={36} />
								<Text fw={500} fz="lg">
									PayStack
								</Text>
							</div>
							<Button variant="outline" className=" !w-20 !tracking-wide">
								Pay
							</Button>
						</Flex>
					</Card>
					<Card withBorder className="!rounded-xl">
						<Flex justify="space-between" align="center">
							<div className="flex gap-x-3 items-center">
								<Image src="/src/assets/googlepay-icon.png" h={32} w={36} />
								<Text fw={500} fz="lg">
									PayStack
								</Text>
							</div>
							<Button variant="outline" className=" !w-20 !tracking-wide">
								Pay
							</Button>
						</Flex>
					</Card>
				</section>
				<Divider />
				<div className="text-center !space-y-7 mb-7 ">
					<Text className="!text-secondary-text">
						We Accept a Wide range of Cards, not limited to:{" "}
					</Text>
					<Flex justify="space-around">
						<Image src="/src/assets/visa-icon.png" h={32} w={36} />
						<Image src="/src/assets/apple-pay-icon.png" h={32} w={36} />
						<Image src="/src/assets/stripe-icon.png" h={32} w={36} />
						<Image src="/src/assets/mastercard-icon.png" h={32} w={36} />
					</Flex>
					<Button className="!border !border-dashed !border-secondary-red !w-full !h-12 !rounded-lg">
						Pay Now
					</Button>
				</div>
			</Card>
			<Card withBorder className="!col-span-5 md:!col-span-3" py="xl">
				<div className="!bg-secondary-red !border-primary-red py-3 border px-3 rounded-md">
					<Text className="!text-primary-red !text-xl !font-medium">
						Checkout Summary
					</Text>
				</div>

				<Stack mx="md" my="lg" gap="xl">
					<Flex justify="space-between" align="center">
						<Text className="!text-secondary-text !capitalize">
							Enter total number of tickets
						</Text>
						<Text>140 Tickets</Text>
					</Flex>
					<Flex justify="space-between" align="center">
						<Text className="!text-secondary-text !capitalize">V.A.T</Text>
						<Text>N 0</Text>
					</Flex>
					<Flex justify="space-between" align="center">
						<Text className="!text-secondary-text !capitalize">
							total price of tickets
						</Text>
						<Text>140 Tickets</Text>
					</Flex>
					<Flex justify="space-between" align="center">
						<Text className="!text-secondary-text !capitalize">promo code</Text>
						<TextInput
							placeholder="Enter promo-code"
							description="Enter a promo-code to discounts total cost of purchase"
							inputWrapperOrder={["label", "input", "error", "description"]}
						/>
					</Flex>
					<Flex justify="space-between" align="center">
						<div>
							<Text className="!text-secondary-text !capitalize">
								Refferal balance
							</Text>
							<Text>N 20,000</Text>
						</div>
						<TextInput
							placeholder="N 0"
							description="Enter value to pay with"
							inputWrapperOrder={["label", "input", "error", "description"]}
						/>
					</Flex>
				</Stack>
				<Divider my="xl" />
				<Flex justify="space-between" align="center">
					<Text className="!text-secondary-text">Total Prices of Ticket:</Text>
					<Text className="!font-bold !text-primary-red !text-3xl">
						333,000
					</Text>
				</Flex>
			</Card>
		</div>
	);
}

export default CheckoutLists;
