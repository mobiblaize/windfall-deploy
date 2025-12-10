import {
	Modal,
	Button,
	Center,
	Image,
	Text,
	Stack,
	PinInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import emailGif from "../../assets/email.gif";
type Props = {
	btnLabel: string;
	title: string;
	description: string;
	description2: string;
};
function OTPSentModal({ btnLabel, title, description, description2 }: Props) {
	const [opened, { open, close }] = useDisclosure(false);
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
						src={emailGif}
						className="!mx-auto"
						h={100}
						w={150}
					/>

					<Stack mt="xl">
						<Text className="!text-2xl !font-semibold !tracking-wide">
							{/* OTP Sent to reset Password
							 */}
							{title}
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							{/* We send an six (6) digit OTP to your email address ola************
							gmail.com. */}
							{description}
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							{/* Enter OTP to Authorize your reset password process */}
							{description2}
						</Text>
						<PinInput
							size="md"
							length={6}
							placeholder="_"
							className="!mx-auto"
							oneTimeCode
						/>
						<Text size="sm" className="!text-primary-red">
							15:00
						</Text>
						<Text>
							Didn’t Receive Code ?{" "}
							<span className="!text-primary-red">Resend OTP</span>
						</Text>
					</Stack>
				</Center>
				<Stack my="md">
					<Button
						disabled
						className="!rounded-md !border !border-dashed !border-secondary-red !h-12 !tracking-wide disabled:!bg-primary-red/40 !text-white"
					>
						{/* Yes, Forget password */}
						{/* validate otp */}
						{btnLabel}
					</Button>
				</Stack>
			</Modal>

			<Button
				// disabled
				onClick={open}
				className=" !tracking-wide !border !border-dashed !border-secondary-red disabled:!bg-primary-red/40  !text-white"
			>
				Create password
			</Button>
		</>
	);
}

export default OTPSentModal;
