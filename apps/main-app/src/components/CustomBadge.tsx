type StatusType = "successful" | "pending" | "failed";

interface CustomBadgeProps {
  status: StatusType;
  label?: string
}

export default function CustomBadge({ status, label }: CustomBadgeProps) {
  const lower = status?.toLowerCase();

  const styles =
    lower === "successful"
      ? "!bg-[#CCFBEF] !text-[#06B280]" // green
      : lower === "pending"
      ? "!bg-[#FEF9C3] !text-[#B45309]" // yellow
      : "!bg-[#FEF3F2] !text-[#B42318]"; // red or other

  return (
    <p
      className={`py-[2px] px-2 rounded-xl inline-block font-medium !capitalize ${styles}`}
    >
      {label || status || "Unknown"}
    </p>
  );
}
