import {
	Text,
	Container,
	Card,
	TextInput,
	Stack,
	Select,
	Checkbox,
	Flex,
	Button,
} from "@mantine/core";
import { CiCalendar } from "react-icons/ci";
import { DateInput } from "@mantine/dates";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
function Signup() {
	return (
		<div className="text-primary-text mt-16 mb-32">
			<Container px={0} size={560} className="!mx-3 sm:!mx-auto">
				<Text className="!text-2xl !font-semibold">
					Checkout <span className="text-primary-red">(07)</span>
				</Text>
				<Text className="!text-secondary-text">
					Buy Raffle ticket in very simple step and stand a chance to win big!!!
				</Text>
				<Card
					my="lg"
					withBorder
					className="!border !border-primary-red !bg-secondary-red !py-5"
				>
					<div className="flex gap-3 items-center">
						<FaUser
							size={32}
							className="text-primary-red text-2xl p-1 rounded-full bg-secondary-red/70"
						/>
						<Text className="!text-secondary-text !tracking-wide">
							No Account Detected. Do you have Windfall Account ?{" "}
							<span className="text-primary-red underline">Log in</span>
						</Text>
					</div>
				</Card>
				<Card withBorder>
					<Card.Section mx="xs" my="xs">
						<Text className="!text-primary-text !font-semibold !text-xl">
							Sign up to WindFall
						</Text>
						<Text className="!text-secondary-text">
							Sign Up now in easy steps
						</Text>
					</Card.Section>
					<Card.Section mx="xs" my="xs" className="">
						<form>
							<Stack gap="xl">
								<TextInput
									label="Your Full Name"
									placeholder="Enter Your Full Name"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
								/>
								<DateInput
									label="date of birth"
									placeholder="Enter date of birth"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									rightSection={<CiCalendar />}
								/>
								<TextInput
									label="Your email address"
									placeholder="Enter Your email address"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
								/>
								<TextInput
									label="phone number"
									placeholder="Enter phone number"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
								/>
								<Select
									data={[]}
									label="country"
									placeholder="select country"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									searchable
									rightSection={<FaAngleDown />}
								/>
								<Select
									data={[]}
									label="state"
									placeholder="select state"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									searchable
									rightSection={<FaAngleDown />}
								/>
								<Select
									data={[]}
									label="l.g.a"
									placeholder="select l.g.a"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									searchable
									rightSection={<FaAngleDown />}
								/>
								<TextInput
									label="refferal code (optional)"
									placeholder="Enter refferal code"
									classNames={{ input: "!capitalize", label: "!capitalize " }}
								/>
								<TextInput
									label="how did you hear about us"
									placeholder=""
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
								/>
								<TextInput
									label="create password"
									placeholder="create a password"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									rightSection={<FiEye />}
								/>
								<TextInput
									label="confirm password"
									placeholder="confirm your password"
									withAsterisk
									classNames={{ input: "!capitalize", label: "!capitalize " }}
									rightSection={<FiEye />}
								/>
								<Stack gap="sm">
									<Checkbox
										defaultChecked
										label=" I want to receive exclusive offers, raffles update and promo alerts via email. "
										variant="outline"
									/>
									<Checkbox
										defaultChecked
										label="I have read and agree to the Privacy Policy, Terms and Game Rules"
										variant="outline"
									/>
									<Checkbox
										defaultChecked
										label="By creating your account, you acknowledge and confirm that you are at least 18 years old and have read and accept WinIt’s policies relating to age verification."
										variant="outline"
									/>
								</Stack>
							</Stack>
							<Flex justify="flex-end" my="lg">
								<Button
									disabled
									className="disabled:!bg-primary-red/40 !text-white !border !border-dashed !border-secondary-red !h-12 !tracking-wide md:!w-32"
								>
									Sign Up
								</Button>
							</Flex>
						</form>
					</Card.Section>
				</Card>
			</Container>
		</div>
	);
}

export default Signup;
