import {
	Container,
	Card,
	Text,
	Flex,
	Stack,
	TextInput,
	List,
} from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import header from "../../assets/Create New Password.png";
import { FiEye } from "react-icons/fi";
import ResetModal from "../../components/Modals/SuccessModal";

function ResetPassword() {
	return (
		<div className="mb-10 flex flex-col h-full">
			<div
				className="relative w-full h-[150px] md:h-[200px] lg:h-[300px] bg-contain bg-no-repeat"
				style={{
					backgroundImage: ` url(${header})`,
				}}
			/>

			<Container className="!w-2/5 !mb-32 !mt-20">
				<Card withBorder className="!rounded-lg">
					<header className="flex gap-3 items-center mb-7">
						<HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
						<div className="capitalize">
							<Text className="!font-semibold !text-2xl">Password</Text>
							<Text fz="lg" className="!text-secondary-text">
								Enter new pass word below
							</Text>
						</div>
					</header>
					<form>
						<Stack className="!capitalize" gap="xl">
							<TextInput
								label="create new password"
								placeholder="Enter your password"
								withAsterisk
								rightSection={<FiEye />}
								classNames={{ label: "!text-lg" }}
							/>
							<List className="!text-secondary-text !list-disc">
								<List.Item>8–12 characters</List.Item>
								<List.Item>
									Use both Uppercase letters (A-Z) and Lowercase letter (a-z).
								</List.Item>
								<List.Item>Include Numbers (0–9)</List.Item>
								<List.Item>Special characters (e.g. !@ # $ % ^ & *)</List.Item>
							</List>
							<TextInput
								label="confirm your new password"
								placeholder="Confirm new password"
								withAsterisk
								rightSection={<FiEye />}
								classNames={{ label: "!text-lg" }}
							/>
						</Stack>
						<Flex justify="flex-end" className="!mt-7 !mb-3">
							<ResetModal />
						</Flex>
					</form>
				</Card>
			</Container>
		</div>
	);
}

export default ResetPassword;
