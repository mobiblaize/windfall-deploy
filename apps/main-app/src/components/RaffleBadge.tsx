// components/RaffleBadge.tsx
interface RaffleBadgeProps {
  date: string;
  status: string;
  label?: string; // optional custom label
}

const colorMap = {
  active: {
    bg: "#15b79e",
    label: "#125d56",
    text: "Draw Date",
  },
  completed: {
    bg: "#64748b", // slate-500
    label: "#334155", // slate-800
    text: "Completed",
  },
  upcoming: {
    bg: "#f79009", // amber-500
    label: "#93370d", // amber-900
    text: "Coming Soon",
  },
};

export default function RaffleBadge({ date, status, label }: RaffleBadgeProps) {
  const colors = colorMap[status];

  return (
    <span
      className="inline-flex h-[40px] items-center text-xs px-4 py-1 border-2 border-[#f6fefc] rounded-full mx-auto shadow-[0_2px_8px_0_rgba(150,194,155,0.32)]"
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
