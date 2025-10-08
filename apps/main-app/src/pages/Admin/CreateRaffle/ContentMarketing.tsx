import { Box, Text } from "@mantine/core";
import TextEditor from "./TextEditor";

type Props = {};

function ContentMarketing({}: Props) {
	return (
		<Box>
			<Box
				className="border-y border-dashed border-primary-red bg-secondary-red "
				py={"sm"}
				px={"md"}
				my={"md"}
			>
				<Text tt="capitalize" fw={500} fz={"md"}>
					competition details
				</Text>
				<Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
					other raffle important detail
				</Text>
			</Box>

			<TextEditor />

			<Box
				className="border-y border-dashed border-primary-red bg-secondary-red "
				py={"sm"}
				px={"md"}
				my={"lg"}
			>
				<Text tt="capitalize" fw={500} fz={"md"}>
					sponsorship details
				</Text>
				<Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
					Enter the raffle sponsors details below
				</Text>
			</Box>
			<TextEditor />
		</Box>
	);
}

export default ContentMarketing;
