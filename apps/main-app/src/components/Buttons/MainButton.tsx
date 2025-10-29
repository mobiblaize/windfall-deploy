// components/MainButton.tsx
import { Button } from "@mantine/core";
import type { ReactNode } from "react";
import type { ButtonProps, MantineSize } from "@mantine/core";

type MainButtonProps = ButtonProps & {
  children: ReactNode;
  onClick?: () => void;
  rightSection?: ReactNode;
  variant?: "primary" | "dark";
  size?: | MantineSize
      | "compact-xs"
      | "compact-sm"
      | "compact-md"
      | "compact-lg"
      | "compact-xl"
      | (string & {});
  className?: string;
  buttonType?: "button" | "submit" | "reset";
}

export default function MainButton({
  buttonType = "button",
  children,
  onClick,
  rightSection,
  variant = "primary",
  size = "xl",
  className = "",
  ...props
}: MainButtonProps) {
  const baseStyles = {
    backgroundColor: variant === "primary" ? "text-primary-red" : "black",
    color: "#fff",
  };

  const baseClassName =
    "text-sm font-semibold !rounded-xl transition !border-2 !border-dashed !border-secondary-red";

  const hoverClass =
    variant === "primary"
      ? "hover:bg-primary-red"
      : "hover:bg-gray-900 !shadow-md";

  return (
    <Button
      {...props}
      size={size}
      onClick={onClick}
      type={buttonType}
      style={baseStyles}
      className={`${baseClassName} ${hoverClass} ${className}`}
      rightSection={rightSection}
    >
      {children}
    </Button>
  );
}
