import { instantGameColorMap, type RaffleStatus } from "../models/raffles";

interface RaffleBadgeProps {
  date?: string;
  active?: string;
  status?: RaffleStatus;
  label?: string;
  description?: string;
  className?: string;
  bgColor?: string;
}

export default function InstantRaffleBadge({
  active,
  className,
  label,
  status,
  description,
  bgColor,
}: RaffleBadgeProps) {
  const colors =
    instantGameColorMap[
      (active === "false") || (status === "ended") ? "closed" : "open"
    ];    

  return (
    <span
      className={`inline-flex h-[40px] items-center text-xs px-4 py-1 border-2 text-white border-[#f6fefc] rounded-full mx-auto shadow-[0_2px_8px_0_rgba(150,194,155,0.32)] bg-instant-blue ${className}`}
    >
      <span
        className="inline-flex h-[24px] items-center rounded-full text-white px-2 text-nowrap"
        style={{ backgroundColor: bgColor ?? colors.color }}
      >
        {label || colors.text}
      </span>
      &nbsp; {description ?? "Instant Game"}
    </span>
  );
}
