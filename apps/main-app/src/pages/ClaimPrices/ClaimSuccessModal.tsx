import { Modal, Box, Text, Image } from "@mantine/core";
import successImg from "../../assets/success.gif";
import CustomButton from "../../components/Buttons/CustomButton";

type Props = {
  opened: boolean;
  onClose: () => void;
  raffleTitle: string;
  referenceId: string;
};

export default function ClaimSuccessModal({
  opened,
  onClose,
  raffleTitle,
  referenceId,
}: Props) {
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
      <Box className="!text-center !space-y-4">
        <Image
          src={successImg}
          alt="Success"
          className="w-[100px] h-[100px] mx-auto"
          fit="contain"
          radius="md"
        />

        <Text className="!text-2xl !font-semibold !text-red-500">
          Claim submitted successfully
        </Text>

        <Text className="!text-base !text-[#818181]">
          Your prize claim for <strong>{raffleTitle}</strong> has been
          submitted. Our team will review it shortly.
        </Text>

        {/* Info Box */}
        <Box className="!bg-red-50 !border-dashed !border-2 !border-red-300 !rounded-md !px-4 !py-4 !text-sm !text-[#818181] space-y-3">
          {/* Claim Reference ID */}
          <Box className="flex justify-between">
            <Text>Claim Reference ID:</Text>
            <Text className="!text-black">{referenceId}</Text>
          </Box>

          {/* Estimated Time */}
          <Box className="flex justify-between">
            <Text>Estimated processing time:</Text>
            <Text className="!text-black">2–5 business days</Text>
          </Box>

          {/* Claim Status */}
          <Box className="flex justify-between">
            <Text>Claim status:</Text>
            <Text className="!text-black">Under review</Text>
          </Box>
        </Box>

        <Text className="!text-base !text-black">
          If you need help, contact us at{" "}
          <a
            href="mailto:Support@windfall.ng"
            className="!text-primary-red !font-medium hover:underline"
          >
            Support@windfall.ng
          </a>
        </Text>

        <CustomButton onClick={onClose} fullWidth>
          Back to homepage
        </CustomButton>
      </Box>
    </Modal>
  );
}
