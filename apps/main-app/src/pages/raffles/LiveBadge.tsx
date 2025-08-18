import { Badge } from "@mantine/core";
import { liveGameColorMap } from "../../models/raffles";

interface LiveBadgeProps {
  status: 'live' | 'closed';
}

export default function LiveBadge({ status }: LiveBadgeProps) {
  const colors = liveGameColorMap[status];

  return (
    
      <Badge size="xl" color={colors.bg} c={colors.color} h={40} className="!capitalize !text-base !font-medium">
        {colors.text}
      </Badge>
  );
}
