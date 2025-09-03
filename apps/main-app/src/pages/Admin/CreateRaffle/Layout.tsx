import { Box, Container, Divider, Flex, Text } from "@mantine/core";
import React from "react";

type Props = {
	description: string;
	label: string;
	className: string;
	children: React.ReactNode;
};

function Layout({ description, label, children, className }: Props) {
	return (
		<Container className={`${className}`} px={0}>
			<Flex>
				<Box>
					<Text fw={600} fz={"lg"} c="var(--primary-red)" tt="capitalize">
						{label}
					</Text>
					<Text fz={"sm"} c="var(--secondary-text)" tt="capitalize">
						{description}
					</Text>
				</Box>
			</Flex>
			<Divider my="md" />
			{children}
		</Container>
	);
}

export default Layout;
