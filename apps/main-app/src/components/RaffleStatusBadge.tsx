import { Badge } from "@mantine/core";
import { type RaffleStatus } from "../models/raffles";

interface RaffleStatusBadgeProps {
  status: RaffleStatus;
  className?: string;
}

const raffleStatusBadgeColorMap: Record<RaffleStatus, string> = {
  live: "#15b79e",
  ended: "#4086ef",
  inactive: "#FF2F31",
  upcoming: "#f79009",
  won: "#FF2F31",
  instant: "#039855",
};

export default function RaffleStatusBadge({ status, className }: RaffleStatusBadgeProps) {
  return (
    <Badge
      color={raffleStatusBadgeColorMap[status]}
      radius="md"
      className={`!capitalize !text-sm !h-[22px] ${className || ""}`}
      variant="light"
    >
      {status}
    </Badge>
  );
}

