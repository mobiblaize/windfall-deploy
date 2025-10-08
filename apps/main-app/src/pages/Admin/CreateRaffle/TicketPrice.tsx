import {
	Accordion,
	Box,
	Card,
	Center,
	Checkbox,
	Divider,
	SimpleGrid,
	Text,
	TextInput,
} from "@mantine/core";

type Props = {};

function TicketPrice({}: Props) {
	return (
		<Box>
			<Text tt="capitalize" fz={"md"} fw={500}>
				cost breakdown
			</Text>
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						cost of prize
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Set the cost of prize for this raffle game / draw
					</Text>
				</Box>
				<TextInput
					placeholder="Enter cost of prize"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						percentage markup
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						the percentage of the revenue markup
					</Text>
				</Box>
				<TextInput
					placeholder="Enter value in percentage"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Box
				className="border-y border-dashed border-primary-red bg-secondary-red "
				py={"sm"}
				px={"md"}
				my={"md"}
			>
				<Center>
					<Box className="text-center">
						<Text tt="capitalize" c="var(--secondary-text)" fz={"sm"}>
							expected sales (cost and profit markup)
						</Text>
						<Text tt="capitalize" fw={500} fz={"lg"}>
							{(2000000).toLocaleString()} (100%)
						</Text>
					</Box>
				</Center>
			</Box>
			<Text tt="capitalize" fz={"md"} fw={500}>
				ticket pricing breakdown
			</Text>
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						recommend ticket cost
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Ticket cost value recommended based on cost breakdown. Can edit
					</Text>
				</Box>
				<TextInput
					placeholder="Enter value"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						recommend ticket quantity
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Ticket quantity recommended base on cost breakdown.
					</Text>
				</Box>
				<TextInput
					placeholder="Automate"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<Box
				className="border-y border-dashed border-primary-red bg-secondary-red "
				py={"sm"}
				px={"md"}
				my={"md"}
			>
				<Text tt="capitalize" fw={500} fz={"sm"}>
					Raffle Ticketing Discounting Structure
				</Text>
				<Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
					Define what percentage of discount is applicable at a certain number
					of purchase.
				</Text>
			</Box>
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						recommend ticket quantity
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Ticket quantity recommended base on cost breakdown.
					</Text>
				</Box>
				<Box>
					<Checkbox
						label="apply to unit price of ticket"
						description="Discount is applied to each ticket individually For example: Ticket = ₦5,000 ; Discount = 10% ; Buyer gets each ticket for ₦4,500"
					/>
					<Checkbox
						mt={"md"}
						label="Apply to Culmination of Ticket Unit"
						description="Discount is applied after adding up the total cost. For example: 5 Tickets = ₦25,000 ; Discount = 10% ; Total after discount = ₦22,500 "
					/>
				</Box>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						Discount hierarchy
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						create discount structure
					</Text>
				</Box>

				<Box className="space-y-3">
					{[1, 2, 3].map((item) => (
						<Card
							key={item}
							withBorder
							p={"sm"}
							radius="md"
							className="bg-secondary-text"
						>
							<Accordion chevronIconSize={17}>
								<Accordion.Item value="discount hierarchy">
									<Accordion.Control>Discount Hierarchy</Accordion.Control>
									<Accordion.Panel>
										<SimpleGrid cols={{ base: 1, sm: 2 }} spacing={"md"}>
											<TextInput
												label="minimum ticket range"
												required
												classNames={{ label: "text-xs font-medium capitalize" }}
											/>
											<TextInput
												label="maximum ticket range"
												required
												classNames={{ label: "text-xs font-medium capitalize" }}
											/>
										</SimpleGrid>
										<TextInput
											mt="md"
											label="% discount applicable"
											placeholder="Enter value in percentage"
											required
											classNames={{ label: "text-xs font-medium capitalize" }}
										/>
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Card>
					))}
				</Box>
			</SimpleGrid>
			<Divider my="lg" />
		</Box>
	);
}

export default TicketPrice;
