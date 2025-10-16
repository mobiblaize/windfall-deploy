import { Box, Text } from "@mantine/core";
import TextEditor from "./TextEditor";
import type { UseFormReturnType } from "@mantine/form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {form: UseFormReturnType<any>};

function ContentMarketing({form}: Props) {
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

			<TextEditor form={form} name="competition_details" />

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
			<TextEditor form={form} name="sponsorship_details" />
		</Box>
	);
}

export default ContentMarketing;
