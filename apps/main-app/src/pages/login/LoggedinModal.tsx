import { Modal, Button, Center, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function LoggedinModal() {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Modal opened={opened} onClose={close} withCloseButton={false} centered>
				<Center>
					<div className="rounded-full p-2 border border-dotted ">
						<Image src="/src/assets/success.gif" h={80} width={80} />
					</div>
				</Center>
			</Modal>

			<Button
				onClick={open}
				className="!border !border-dashed !text-white !border-secondary-red disabled:!border-primary-red disabled:!bg-primary-red/40 md:!w-24"
			>
				Login
			</Button>
		</>
	);
}

export default LoggedinModal;
