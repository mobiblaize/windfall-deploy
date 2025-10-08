import {
	Modal,
	Stack,
	Flex,
	Box,
	Card,
	Table,
	ActionIcon,
	Text,
	Group,
	Avatar,
	Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { IoIosClose } from "react-icons/io";
import { RiArrowRightUpLine } from "react-icons/ri";
import StatusBadge from "../../../components/StatusBadge";

function CustomerModal() {
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
				<Stack gap={"xl"}>
					<Flex justify={"space-between"} align={"start"}>
						<Box>
							<Text fz="lg" fw={"bold"} tt={"capitalize"}>
								raffle customer detail
							</Text>
							<Text fz="xs" tt={"capitalize"}>
								see the detail of customer that plays this game
							</Text>
						</Box>

						<IoIosClose
							onClick={close}
							size={20}
							className="text-primary-red hover:bg-red-200 rounded-sm  flex justify-center"
						/>
					</Flex>
					<Flex justify={"space-between"} align="center">
						<Group>
							<Avatar size={"lg"} radius={"sm"} className="border border-primary-red" />
							<Box>
								<Text fz="xs" c="var(--secondary-text)">
									Hameedat adekunle
								</Text>
								<Text fz="xs" c="var(--secondary-text)">
									ID:9044| +234903456789
								</Text>
								<StatusBadge status="verified" />
							</Box>
						</Group>
						<Button
							tt="capitalize"
							radius="xl"
							rightSection={<RiArrowRightUpLine />}
							variant="outline"
							className="!border-secondary-text/50 !text-secondary-text/50"
						>
							view details
						</Button>
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

export default CustomerModal;
