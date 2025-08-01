import { Modal, Box, Text, Image, Loader } from "@mantine/core";
import successImg from "../../assets/success.gif";
// import errorImg from "../../assets/error.gif";
import loadingImg from "../../assets/loading.gif";
import CustomButton from "../../components/Buttons/CustomButton";

type ButtonProps = {
  label: string;
  onClick: () => void;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  status: "success" | "failed" | "loading";
  title: string;
  description: string;
  color?: "dark" | "primary";
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
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
      //   case "failed":
      //     return errorImg;
      case "loading":
        return loadingImg;
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
      onClose={onClose}
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
        {status === "loading" ? (
          <Loader color="blue" size="lg" />
        ) : (
          <Image
            src={getStatusImage()}
            alt={status}
            className="w-[100px] h-[100px] mx-auto"
            fit="contain"
            radius="md"
          />
        )}

        <Text className={`!text-3xl !font-semibold !mb-4 ${getTitleColor()}`}>
          {title}
        </Text>

        <Text className="!text-base !text-[#818181]">{description}</Text>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && (
          <Box className="flex justify-center gap-4 mt-6">
            {primaryButton && (
              <CustomButton onClick={primaryButton.onClick} className="flex-1">
                {primaryButton.label}
              </CustomButton>
            )}

            {secondaryButton && (
              <CustomButton
                type="dark"
                onClick={secondaryButton.onClick}
                variant="outline"
                className="flex-1"
              >
                {secondaryButton.label}
              </CustomButton>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
