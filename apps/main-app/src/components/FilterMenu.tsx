import { Menu, Button, Text, Box } from "@mantine/core";
import { FaAngleDown, FaRegCircleDot } from "react-icons/fa6";
import { IoFilterOutline } from "react-icons/io5";

type Props = { items: any[] };
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
					className="!border-secondary-text !text-secondary-text !capitalize"
					variant="outline"
					rightSection={<IoFilterOutline size={18} />}
				>
					filter by: show all
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label className="!flex items-center gap-2">
					{" "}
					<FaRegCircleDot className="text-primary-red" />
					show all
				</Menu.Label>
				{items?.map((item) => (
					<Menu.Item className="!capitalize">{item}</Menu.Item>
				))}
				{/* <Menu.Item className="!capitalize">live games</Menu.Item>
					<Menu.Item className="!capitalize">draw completed</Menu.Item>
					<Menu.Item className="!capitalize">upcoming games</Menu.Item> */}
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
					className="!border-secondary-text !text-secondary-text !capitalize"
					variant="outline"
					rightSection={<IoFilterOutline size={18} />}
				>
					sort by: show all
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label className="!flex items-center gap-2">
					{" "}
					<FaRegCircleDot className="text-primary-red" />
					show all
				</Menu.Label>
				{items?.map((item) => (
					<Menu.Item className="!capitalize">{item}</Menu.Item>
				))}
				{/* <Menu.Item className="!capitalize">draw pending</Menu.Item>
				<Menu.Item className="!capitalize">draw completed</Menu.Item> */}
			</Menu.Dropdown>
		</Menu>
	);
};

export const TakeAction = () => {
	return (
		<Menu
			transitionProps={{ transition: "slide-left", duration: 200 }}
			shadow="md"
			width={250}
			classNames={{
				label: "!capitalize",
				item: "capitalize",
				dropdown: "capitalize",
			}}
		>
			<Menu.Target>
				<Button
					variant="outline"
					className="!text-secondary-text !border-secondary-text scale-90 sm:scale-100"
					rightSection={<FaAngleDown />}
					
				>
					Take action
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item className="!capitalize">
					<Box>
						<Text fw={500} fz="md">
							start a draw
						</Text>
						<Text tt="capitalize" fz="xs" className="!text-secondary-text">
							start a draw for this ganme
						</Text>
					</Box>
				</Menu.Item>
				<Menu.Item className="!capitalize">
					<Box>
						<Text fw={500} fz="md">
							edit raffle
						</Text>
						<Text tt="capitalize" fz="xs" className="!text-secondary-text">
							live game edit is limited
						</Text>
					</Box>
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};
