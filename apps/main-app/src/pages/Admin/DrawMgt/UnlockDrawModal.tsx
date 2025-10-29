import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";

type UnlockDrawModalProps = {
  opened: boolean;
  onClose: () => void;
  onValidate: (otp: string) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  title?: string | React.ReactNode;
  resendOtp?: () => void;
  description?: string | React.ReactNode;
  validatingOtp?: boolean;
  otpLength?: number;
};

function UnlockDrawModal({
  opened,
  onClose,
  onValidate,
  timeLeft,
  setTimeLeft,
  resendOtp,
  otpLength = 4,
  validatingOtp = false,
  title = "OTP Sent to reset Password",
  description = "Enter OTP to authorize your reset password process.",
}: UnlockDrawModalProps) {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!opened) return;
    setOtp("");
  }, [opened]);

  useEffect(() => {
    if (!opened || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [opened, timeLeft, setTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <AdminAlertModal
      opened={opened}
      onClose={onClose}
      status="message"
      title={<div className="!mt-5">{title}</div>}
      description={
        <>
          <Text className="!text-base !text-center !text-[#818181] !mb-5">
            {description}
          </Text>

          {/* OTP Input */}
          <div className="text-center mb-5">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={otpLength}
              inputType="number"
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

          {/* Timer */}
          <Text className="text-secondary-text">
            Code expires in{" "}
            <span className="!text-red-600 !text-lg !font-semibold">
              {formatTime(timeLeft)}
            </span>
          </Text>

          {/* Resend */}
          <Text className="text-sm !inline-flex !items-center gap-2 !mt-6 text-gray-500">
            Didn’t Receive Code?{" "}
            {!validatingOtp && (
              <span
                className="text-red-600 underline cursor-pointer"
                onClick={() => resendOtp && resendOtp()}
              >
                Resend OTP
              </span>
            )}
            {validatingOtp && (
              <Loader size="sm" color="var(--color-primary-red)" />
            )}
          </Text>
        </>
      }
      primaryButton={{
        disabled: otp.length < otpLength || validatingOtp,
        label: "Unlock Draw",
        loading: validatingOtp,
        onClick: () => onValidate(otp),
      }}
      secondaryButton={{
        label: "Close",
        onClick: onClose,
      }}
    />
  );
}

export default UnlockDrawModal;
