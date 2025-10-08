import { Table } from "@mantine/core";
type Props = {
	children: React.ReactNode;
	headers: string[];
};
function RaffleCustomTable({ children, headers }: Props) {
	return (
		<div className="overflow-x-auto">
			<Table
				striped
				highlightOnHover
				className="min-w-full"
				verticalSpacing={"xs"}
				horizontalSpacing={"lg"}
			>
				<Table.Thead>
					<Table.Tr className="capitalize whitespace-nowrap">
						{headers?.map((item, index) => (
							<Table.Th key={index} className="text-xs xs:text-sm">
								{item}
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>

				<Table.Tbody>{children}</Table.Tbody>
			</Table>
		</div>
	);
}

export default RaffleCustomTable;
