import { Card, Flex, Stack, Text, TextInput } from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import CustomButton from "../../../../components/Buttons/CustomButton";
import AlertModal from "../../../../components/Modals/AlertModal";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";

type OldPasswordProps = {
  onComplete: () => void;
};

function OldPassword({ onComplete }: OldPasswordProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  function validatePassword() {
    setEmailModalOpen(true);
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
      <AlertModal
        opened={otpModalOpen}
        status="message"
        title={
          <>
            <div className="!mt-5">OTP Sent to reset Password</div>
          </>
        }
        description={
          <>
            <Text className="!text-base !text-center !text-[#818181] !mb-5">
              We send an six (6) digit OTP to your email address ola************
              gmail.com
              <br />
              <br />
              Enter OTP to Authorize your reset password process.
            </Text>

            <div className="text-center mb-5">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  margin: "0 0.25rem",
                  fontSize: "1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9fb",
                  color: "#000",
                }}
                containerStyle={{
                  justifyContent: "center",
                }}
                renderInput={(props, index) => (
                  <input
                    key={index}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                  />
                )}
                shouldAutoFocus
              />
            </div>

            <Text className="!text-red-600 !text-lg !mb-6 !font-semibold">
              {formatTime(timeLeft)}
            </Text>

            {/* Resend */}
            <Text className="text-sm text-gray-500">
              Didn’t Receive Code?{" "}
              <span className="text-red-600 underline cursor-pointer pb-2">
                Resend OTP
              </span>
            </Text>
          </>
        }
        primaryButton={{
          label: "Validate OTP",
          onClick: otpEntered,
        }}
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
