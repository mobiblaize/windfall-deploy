import {
	Divider,
	Button,
	Container,
	Card,
	Box,
	Text,
	Flex,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import MyGameHeader from "./MyGameHeader";
import ProfileHeader from "./ProfileHeader";

function TransactionReceipt() {
	return (
		<div className="text-primary-text mb-32 pt-5">
			{/* <Breadcrumbs>{items}</Breadcrumbs> */}

			<ProfileHeader />
			<MyGameHeader
				title="My Transaction receipt"
				description="View and download transaction receipt."
			>
				<Button
					variant="outline"
					fw={500}
					className="!border-secondary-text/50 !text-secondary-text !tracking-wide hover:!bg-secondary-text/10 !transition-all !duration-300 !ease-in-out"
					rightSection={<RiArrowRightUpLine />}
				>
					Download Transaction Receipt
				</Button>
			</MyGameHeader>
			<Divider />
			<Container size="xl" my="xl">
				<Card
					withBorder
					py="lg"
					px="md"
					radius="md"
					className="mx-auto md:w-2/5"
				>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>transaction date</Text>
							<Text>April 11,2025</Text>
						</Flex>
						<Divider />
					</Box>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>transaction time</Text>
							<Text>11:00 am W.A.T</Text>
						</Flex>
						<Divider />
					</Box>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>paid via</Text>
							<Text>visa *948#</Text>
						</Flex>
						<Divider />
					</Box>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>payment proccessor</Text>
							<Text>payStack</Text>
						</Flex>
						<Divider />
					</Box>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>transacion id</Text>
							<Text>AS#78979087</Text>
						</Flex>
						<Divider />
					</Box>
					<Box className="capitalize !text-lg">
						<Flex justify="space-between" py="sm">
							<Text>payment status</Text>
							<Text>success</Text>
						</Flex>
						<Divider />
					</Box>
                    <Box className="border border-dashed border-primary-red bg-secondary-red">
                        <div>
                            <Text></Text>
                            <Text>#</Text>
                        </div>
                    </Box>
				</Card>
			</Container>
		</div>
	);
}

export default TransactionReceipt;
