import {
	Modal,
	Button,
	Center,
	Image,
	Text,
	Stack,
	TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import warningGif from "../../assets/warning.gif";

function ForgetPassword() {
	const [opened, { close }] = useDisclosure(false);
	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				withCloseButton={false}
				centered
				size="md"
				className="!rounded-2xl !text-primary-text"
				classNames={{ content: "!rounded-3xl" }}
			>
				<Center className="!grid !text-center">
					<Image
						// fit="contain"
						src={warningGif}
						className="!mx-auto"
						h={100}
						w={200}
					/>

					<Stack>
						{" "}
						<Text className="!text-2xl !font-semibold !tracking-wide">
							Forget Password
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							To start the forget password process, kindly enter your email
							below.
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							Don’t not close this window after you press “Yes Forget Password”
							Button
						</Text>
					</Stack>
				</Center>
				<Stack my="md">
					<TextInput
						label="your email address"
						placeholder="Enter your email address"
						withAsterisk
						classNames={{ label: "!text-lg" }}
					/>
					<Button
						disabled
						className="!rounded-md !border !border-dashed !border-secondary-red !h-12 !tracking-wide disabled:!bg-primary-red/40 !text-white"
					>
						Yes, Forget password
					</Button>
				</Stack>
			</Modal>

			{/* <Button
				// disabled
				onClick={open}
				className=" !tracking-wide !border !border-dashed !border-secondary-red disabled:!bg-primary-red/40  !text-white"
			>
				Create password
			</Button> */}
		</>
	);
}

export default ForgetPassword;
