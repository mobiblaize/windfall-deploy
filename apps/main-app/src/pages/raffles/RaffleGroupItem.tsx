import { Card, Text, Box } from "@mantine/core";

function RaffleGroupItem({ item, onclick }: { item: any; onclick?:any }) {
	return (
		<Card
			shadow="md"
			padding="xl"
			radius="md"
			withBorder
			className="!border-dashed !border-2 !rounded-3xl !relative !overflow-hidden cursor-pointer hover:!shadow-lg hover:!shadow-secondary-red hover:!bg-white/40 transition-all duration-200 ease-in-out"
			style={{
				clipPath: `polygon(
				20px 0%, calc(100% - 20px) 0%,
				100% 20px, 100% calc(100% - 20px),
				calc(100% - 20px) 100%, 20px 100%,
				0% calc(100% - 20px), 0% 20px
			  )`,
			}}
			onClick={onclick}
		>
			<Text fw={700} fz="lg">
				{item} Bed Room Flat at Banana Island, Lagos State, Nigeria
			</Text>

			<Text c="dimmed" fz="sm" mb="xl">
				Win 3 bed room flat at the high prestige location
			</Text>

			<Box className="bg-secondary-red p-2 rounded-lg border-dashed border-2 border-primary-red text-center">
				<Text fz="sm" mb={5}>
					Ticket Number
				</Text>
				<Text fw={700} fz="xl" c="red">
					#WF100423X8)
				</Text>
			</Box>
		</Card>
	);
}

export default RaffleGroupItem;
