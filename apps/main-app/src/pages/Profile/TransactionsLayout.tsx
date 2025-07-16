import {
	Select,
	Divider,
	Group,
	Box,
	Flex,
	Text,
	Button,
	TextInput,
	Table,
    ActionIcon,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import ProfileHeader from "./ProfileHeader";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import TableContainer from "../../components/TableContainer";

function TransactionsLayout() {
	return (
		<div className="text-primary-text mb-32 pt-5">
			{/* <Breadcrumbs>{items}</Breadcrumbs> */}

			<ProfileHeader />
			<MyGameHeader
				title="My Transaction"
				description="Manage your transaction with ease today."
			>
				<Select
					data={[""]}
					placeholder="Date: all time"
					rightSection={<FaAngleDown />}
					className="w-[180px]"
				/>
			</MyGameHeader>
			<Divider />
			<section className="mx-10 my-10">
				<Box className=" border !border-secondary-text/50  rounded-xl bg-white">
					<>
						<Flex justify="space-between" px="md" pt="lg">
							<div>
								<Text fz={30} fw="bold">
									Game Transaction List
								</Text>
								<Text className="!text-secondary-text">
									Track and manage transaction with ease.{" "}
								</Text>
							</div>
							<Button
								variant="outline"
								className=" !border-secondary-text/50 !text-secondary-text !rounded-lg !text-lg !h-12"
								rightSection={<HiDocumentArrowDown />}
							>
								Export
							</Button>
						</Flex>
						<Divider mt="md" mb="lg" />
						<Flex justify="space-between" px="md" mb="lg">
							<TextInput
								leftSection={<HiSearch />}
								placeholder="Search"
								className="!w-72 !rounded-xl shadow-md"
							/>
							<Group>
								<Select
									rightSection={<IoFilterOutline />}
									placeholder="sort by: show all"
									className=" !shadow-md"
								/>
								<Select
									rightSection={<IoFilterOutline />}
									placeholder="filter by: show all"
									className=" !shadow-md"
								/>
							</Group>
						</Flex>
						
					</>

					<TableContainer
						headers={[
							"Transaction ID",
							"Transaction date&  time",
							"paid via",
							"Transaction value",
							"payment chanel",
                            "transaction status",
                            "receipt"
						]}
					>
						{[1, 2, 3, 4, 5, 6].map((item) => {
							return (
								<Table.Tr>
									<Table.Td className="text-secondary-text">{item}</Table.Td>
									<Table.Td></Table.Td>
									<Table.Td></Table.Td>
									<Table.Td></Table.Td>
									<Table.Td></Table.Td>
									<Table.Td></Table.Td>
									<Table.Td>
										<ActionIcon className="!bg-secondary-red">
											<LuDownload />
										</ActionIcon>
									</Table.Td>
								</Table.Tr>
							);
						})}
                    </TableContainer>
                    <Flex my="md" justify="space-between" px="lg" align="center">
                        <Text className="">Page 1 of 10</Text>
                        <Group>
                            <Button variant="outline" className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text">Previous</Button>
                            <Button variant="outline" className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text">Next</Button>
                        </Group>
                    </Flex>
				</Box>
			</section>
		</div>
	);
}

export default TransactionsLayout;
