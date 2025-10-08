import {
	Modal,
	ActionIcon,
	Flex,
	Box,
	Text,
	Stack,
	Card,
	Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";

function TransactionDetailModal() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				centered
				withCloseButton={false}
				className="!text-primary-text"
                size={"md"}
                radius={"md"}
			>
				{/* Modal content */}
				<Stack gap={"lg"}>
					<Flex justify={"space-between"} align={"start"}>
						<Box>
							<Text fz="lg" fw={"bold"} tt={"capitalize"}>
								transaction detail
							</Text>
							<Text fz="xs" tt={"capitalize"}>
								specific transaction detail of a game
							</Text>
						</Box>

						<IoIosClose
							onClick={close}
							size={20}
							className="text-primary-red bg-red-200 rounded-sm  flex justify-center"
						/>
					</Flex>
					<Card
						withBorder
						radius={"md"}
						className="!border-dashed !capitalize !border-primary-red !bg-secondary-red !text-primary-red"
					>
						<Flex justify={"space-between"} align={"center"}>
							<Text>Game ticket</Text>
							<Text>ten (10)</Text>
						</Flex>
					</Card>
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Product</Table.Th>
								<Table.Th>Units sold</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{[1, 2]?.map((item) => (
								<Table.Tr key={item}>
									<Table.Td>{item}</Table.Td>
									<Table.Td>{item}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Stack>
			</Modal>

			<ActionIcon className="!bg-[#FFD5D6]" onClick={open}>
				<RiArrowRightUpLine className="text-primary-red" />
			</ActionIcon>
		</>
	);
}

export default TransactionDetailModal;
