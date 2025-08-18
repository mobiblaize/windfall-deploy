import { Badge } from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";

interface InstantBadgeProps {
  size?: "sm" | "md";
}

export default function InstantBadge({ size = "md" }: InstantBadgeProps) {
  const styles = {
    sm: {
      height: 25,
      textClass: "!text-xs !font-medium",
      iconSize: 12,
      padding: "!px-2",
    },
    md: {
      height: 40,
      textClass: "!text-sm !font-medium",
      iconSize: 15,
      padding: "!px-3",
    },
  };

  const current = styles[size];

  return (
    <Badge
      size="xl"
      color="#E0F2FE"
      c="#026AA2"
      h={current.height}
      className={`!capitalize ${current.textClass} ${current.padding}`}
    >
      <div className="flex items-center">
        <span className="mr-1">Instant Game</span>
        <IconBolt size={current.iconSize} className="!font-bold" />
      </div>
    </Badge>
  );
}
