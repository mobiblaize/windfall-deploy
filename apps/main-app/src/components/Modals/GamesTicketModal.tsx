import { Modal, Button, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { BsTrophyFill } from "react-icons/bs";
import GameTicketItem from "../../pages/Profile/GameTicketItem";
type Props = {
    item: any
}
function GamesTicketModal({item}:Props) {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				// withCloseButton={false}
				centered
				size="lg"
				className="!rounded-2xl !text-primary-text"
				classNames={{ content: "!rounded-3xl" }}
			>
				<div className=" mx-7">
					<GameTicketItem item={item} />
				</div>

				<Flex gap={20} my="lg" mx="xl">
					<Button
						rightSection={
							<HiDocumentArrowDown className="text-secondary-red/90" />
						}
						className="!w-full !border-2 !border-dashed !border-secondary-red !h-12 !text-lg !tracking-wide"
					>
						Downlod Ticket
					</Button>
					<Button
						className="!bg-primary-text !w-full !h-12 !text-lg !tracking-wide"
						rightSection={<BsTrophyFill />}
					>
						Claim prize
					</Button>
				</Flex>
			</Modal>

			<GameTicketItem item={item} handleClick={open} />
		</>
	);
}

export default GamesTicketModal;
