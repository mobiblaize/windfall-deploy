import { Card, Box } from "@mantine/core";
import type React from "react";

type Props = {
  cardClick?: () => void;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  containerBgColor?: string;
  borderColor?: string;
};
function CustomTickets({
  children,
  cardClick: onclick,
  className,
  bgColor = "!bg-white",
  containerBgColor = "bg-gray-50",
  borderColor = "border-secondary-text",
}: Props) {
  return (
    <Card className="!p-0 hover:cursor-pointer w-full !h-fit" onClick={onclick}>
      <Box
        className={`relative max-w-full max-h-full border border-dashed border-secondary-text px-12 py-4 md:py-12 ${bgColor} ${className}`}
      >
        {/* Left large top cut-out */}
        <div
          className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        {/* Left large bottom cut-out */}
        <div
          className={`absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-20 h-20 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />

        {/* Left small perforation */}
        <div
          className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-12 w-4 h-4 ${containerBgColor} rounded-full border border-dashed border-secondary-text ${borderColor}`}
        />
        <div
          className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-6 w-4 h-4 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute left-0 top-1/2 -translate-x-1/2 translate-y-0 w-4 h-4 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute left-0 top-1/2 -translate-x-1/2 translate-y-6 w-4 h-4 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />

        {/* Right large top cut-out */}
        <div
          className={`absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-20 h-20 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        {/* Right large bottom cut-out */}
        <div
          className={`absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-20 h-20 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        {/* Right small perforation */}
        <div
          className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-12 w-4 h-4 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-6 w-4 h-4 ${containerBgColor} rounded-full border border-dashed  ${borderColor}`}
        />
        <div
          className={`absolute right-0 top-1/2 translate-x-1/2 translate-y-0 w-4 h-4 ${containerBgColor} rounded-full border border-dashed  ${borderColor}`}
        />
        <div
          className={`absolute right-0 top-1/2 translate-x-1/2 translate-y-6 w-4 h-4 ${containerBgColor} rounded-full border border-dashed ${borderColor}`}
        />

        {/* Ticket content */}
        {children}
      </Box>
    </Card>
  );
}

export default CustomTickets;
