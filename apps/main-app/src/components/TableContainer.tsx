import { Table } from "@mantine/core";
type Props = {
	headers: string[];
	children: React.ReactNode;
};

function TableContainer({ headers, children }: Props) {
	return (
		<Table
			striped
			verticalSpacing="sm"
			horizontalSpacing="md"
			highlightOnHover
			withTableBorder
		>
			<Table.Thead>
				<Table.Tr>
					{headers.map((item) => (
						<Table.Th key={item} className="capitalize text-base !tracking-wide">
							{item}
						</Table.Th>
					))}
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{children}</Table.Tbody>
		</Table>
	);
}

export default TableContainer;
