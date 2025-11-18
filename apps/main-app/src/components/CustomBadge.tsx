export type StatusType =
  | "successful"
  | "pending"
  | "failed"
  | "active"
  | "inactive"
  | "expired"
  | "processing"
  | "cancelled"
  | "draft"
  | "info"
  | "warning";

interface CustomBadgeProps {
  status: StatusType;
  label?: string;
}

const STATUS_COLORS: Record<StatusType, { bg: string; text: string }> = {
  successful: { bg: "!bg-[#CCFBEF]", text: "!text-[#06B280]" },       // green
  pending: { bg: "!bg-[#FEF9C3]", text: "!text-[#B45309]" },           // yellow
  failed: { bg: "!bg-[#FEF3F2]", text: "!text-[#B42318]" },            // red
  active: { bg: "!bg-[#E6F4FF]", text: "!text-[#1A7FF7]" },            // blue
  inactive: { bg: "!bg-[#F5F7FA]", text: "!text-[#5A6576]" },          // mid-grey
  expired: { bg: "!bg-[#F3E8FF]", text: "!text-[#9538D6]" },           // purple
  processing: { bg: "!bg-[#F0FDF4]", text: "!text-[#15803D]" },        // green (different shade)
  cancelled: { bg: "!bg-[#FDF3F6]", text: "!text-[#C026D3]" },         // magenta/pink
  draft: { bg: "!bg-[#F1F5F9]", text: "!text-[#64748B]" },             // blue-grey
  info: { bg: "!bg-[#E0F2FE]", text: "!text-[#0369A1]" },              // info blue
  warning: { bg: "!bg-[#FEF6E0]", text: "!text-[#B45309]" },           // orange
};

export default function CustomBadge({ status, label }: CustomBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <p
      className={`py-[2px] px-2 rounded-xl inline-block font-medium !capitalize ${colors.bg} ${colors.text}`}
    >
      {label || status || "Unknown"}
    </p>
  );
}
