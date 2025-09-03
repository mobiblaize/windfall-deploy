import { Card, Flex, Stack, Text, TextInput } from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import CustomButton from "../../../../components/Buttons/CustomButton";
import AlertModal from "../../../../components/Modals/AlertModal";
import { useState } from "react";
import OtpModal from "./OtpModal";

type OldPasswordProps = {
  onComplete: () => void;
};

function OldPassword({ onComplete }: OldPasswordProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 15 minutes

  function validatePassword() {
    setEmailModalOpen(true);
  }
  function resendOtp() {
    setTimeLeft(20);
  }

  function emailEntered() {
    setEmailModalOpen(false);
    setOtpModalOpen(true);
  }

  function otpEntered() {
    setOtpModalOpen(false);
    setSuccessModalOpen(true);
  }

  function validateOtp() {
    setOtpModalOpen(false);
    onComplete();
  }

  return (
    <Card withBorder className="!rounded-lg">
      <header className="flex gap-3 items-center mb-7">
        <HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
        <div className="capitalize">
          <Text className="!font-semibold !text-xl">
            Enter your Old Password
          </Text>
          <Text className="!text-secondary-text">
            Enter your Old password below
          </Text>
        </div>
      </header>
      <form>
        <Stack className="!capitalize" gap="xl">
          <TextInput
            label="Enter your Old Password"
            placeholder="Enter your Old Password"
            withAsterisk
            rightSection={<FiEye />}
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
          />
          <TextInput
            label="Confirm your Old Password"
            placeholder="Confirm your Old Password"
            withAsterisk
            rightSection={<FiEye />}
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
          />
        </Stack>
        <Flex justify="flex-end" className="!mt-7">
          <CustomButton onClick={validatePassword}>
            Validate Password
          </CustomButton>
        </Flex>
      </form>
      <AlertModal
        opened={emailModalOpen}
        status="error"
        title={
          <>
            <div className="!mt-5">Forget Password ?</div>
          </>
        }
        description={
          <>
            <Text className="!text-base !text-center !text-[#818181] !mb-5">
              To start the forget password process, kindly enter your email
              below.
              <br />
              <br />
              Don't not close this window after you press “Yes Forget Password”
              Button
            </Text>

            <div className="text-start mb-2">
              <TextInput
                label="Your Email Address"
                placeholder="Enter Your Email Address"
                withAsterisk
                rightSection={<FiEye />}
                classNames={{
                  label: "!text-sm !text-[#030303] font-normal",
                  input: "!text-[#030303]",
                }}
              />
            </div>
          </>
        }
        primaryButton={{
          label: "Yes, Forget Password",
          onClick: emailEntered,
        }}
      />
      <OtpModal
        opened={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        resendOtp={resendOtp}
        onValidate={otpEntered}
        emailMasked="ola************gmail.com"
      />
      <AlertModal
        opened={successModalOpen}
        status="success"
        title="OTP Validated"
        description="Congratulation, OTP has been successfully validated. You can know proceed to creating a new password"
        primaryButton={{
          label: "Continue",
          onClick: validateOtp,
        }}
      />
    </Card>
  );
}

export default OldPassword;
