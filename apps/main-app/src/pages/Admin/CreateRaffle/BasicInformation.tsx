import {
	Box,
	Card,
	Checkbox,
	Divider,
	Radio,
	Select,
	SimpleGrid,
	Text,
	TextInput,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { FaAngleDown } from "react-icons/fa";

type Props = {};
function BasicInformation({}: Props) {
	return (
		<Box>
			<SimpleGrid cols={{ base: 1, sm: 2 }}>
				<Box>
					<Text tt="capitalize" fw={500}>
						Raffle name
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						enter unique name for this raffle
					</Text>
				</Box>
				<TextInput
					placeholder="Enter raffle name"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						short description
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						briefly describe what this raffle is all about.
					</Text>
				</Box>
				<TextInput
					placeholder="Enter raffle description"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						Raffle category
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Put this raffle in a specific category.
					</Text>
				</Box>
				<Select
					placeholder="Select category"
					data={[
						"instant raffle",
						"money raffle",
						"one-time raffle",
						"house raffle",
						"luxury raffle",
						"general raffle",
					]}
					rightSection={<FaAngleDown />}
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						Raffle prize
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						prize to be won in this raffle.
					</Text>
				</Box>
				{/* <Select
					placeholder="Select prize"
					data={[]}
					rightSection={<FaAngleDown />}
					classNames={{ input: "placeholder:text-xs" }}
				/> */}
				<TextInput
					placeholder="Enter raffle description"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						Raffle date
					</Text>
					<Text fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Define the start and End date for this raffle i.e When raffle would
						go live all on website and mobile App.
					</Text>
				</Box>
				<Box>
					<Radio
						label="straight to live raffle game"
						variant="outline"
						description="Therefore raffle would go to live as soon as it published from the
						admin, ticket would be available for purchase instantly"
					/>
					<Card withBorder mt="md" radius="md" className="p-4">
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
							<DateInput
								label="Start date"
								placeholder="Pick start date"
								required
								classNames={{ input: "placeholder:text-xs" }}
							/>
							<DateInput
								label="End date"
								placeholder="Pick end date"
								required
								classNames={{ input: "placeholder:text-xs" }}
							/>
						</SimpleGrid>
						<Divider my="md" />
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
							<TimeInput
								label="Start time"
								required
								classNames={{ input: "placeholder:text-xs" }}
							/>
							<TimeInput
								label="End time"
								required
								classNames={{ input: "placeholder:text-xs" }}
							/>
						</SimpleGrid>
					</Card>
					<Radio
						mt="md"
						label="schedule raffle"
						variant="outline"
						description="Raffle would go to live as soon as it is published from the admin, but ticket would only be available after the defined raffle scheduled date."
					/>
				</Box>
			</SimpleGrid>

			<Divider my="md" />
			<Box
				className="border-y border-dashed border-primary-red bg-secondary-red "
				py={"sm"}
				px={"md"}
				my={"md"}
			>
				<Text tt="capitalize" fw={500} fz={"sm"}>
					other details
				</Text>
				<Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
					other raffle important detail
				</Text>
			</Box>
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						allow use of promo code
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						enable use of promo code for discounted ticket.
					</Text>
				</Box>
				<Box c={"var(--secondary-text)"} fz="xs">
					<Checkbox
						variant="outline"
						label="No, Don't allow promo code for payment"
						fz="xs"
					/>
					<Checkbox
						variant="outline"
						label="Yes, allow promo code for payment"
						fz="xs"
						mt="sm"
					/>
				</Box>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						referral payment
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Enable referrals to boost user participation.
					</Text>
				</Box>
				<Box c={"var(--secondary-text)"} fz="xs">
					<Checkbox
						variant="outline"
						label="No, Don't allow referral balance for payment"
						fz="xs"
					/>
					<Checkbox
						variant="outline"
						label="Yes, allow referral balance for payment"
						fz="xs"
						mt='sm'
					/>
				</Box>
			</SimpleGrid>
			<Divider my="md" />
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
				<Box>
					<Text tt="capitalize" fw={500}>
						CTA text
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						Enter the catching call to action
					</Text>
				</Box>
				<TextInput
					placeholder="Enter CTA text"
					classNames={{ input: "placeholder:text-xs" }}
				/>
			</SimpleGrid>
			<Divider my="md" />
		</Box>
	);
}

export default BasicInformation;
