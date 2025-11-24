import { useEffect, useState } from "react";
import { Card, Flex } from "@mantine/core";
import loginMain from "../../../assets/admin-login-main.png";
import loginBL from "../../../assets/admin-login-b-l.png";
import loginBR from "../../../assets/admin-login-b-r.png";
import leftImg from "../../../assets/legit.png";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useGetData, usePostData } from "../../../utils/hooks/useApis";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import EmailForm from "./EmailForm";
import AdminNewPassword from "./AdminNewPassword";
import OtpModal from "../../Profile/settings/AccountSecurity/OtpModal";
import maskEmail from "../../../utils/helper/MaskEmail";

export type PasswordFormValues = {
  password: string;
  password_confirmation: string;
};

const otpTime = 300; // 5 minutes in seconds

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(otpTime);
  const [userId, setUserId] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otpSuccessModalOpen, setOtpSuccessModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  const forgotPasswordMutation = usePostData("admin/auth/send-code");
  const resendOtpMutation = useGetData(`admin/auth/resend-code/${userId}`);
  const confirmOtpMutation = usePostData(`admin/auth/confirm-code/${userId}`);
  const createPasswordMutation = usePostData(
    `admin/auth/create-password/${userId}`
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function closeModal() {
    setSuccessModalOpen(false);
    toLogin();
  }

  function toLogin() {
    navigate("/admin/login");
  }

  function closeOtpModal() {
    setOtpModalOpen(false);
  }

  async function otpEntered(code: string) {
    const payload = {
      code,
    };
    try {
      await confirmOtpMutation.mutateAsync(payload);
      setOtpModalOpen(false);
      setOtpSuccessModalOpen(true);
      setStep(2);
    } catch (error) {
      notifications.show({
        title: "OTP Validation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function verifyEmail(email: string) {
    setMaskedEmail(maskEmail(email));
    const payload = {
      email,
    };
    try {
      const response = await forgotPasswordMutation.mutateAsync(payload);
      setUserId(response.data.user_id);
      setTimeLeft(otpTime);
      setOtpModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Verification Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function resendOtp() {
    try {
      await resendOtpMutation.mutateAsync();
      setTimeLeft(otpTime);
      setOtpModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "OTP Resend Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function validatePassword(payload: PasswordFormValues) {
    try {
      const response = await createPasswordMutation.mutateAsync(payload);
      setSuccessModalOpen(true);
      notifications.show({
        title: "Password Reset Successfully",
        message: response?.message || "Password reset successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Password Reset Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}

      <Card className="!bg-white !rounded-4xl !my-10 !mx-10 !border !relative !border-[#C0C0C5] !flex-1 !flex !flex-col !justify-center !px-8 md:!px-16 lg:!px-24">
        <div className="mt-20 mb-40">
          <div className="relative z-10">
            {step === 1 && (
              <EmailForm
                onSubmit={verifyEmail}
                isLoading={forgotPasswordMutation.isPending}
              />
            )}
            {step === 2 && (
              <AdminNewPassword
                onComplete={validatePassword}
                isLoading={forgotPasswordMutation.isPending}
              />
            )}
          </div>

          {/* Bottom building illustration */}
          <div className="mt-auto absolute bottom-0 left-4">
            <img src={loginBL} alt="building" className="w-full opacity-50" />
          </div>
        </div>
      </Card>

      {/* Divider */}
      <div className="hidden md:block w-[4px] bg-[length:4px_4px] bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>

      {/* Right Section */}
      <div className="flex-1 bg-light-red p-8 flex flex-col justify-center items-center relative">
        <div className="max-w-md">
          <div className="relative mb-12">
            <img src={loginMain} alt="bedroom" className="rounded-xl" />
            <img
              src={leftImg}
              alt="bedroom"
              className="rounded-xl absolute right-0 -bottom-16"
            />
          </div>

          <Flex align="center" gap={20} className="!mt-4 !mb-20">
            <h2 className="text-red-500 font-bold text-5xl sm:text-4xl md:text-4xl lg:text-5xl grow text-nowrap">
              Live In <br /> Rent Out <br /> Sell Up
            </h2>

            <p className="text-gray-600">
              Whether you choose to live in it, rent it out for income, or sell
              it for cash — Windfall gives you real options with every prize.
            </p>
          </Flex>
        </div>

        {/* Bottom right house icon */}
        <img
          src={loginBR}
          alt="house"
          className="absolute bottom-0 right-0 w-40"
        />
      </div>
      <OtpModal
        opened={otpModalOpen}
        onClose={closeOtpModal}
        onValidate={otpEntered}
        timeLeft={timeLeft}
        validatingOtp={
          resendOtpMutation.isPending || confirmOtpMutation.isPending
        }
        resendOtp={resendOtp}
        setTimeLeft={setTimeLeft}
        title="OTP Sent to reset Password"
        description="Enter OTP to Authorize your reset password process."
        emailMasked={maskedEmail}
      />
      <AdminAlertModal
        opened={otpSuccessModalOpen}
        onClose={() => setOtpSuccessModalOpen(false)}
        status="success"
        title="OTP Validated"
        description="Congratulations, OTP has been successfully validated. You can know proceed to creating a new password"
        primaryButton={{
          label: "Continue",
          onClick: () => setOtpSuccessModalOpen(false),
        }}
      />
      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="New Password Created"
        description="Congratulations, you have successfully created a new password for your WindFall Administrative Account."
        primaryButton={{
          label: "Login to your Account",
          onClick: closeModal,
        }}
      />
    </div>
  );
}
