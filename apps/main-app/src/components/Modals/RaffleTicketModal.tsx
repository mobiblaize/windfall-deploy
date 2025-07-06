import { Modal, Button, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HiDocumentArrowDown } from "react-icons/hi2";
import RaffleGroupItem from "../../pages/raffles/RaffleGroupItem";

function RaffleTicketModal({ item }: { item: any }) {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				withCloseButton={false}
				centered
				size="lg"
				className="!rounded-2xl !text-primary-text"
			>
				<div className="my-7 mx-7">
					<RaffleGroupItem item={item} />
				</div>

				<Flex gap={20} my="xl" mx="xl">
					<Button
						rightSection={
							<HiDocumentArrowDown className="text-secondary-red/90" />
						}
						className="!w-full !border-2 !border-dashed !border-secondary-red !h-12 !text-lg !tracking-wide"
					>
						Downlod Ticket
					</Button>
					<Button className="!bg-primary-text !w-full !h-12 !text-lg !tracking-wide">
						Copy Ticket Number
					</Button>
				</Flex>
			</Modal>

			<RaffleGroupItem item={item} onclick={open} />
		</>
	);
}

export default RaffleTicketModal;
