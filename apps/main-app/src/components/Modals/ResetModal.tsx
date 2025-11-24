import { Modal, Button, Center, Image, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CustomButton from "../Buttons/CustomButton";
type Props = {
	title?:string
	desc?:string
	btnLabel?:string
}
function ResetModal({title, desc, btnLabel }:Props) {
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
						src="/src/assets/success.gif"
						className="!mx-auto"
						h={200}
						w={100}
					/>

					<Stack>
						{" "}
						<Text className="!text-2xl !font-semibold !tracking-wide">
							{/* New Password Created */}
							{title}
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							{/* Congratulations, you have successfully created a new password for
							your WindFall raffle Account. Now start playing */}
							{desc}
						</Text>
						<Button className="!border !border-dashed !border-secondary-red !h-12 !tracking-wide">
							{/* Login into your Account */}
							{btnLabel}
						</Button>
					</Stack>
				</Center>
			</Modal>
			
			<CustomButton onClick={open}>
				Create Password
			</CustomButton>

		</>
	);
}

export default ResetModal;
