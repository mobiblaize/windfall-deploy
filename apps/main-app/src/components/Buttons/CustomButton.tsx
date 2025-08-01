// components/CustomButton.tsx
import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

type CustomButtonProps = ButtonProps & {
  type?: 'primary' | 'dark';
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function CustomButton({
  disabled,
  children,
  type = 'primary',
  fullWidth = false,
  onClick,
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
      size="lg"
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
      className={`text-sm font-semibold py-2 ${getBgColor()} !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
        !disabled ? "hover:bg-red-600" : ""
      } ${props.className || ""}`}
    >
      {children}
    </Button>
  );
}
