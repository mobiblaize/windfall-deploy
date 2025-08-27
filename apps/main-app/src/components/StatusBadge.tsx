import { Badge } from "@mantine/core";

const statusColors: Record<string, { bg: string; color: string }> = {
	active: {
		bg: "var(--color-secondary-green)",
		color: "var(--color-primary-green)",
	},
	live: {
		bg: "var(--color-secondary-green)",
		color: "var(--color-primary-green)",
	},
	pending: {
		bg: "var(--color-secondary-warning)",
		color: "var(--color-primary-warning)",
	},
	completed: {
		bg: "var(--color-secondary-green)",
		color: "var(--color-primary-green)",
	},
	"draw completed": {
		bg: "var(--color-light-blue)",
		color: "var(--color-instant-blue)",
	},
	upcoming: {
		bg: "var(--color-secondary-red)",
		color: "var(--color-primary-red)",
	},
};

function StatusBadge({ status }: { status: string }) {
	let statusKey: string = "";

	if (typeof status === "string" && status.trim()) {
		statusKey = status.toLowerCase();
	} else if (typeof status === "number") {
		statusKey =
			status === 1 ? "active"
			: status === 0 ? "inactive"
			: "unknown";
	} else {
		statusKey = "unknown";
	}

	const colorData = statusColors[statusKey] || {
		bg: "var(--color-grey-500)",
		color: "white",
	};

	return (
		<Badge
			style={{
				backgroundColor: colorData?.bg,
				color: colorData?.color,
				fontSize: "8px",
				fontWeight: 600,
				display: "flex",
				alignItems: "center",

				// gap: "2px",
			}}
		>
			
			<span>{status || "No Status"}</span>
		</Badge>
	);
}

export default StatusBadge;
