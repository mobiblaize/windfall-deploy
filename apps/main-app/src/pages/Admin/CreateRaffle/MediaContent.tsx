import {
	Box,
	SimpleGrid,
	Text,
	Divider,
} from "@mantine/core";
import EmptyImageCard from "./EmptyImageCard";


type Props = {};

function MediaContent({}: Props) {
	return (
		<Box>
			<SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
				<Box>
					<Text tt="capitalize" fz={"md"} fw={500}>
						Product card image
					</Text>
					<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
						for raffle list card and and explore image
					</Text>
				</Box>
				<EmptyImageCard/>
			</SimpleGrid>
			<Divider my="lg" />
			<Box>
				<Text tt="capitalize" fz={"md"} fw={500}>
					Product card image
				</Text>
				<Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
					for raffle list card and and explore image
				</Text>
			</Box>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <EmptyImageCard width="490" height="500"/>
        <EmptyImageCard width="490" height="500"/>
        <EmptyImageCard width="490" height="500"/>
        <EmptyImageCard width="490" height="500"/>
      </SimpleGrid>
      <Divider my="lg" />
		</Box>
	);
}

export default MediaContent;
