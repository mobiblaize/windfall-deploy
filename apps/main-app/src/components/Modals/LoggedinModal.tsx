import { Modal, Button, Center, Image, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function LoggedinModal() {
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
							Login successful
						</Text>
						<Text className="!text-lg !text-secondary-text !tracking-wide">
							Congratulation, you have successfully log in to tour WindFall
							raffle Account. Now start playing
						</Text>
						<Button className="!border !border-dashed !border-secondary-red !h-12 !tracking-wide">
							Continue
						</Button>
					</Stack>
				</Center>
			</Modal>

			<Button
				onClick={open}
				className="md:!w-28 !tracking-wide !border !border-dashed !border-secondary-red"
			>
				Login
			</Button>
		</>
	);
}

export default LoggedinModal;
