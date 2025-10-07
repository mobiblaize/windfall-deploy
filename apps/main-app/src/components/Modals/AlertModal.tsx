import { Modal, Box, Image, type ButtonProps } from "@mantine/core";
import successImg from "../../assets/success.gif";
import errorImg from "../../assets/error.gif";
import msgImg from "../../assets/message.gif";
import loadingImg from "../../assets/loading.gif";
import delImg from "../../assets/delete.gif";
import CustomButton from "../../components/Buttons/CustomButton";

type CustomButtonProps = ButtonProps & {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

type Props = {
  opened: boolean;
  onClose?: () => void;
  status?: "success" | "error" | "loading" | "message" | "delete";
  title: React.ReactNode;
  description: React.ReactNode;
  color?: "dark" | "primary";
  primaryButton?: CustomButtonProps;
  secondaryButton?: CustomButtonProps;
};

export default function AlertModal({
  opened,
  onClose,
  status,
  title,
  description,
  color = "dark",
  primaryButton,
  secondaryButton,
}: Props) {
  const getStatusImage = () => {
    switch (status) {
      case "success":
        return successImg;
      case "error":
        return errorImg;
      case "loading":
        return loadingImg;
      case "message":
        return msgImg;
      case "delete":
        return delImg;
      default:
        return "";
    }
  };

  const getTitleColor = () => {
    switch (color) {
      case "primary":
        return "!text-primary-red";
      case "dark":
        return "!text-[#2D2D2D]";
      default:
        return "!text-[#2D2D2D]";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose ? onClose : () => {}}
      centered
      withCloseButton={false}
      radius="lg"
      padding="lg"
      overlayProps={{ blur: 3, opacity: 0.2 }}
      classNames={{
        body: "bg-white px-6 pb-6 pt-10",
        content: "rounded-xl",
      }}
    >
      <Box className="text-center">
        <Image
          src={primaryButton?.loading ? loadingImg : getStatusImage()}
          alt={status}
          className="w-[100px] h-[100px] mx-auto mb-5"
          fit="contain"
          radius="md"
        />

        <div className={`!text-3xl !font-semibold !mb-4 ${getTitleColor()}`}>
          {title}
        </div>

        <div className="!text-base !text-[#818181]">{description}</div>

        {/* Buttons */}
        {(primaryButton || secondaryButton) &&
          (() => {
            const isFullWidth =
              !(primaryButton && secondaryButton) ||
              primaryButton?.fullWidth ||
              secondaryButton?.fullWidth;
            return (
              <div
                className={`grid gap-4 mt-6 grid-cols-1 ${
                  !isFullWidth ? " sm:grid-cols-2" : ""
                }`}
              >
                {primaryButton && (
                  <CustomButton
                    disabled={primaryButton.disabled}
                    loading={primaryButton.loading}
                    onClick={primaryButton.onClick}
                    className="w-full"
                    fullWidth={primaryButton.fullWidth}
                  >
                    {primaryButton.label}
                  </CustomButton>
                )}

                {secondaryButton && (
                  <CustomButton
                    type="dark"
                    disabled={secondaryButton.disabled}
                    loading={secondaryButton.loading}
                    onClick={secondaryButton.onClick}
                    variant="outline"
                    className="w-full"
                    fullWidth={secondaryButton.fullWidth}
                  >
                    {secondaryButton.label}
                  </CustomButton>
                )}
              </div>
            );
          })()}
      </Box>
    </Modal>
  );
}
