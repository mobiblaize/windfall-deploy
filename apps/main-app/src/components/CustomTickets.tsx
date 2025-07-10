import { Card, Box } from "@mantine/core";
import type React from "react";

type Props = {
	cardClick?: () => void;
	children: React.ReactNode;
	className?: string;
	borderColor?: string;
};
function CustomTickets({
	children,
	cardClick: onclick,
	className,
	borderColor = "border-secondary-text",
}: Props) {
	return (
		<Card className="!p-0 hover:cursor-pointer" onClick={onclick}>
			<Box
				className={`relative max-w-2xl !bg-white border border-dashed border-secondary-text px-12 py-4 md:py-12 ${className}`}
			>
				{/* Left large top cut-out */}
				<div
					className={`absolute left-0 top-2/5 -translate-x-1/2 -translate-y-40 w-20 h-20 bg-gray-50 rounded-full border border-dashed  ${borderColor}`}
				/>
				{/* Left large bottom cut-out */}
				<div
					className={`absolute left-0 bottom-2/5 -translate-x-1/2 translate-y-40 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>

				{/* Left small perforation */}
				<div
					className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-12 w-4 h-4 bg-gray-50 rounded-full border border-dashed border-secondary-text ${borderColor}`}
				/>
				<div
					className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>
				<div
					className={`absolute left-0 top-1/2 -translate-x-1/2 translate-y-0 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>
				<div
					className={`absolute left-0 top-1/2 -translate-x-1/2 translate-y-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>

				{/* Right large top cut-out */}
				<div
					className={`absolute right-0 top-2/5 translate-x-1/2 -translate-y-40 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>
				{/* Right large bottom cut-out */}
				<div
					className={`absolute right-0 bottom-2/5 translate-x-1/2 translate-y-40 w-20 h-20 bg-gray-50 rounded-full border border-dashed  ${borderColor}`}
				/>

				{/* Right small perforation */}
				<div
					className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-12 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>
				<div
					className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed  ${borderColor}`}
				/>
				<div
					className={`absolute right-0 top-1/2 translate-x-1/2 translate-y-0 w-4 h-4 bg-gray-50 rounded-full border border-dashed  ${borderColor}`}
				/>
				<div
					className={`absolute right-0 top-1/2 translate-x-1/2 translate-y-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
				/>

				{/* Ticket content */}
				{children}
			</Box>
		</Card>
	);
}

export default CustomTickets;
