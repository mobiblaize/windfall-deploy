import { Skeleton } from "@mantine/core";

export default function RenderSkeletonText({
  width = "60%",
  height = 18,
  className = "",
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <Skeleton className={className} height={height} width={width} radius="md" />
  );
}
