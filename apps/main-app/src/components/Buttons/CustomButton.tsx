// components/CustomButton.tsx
import { Button } from "@mantine/core";
import type { ButtonProps, MantineSize } from "@mantine/core";

type CustomButtonProps = ButtonProps & {
  type?: "primary" | "dark";
  fullWidth?: boolean;
  onClick?: () => void;
  size?: MantineSize | "compact-xs" | "compact-sm" | "compact-md" | "compact-lg" | "compact-xl" | (string & {});
  border?: boolean; // New prop
};

export default function CustomButton({
  disabled,
  children,
  type = "primary",
  fullWidth = false,
  onClick,
  border = true, // default true
  size="lg",
  ...props
}: CustomButtonProps) {
  const getBgColor = () => {
    switch (type) {
      case "primary":
        return "!bg-primary-red";
      case "dark":
        return "!bg-black";
      default:
        return "!bg-black";
    }
  };

  return (
    <Button
      {...props}
      type="button"
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      style={{
        backgroundColor: "#ef4444",
        color: "#fff",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...props.style,
      }}
      className={`text-sm font-semibold py-2 ${getBgColor()} !rounded-md transition 
        ${border ? "!border-2 !border-dashed !border-secondary-red" : "!border-none"} 
        ${!disabled ? "hover:bg-primary-red" : ""} 
        ${props.className || ""}`}
    >
      {children}
    </Button>
  );
}
