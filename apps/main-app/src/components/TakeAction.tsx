import { Box, Button, Menu, Text, Group, Loader, Divider } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import type { ReactNode } from "react";

export interface ActionItem {
	id: string;
	label: string;
	description: string;
	onClick: () => void | Promise<void>;
	disabled?: boolean;
	loading?: boolean;
	icon?: ReactNode;
	color?: "default" | "red" | "blue" | "green";
	divider?: boolean; // Add divider before this item
	hidden?: boolean; // Conditionally hide action
}

interface TakeActionProps {
	actions?: ActionItem[];
	buttonLabel?: string;
	buttonVariant?: "outline" | "filled" | "light" | "subtle";
	buttonSize?: "xs" | "sm" | "md" | "lg" | "xl";
	loading?: boolean; // Overall loading state for button
	disabled?: boolean; // Overall disabled state for button
	className?: string;
	onActionComplete?: () => void; // Callback after action completes
}

export const TakeAction = ({ 
	actions = [],
	buttonLabel = "Take Action",
	buttonVariant = "outline",
	buttonSize = "md",
	loading = false,
	disabled = false,
	className = "",
	onActionComplete,
}: TakeActionProps) => {
	// Filter out hidden actions
	const visibleActions = actions.filter(action => !action.hidden);

	// Don't render if no visible actions provided
	if (!visibleActions || visibleActions.length === 0) {
		return null;
	}

	const handleActionClick = async (action: ActionItem) => {
		if (action.disabled || action.loading) {
			return;
		}

		try {
			const result = action.onClick();
			// Handle async actions
			if (result instanceof Promise) {
				await result;
			}
			// Call completion callback if provided
			if (onActionComplete) {
				onActionComplete();
			}
		} catch (error) {
			console.error("Action execution error:", error);
			// Error handling can be added here or in the onClick handler itself
		}
	};

	// Get color classes for action items
	const getColorClass = (color?: ActionItem["color"]) => {
		switch (color) {
			case "red":
				return "hover:!text-red-600 data-[hovered]:!bg-red-50";
			case "blue":
				return "hover:!text-blue-600 data-[hovered]:!bg-blue-50";
			case "green":
				return "hover:!text-green-600 data-[hovered]:!bg-green-50";
			default:
				return "";
		}
	};

	return (
		<Menu
			transitionProps={{ transition: "slide-left", duration: 200 }}
			shadow="md"
			width={280}
			position="bottom-end"
			closeOnItemClick={true}
			classNames={{
				label: "!capitalize",
				item: "capitalize",
				dropdown: "capitalize !p-2",
			}}
		>
			<Menu.Target>
				<Button 
					variant={buttonVariant}
					size={buttonSize}
					className={`!text-secondary-text !border-[#D0D5DD] scale-90 sm:scale-100 ${className}`}
					rightSection={loading ? <Loader size="xs" /> : <FaAngleDown />}
					disabled={disabled || loading}
					loading={loading}
				>
					{buttonLabel}
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{visibleActions.map((action, index) => (
					<div key={action.id}>
						{action.divider && index > 0 && (
							<Divider my="xs" />
						)}
						<Menu.Item
							className={`!capitalize ${getColorClass(action.color)} ${
								action.disabled ? "!opacity-50 !cursor-not-allowed" : ""
							}`}
							disabled={action.disabled || action.loading}
							onClick={() => handleActionClick(action)}
							leftSection={
								action.loading ? (
									<Loader size="xs" />
								) : action.icon ? (
									<Box className="!text-secondary-text">
										{action.icon}
									</Box>
								) : undefined
							}
						>
							<Box className="flex flex-col gap-0.5">
								<Group gap="xs" align="center" wrap="nowrap">
									<Text fw={500} fz="sm" className="!capitalize">
										{action.label}
									</Text>
									{action.color === "red" && (
										<Box className="w-1 h-1 rounded-full bg-red-500" />
									)}
								</Group>
								<Text 
									tt="capitalize" 
									fz="xs" 
									className="!text-secondary-text line-clamp-2"
								>
									{action.description}
								</Text>
							</Box>
						</Menu.Item>
					</div>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};
