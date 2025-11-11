import { Flex, Text, TextInput } from "@mantine/core";
import resetLeft from "../../assets/reset-1.png";
import resetRight from "../../assets/reset-2.png";
import NewPassword, {
  type PasswordFormValues,
} from "../Profile/settings/AccountSecurity/NewPassword";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import AlertModal from "../../components/Modals/AlertModal";
import { useEffect, useState } from "react";
import OtpModal from "../Profile/settings/AccountSecurity/OtpModal";
import { useGetData, usePostData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import maskEmail from "../../utils/helper/MaskEmail";

const otpTime = 300; // 5 minutes in seconds

function ResetPassword() {
  const [otpSuccessModalOpen, setOtpSuccessModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(true);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [timeLeft, setTimeLeft] = useState(otpTime);

  const forgotPasswordMutation = usePostData(
    "customer/auth/forgot-password/send-code"
  );
  const resendOtpMutation = useGetData(
    `customer/auth/forgot-password/resend-code/${userId}`
  );
  const confirmOtpMutation = usePostData(
    `customer/auth/forgot-password/confirm-code/${userId}`
  );
  const createPasswordMutation = usePostData(
    `customer/auth/forgot-password/create-password/${userId}`
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function verifyEmail(email: string) {
    setMaskedEmail(maskEmail(email));
    const payload = {
      username: email,
    };
    try {
      const response = await forgotPasswordMutation.mutateAsync(payload);
      setUserId(response.data.user_id);
      setEmailModalOpen(false);
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

  function closeEmailModal() {
    setEmailModalOpen(false);
    toLogin();
  }

  function closeOtpModal() {
    setOtpModalOpen(false);
    toLogin();
  }

  async function otpEntered(code: string) {
    const payload = {
      code,
    };
    try {
      await confirmOtpMutation.mutateAsync(payload);
      setOtpModalOpen(false);
      setOtpSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "OTP Validation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  function closeSuccessModal() {
    setSuccessModalOpen(false);
    toLogin();
  }

  function toLogin() {
    navigate("/login");
  }

  const navigate = useNavigate();

  const emailForm = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (value ? null : "Email / Phone Number is required"),
    },
  });

  const handleEmailSubmit = (values: typeof emailForm.values) => {
    verifyEmail(values.email);
  };

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
          <NewPassword
            resendEmail={() => {
              emailForm.reset();
              setEmailModalOpen(true);
            }}
            onComplete={validatePassword}
            isLoading={createPasswordMutation.isPending}
          />
        </div>
      </Flex>

      <AlertModal
        opened={emailModalOpen}
        onClose={closeEmailModal}
        status="error"
        title={
          <>
            <div className="!mt-5">Forget Password ?</div>
          </>
        }
        description={
          <form onSubmit={emailForm.onSubmit(handleEmailSubmit)}>
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
                label="Your Email / Phone Number"
                placeholder="Enter Your Email / Phone Number"
                key="email"
                {...emailForm.getInputProps("email")}
                withAsterisk
                classNames={{
                  label: "!text-sm !text-[#030303] font-normal",
                  input: "!text-[#030303]",
                }}
              />
            </div>
          </form>
        }
        primaryButton={{
          label: "Yes, Forget Password",
          onClick: emailForm.onSubmit(handleEmailSubmit),
          disabled: forgotPasswordMutation.isPending,
          loading: forgotPasswordMutation.isPending,
        }}
      />
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
      <AlertModal
        opened={otpSuccessModalOpen}
        onClose={() => setOtpSuccessModalOpen(false)}
        status="success"
        title="OTP Validated"
        description="Congratulation, OTP has been successfully validated. You can know proceed to creating a new password"
        primaryButton={{
          label: "Continue",
          onClick: () => setOtpSuccessModalOpen(false),
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
