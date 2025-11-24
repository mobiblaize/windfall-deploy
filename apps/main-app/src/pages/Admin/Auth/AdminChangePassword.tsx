import { useEffect, useState } from "react";
import { Card, Flex, List, PasswordInput, Stack } from "@mantine/core";
import loginMain from "../../../assets/admin-login-main.png";
import loginBL from "../../../assets/admin-login-b-l.png";
import loginBR from "../../../assets/admin-login-b-r.png";
import leftImg from "../../../assets/legit.png";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { usePostData } from "../../../utils/hooks/useApis";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import CustomButton from "../../../components/Buttons/CustomButton";
import { IconLockFilled } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

export type PasswordFormValues = {
  password: string;
  password_confirmation: string;
};

const otpTime = 300; // 5 minutes in seconds

export default function AdminChangePasswordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(otpTime);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const createPasswordMutation = usePostData(
    `admin/auth/create-password/${id}`
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

  const form = useForm({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validate: {
      password: (value) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
          return "Use both uppercase and lowercase letters";
        }
        if (!/[0-9]/.test(value)) {
          return "Include at least one number";
        }
        if (!/[!@#$%^&*]/.test(value)) {
          return "Include at least one special character (!@#$%^&*)";
        }
        return null;
      },
      password_confirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });
  
    const handleSubmit = async (values: typeof form.values) => {
      if (form.validate().hasErrors) {
        return;
      }
  
      const payload = {
        password: values.password,
        password_confirmation: values.password_confirmation
      };
  
      // API mutation
  
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
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}

      <Card className="!bg-white !rounded-4xl !my-10 !mx-10 !border !relative !border-[#C0C0C5] !flex-1 !flex !flex-col !justify-center !px-8 md:!px-16 lg:!px-24">
        <div className="mt-20 mb-40">
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <IconLockFilled className="text-red-500" size={20} />
          </div>

          <h1 className="text-red-500 font-bold text-3xl mb-2">
           Change Default Password
          </h1>
          <p className="text-[#818181] mb-5">
            Please change your default password to secure your account.
          </p>

          <form onSubmit={form.onSubmit(handleSubmit)} className="relative z-10">
            <Stack className="!capitalize" gap="xl">
              <PasswordInput
                label="Create new password"
                placeholder="Enter your password"
                withAsterisk
                classNames={{
                  label: "!text-sm !text-[#030303] font-normal",
                  input: "!text-[#030303]",
                }}
                type="password"
                {...form.getInputProps("password")}
              />

              <List className="!text-secondary-text !list-disc">
                <List.Item>8-12 characters</List.Item>
                <List.Item>
                  Use both Uppercase letters (A-Z) and Lowercase letters (a-z).
                </List.Item>
                <List.Item>Include Numbers (0–9)</List.Item>
                <List.Item>Special characters (e.g. !@ # $ % ^ & *)</List.Item>
              </List>

              <PasswordInput
                label="Confirm your new password"
                placeholder="Confirm new password"
                withAsterisk
                classNames={{
                  label: "!text-sm !text-[#030303] font-normal",
                  input: "!text-[#030303]",
                }}
                type="password"
                {...form.getInputProps("password_confirmation")}
              />
            </Stack>

            <CustomButton
              className="!mt-7"
              border={false}
              fullWidth
              disabled={createPasswordMutation.isPending}
              loading={createPasswordMutation.isPending}
              buttonType="submit"
            >
              Create Password
            </CustomButton>
          </form>

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
      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="New Password Created"
        description="Congratulations, you have successfully created a new password for your WindFall Administrative Account."
        primaryButton={{
          label: "Back to Login",
          onClick: closeModal,
        }}
      />
    </div>
  );
}
