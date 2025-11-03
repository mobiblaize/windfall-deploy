import { Menu, Button } from "@mantine/core";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoFilterOutline } from "react-icons/io5";

type Props = { items: string[] };

export function FilterMenu({ items }: Props) {
	return (
		<Menu
			shadow="md"
			width={200}
			classNames={{
				label: "!capitalize",
				item: "capitalize",
				dropdown: "capitalize",
			}}
		>
			<Menu.Target>
				<Button
					className="!border-[#D0D5DD] !text-secondary-text !capitalize"
					variant="outline"
					rightSection={<IoFilterOutline size={18} />}
				>
					filter by: show all
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label className="!flex items-center gap-2">
					<FaRegCircleDot className="text-primary-red" />
					show all
				</Menu.Label>
				{items?.map((item, idx) => (
					<Menu.Item className="!capitalize" key={idx}>{item}</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
}

export const SortMenu = ({ items }: Props) => {
	return (
		<Menu
			shadow="md"
			width={200}
			classNames={{
				label: "!capitalize",
				item: "capitalize",
				dropdown: "capitalize",
			}}
		>
			<Menu.Target>
				<Button
					className="!border-[#D0D5DD] !text-secondary-text !capitalize"
					variant="outline"
					rightSection={<IoFilterOutline size={18} />}
				>
					sort by: show all
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label className="!flex items-center gap-2">
					<FaRegCircleDot className="text-primary-red" />
					show all
				</Menu.Label>
				{items?.map((item, idx) => (
					<Menu.Item className="!capitalize" key={idx}>{item}</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};