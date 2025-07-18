// components/MainButton.tsx
import { Button } from "@mantine/core";
import type { ReactNode } from "react";

interface MainButtonProps {
  children: ReactNode;
  onClick?: () => void;
  rightSection?: ReactNode;
  variant?: "primary" | "dark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function MainButton({
  children,
  onClick,
  rightSection,
  variant = "primary",
  size = "xl",
  className = "",
}: MainButtonProps) {
  const baseStyles = {
    backgroundColor: variant === "primary" ? "var(--primary-red)" : "black",
    color: "#fff",
  };

  const baseClassName =
    "text-sm font-semibold !rounded-xl transition !border-2 !border-dashed !border-secondary-red";

  const hoverClass =
    variant === "primary"
      ? "hover:bg-red-600"
      : "hover:bg-gray-900 !shadow-md";

  return (
    <Button
      size={size}
      onClick={onClick}
      style={baseStyles}
      className={`${baseClassName} ${hoverClass} ${className}`}
      rightSection={rightSection}
    >
      {children}
    </Button>
  );
}
