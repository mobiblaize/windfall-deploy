import {
  Modal,
  Box,
  Image,
  Button,
  type ButtonProps,
} from "@mantine/core";
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

export default function AdminAlertModal({
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
        {getStatusImage() && <Image
          src={primaryButton?.loading ? loadingImg : getStatusImage()}
          alt={status}
          className="w-[100px] h-[100px] mx-auto mb-5"
          fit="contain"
          radius="md"
        />}

        <div className={`!text-3xl !font-semibold !mb-4 ${getTitleColor()}`}>
          {title}
        </div>

        <div className="!text-base !text-[#818181]">{description}</div>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && (
          <Box className="justify-center gap-4 mt-6 space-y-5">
            {primaryButton && (
              <CustomButton
                fullWidth
                size="lg"
                disabled={primaryButton.disabled}
                border={false}
                onClick={primaryButton.onClick}
                className="flex-1 !font-medium"
              >
                {primaryButton.label}
              </CustomButton>
            )}

            {secondaryButton && (
              <Button
                fullWidth
                size="lg"
                disabled={secondaryButton.disabled}
                onClick={secondaryButton.onClick}
                variant="default"
                className="flex-1 !font-medium"
              >
                {secondaryButton.label}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
