import { Badge, Button, Container, Group } from "@mantine/core";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function CustomPagination() {
	return (
		<Container
			size="xl"
			className="!border !border-gray-200 !py-5 !rounded-lg bg-white"
		>
			<Group justify="center">
				<Button
					className="!border !rounded-2xl !text-grey-500 !bg-white !shadow-inner !text-sm !py-2 !text-primary-text !font-medium !capitalize"
					// onClick={() => setPage((p) => Math.max(p - 1, 1))}
					leftSection={<FaAngleLeft className="text-2xl " />}
				>
					previous
				</Button>
				<Badge className="!bg-primary-text !font-medium" size="lg">
					page 1 of 10
				</Badge>
				<Button
					className="!border !rounded-2xl !text-grey-500 !bg-white !shadow-inner !text-sm !py-2 !text-primary-text !font-medium !capitalize"
					// onClick={() => setPage((p) => Math.max(p - 1, 1))}
					rightSection={<FaAngleRight className="text-2xl " />}
				>
					next
				</Button>
			</Group>
		</Container>
	);
}

export default CustomPagination;
