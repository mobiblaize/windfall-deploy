import { Card, Avatar, Button, Text } from "@mantine/core";
import { IoIosAdd } from "react-icons/io";
type Props = {
	width?: string | number;
	height?: string | number;
};
function EmptyImageCard({ width = 384, height = 269 }: Props) {
	return (
		<Card
			withBorder
			radius="md"
			className="flex flex-col items-center justify-center text-center p-4 gap-y-2"
		>
			<Avatar
				src="/src/assets/image.png"
				className="bg-secondary-text/20 !p-2"
				radius="100%"
			/>
			<Text
				// tt="capitalize"
				fw={100}
				fz="xs"
				c="var(--secondary-text)"
				className="mt-2"
			>
				Select an Image. Not more than 1MB. Recommended Size: {width} p (Width)
				by {height} p (Height) jpg. png or img
			</Text>
			<Button
				variant="outline"
				rightSection={
					<IoIosAdd
						size={20}
						className="bg-[#f8c6c6] text-primary-red rounded-sm"
					/>
				}
				className="!text-primary-text !border-secondary-text !py-2 mt-4"
			>
				Upload Image
			</Button>
		</Card>
	);
}

export default EmptyImageCard;
