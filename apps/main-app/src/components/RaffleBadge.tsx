import { colorMap, type RaffleStatus } from "../models/raffles";

interface RaffleBadgeProps {
  date: string;
  status: RaffleStatus;
  label?: string;
  className?: string;
}

export default function RaffleBadge({ date, status, label, className }: RaffleBadgeProps) {
  const colors = colorMap[status];

  return (
    <span
      className={`inline-flex h-[40px] items-center text-xs px-4 py-1 border-2 text-white border-[#f6fefc] rounded-full mx-auto shadow-[0_2px_8px_0_rgba(150,194,155,0.32)] ${className}`}
      style={{ backgroundColor: colors.bg }}
    >
      <span
        className="inline-flex h-[24px] items-center rounded-full text-white px-2"
        style={{ backgroundColor: colors.label }}
      >
        {label || colors.text}
      </span>
      &nbsp; {date}
    </span>
  );
}
