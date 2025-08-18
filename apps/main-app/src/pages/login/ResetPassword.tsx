import { Flex, Text, TextInput } from "@mantine/core";
import resetLeft from "../../assets/reset-1.png";
import resetRight from "../../assets/reset-2.png";
import NewPassword from "../Profile/settings/AccountSecurity/NewPassword";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import AlertModal from "../../components/Modals/AlertModal";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import OTPInput from "react-otp-input";

function ResetPassword() {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

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

  function closeSuccessModal() {
    setSuccessModalOpen(false);
    navigate("/login");
  }

  const navigate = useNavigate();

  return (
    <div className="mb-10 flex flex-col h-full">
      <SectionHeader
        heading="Create New Password"
        subHeading="Create a new password today for a secured login"
        imageLeft={resetLeft}
        imageRight={resetRight}
        imageRightWidth="22vw"
        imageLeftWidth="18vw"
      />

      <Flex className="py-10" align="center" justify="center">
        <div className="m:w-4/5 md:!w-5/9 lg:!w-5/10 mt-10 !mb-20">
          <NewPassword onComplete={validatePassword} />
        </div>
      </Flex>

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
        onClose={closeSuccessModal}
        status="success"
        title="New Password Created"
        description="Congratulation, you have successfully created a new password for your WindFall raffle Account. Now start playing"
        primaryButton={{
          label: "Login to your Account",
          onClick: closeSuccessModal,
        }}
      />
    </div>
  );
}

export default ResetPassword;
