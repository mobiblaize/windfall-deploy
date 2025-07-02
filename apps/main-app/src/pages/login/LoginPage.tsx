import {
	Card,
	Container,
	Stack,
	Text,
	TextInput,
	Flex,
	Button,
} from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import header from "../../assets/Secured Login.png";
import LoggedinModal from "./LoggedinModal";
function LoginPage() {
	return (
		<div className="mb-10 flex flex-col h-full">
			<div
				className="relative w-full h-[150px] md:h-[200px] lg:h-[300px] bg-contain bg-no-repeat"
				style={{
					backgroundImage: ` url(${header})`,
				}}
			/>

			<Container className="!w-2/5 !mb-32 !mt-20"  >
				<Card withBorder className="!rounded-lg">
					<header className="flex gap-3 items-center mb-7">
						<HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
						<div>
							<Text className="!font-semibold !text-2xl">Login</Text>
							<Text fz="lg" className="!text-secondary-text">
								Enter Correct Details
							</Text>
						</div>
					</header>
					<form>
						<Stack className="!capitalize" gap="xl">
							<TextInput
								label="your email address"
								placeholder="Enter your email address"
								withAsterisk
							/>
							<TextInput
								label="your password"
								placeholder="Enter your password"
								withAsterisk
								rightSection={<FiEye />}
							/>
							<Flex justify="flex-end">
								<Text>
									Forget password ?{" "}
									<Text
										component="span"
										className="!text-primary-red !underline"
									>
										Reset Today
									</Text>{" "}
								</Text>
							</Flex>
						</Stack>
						<Flex justify="flex-end" className="!mt-7 !mb-3">
							<LoggedinModal/>
						</Flex>
					</form>
				</Card>
			</Container>
		</div>
	);
}

export default LoginPage;
