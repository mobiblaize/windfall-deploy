import { Modal, Button, Center, Image, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function OTPValidateModal() {
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
				>
					<Center className="!grid !text-center">
						<Image
							// fit="contain"
							src="/src/assets/success.gif"
							className="!mx-auto"
							h={150}
							w={100}
						/>

						<Stack>
							{" "}
							<Text className="!text-2xl !font-semibold !tracking-wide">
								OTP Validated
							</Text>
							<Text className="!text-lg !text-secondary-text ">
								Congratulation, OTP has been successfully validated. You can
								know proceed to creating a new password
							</Text>
							<Button className="!border !border-dashed !border-secondary-red !h-12 !tracking-wide !rounded-lg">
								Continue
							</Button>
						</Stack>
					</Center>
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

export default OTPValidateModal