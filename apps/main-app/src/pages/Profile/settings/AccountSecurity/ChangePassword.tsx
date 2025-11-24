import { Divider, Flex } from "@mantine/core";
import MyGameHeader from "../../MyGameHeader";
import NewPassword, { type PasswordFormValues } from "./NewPassword";
import OldPassword from "./OldPassword";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../../../components/Modals/AlertModal";
import { useAtom } from "jotai";
import {
  userAtom,
  useSessionStorage,
} from "../../../../utils/hooks/useStorage";
import { usePostData, usePutData } from "../../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";

function ChangePassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [user] = useAtom(userAtom);
  const { updateUser } = useSessionStorage();
  const navigate = useNavigate();
  const loginMutation = usePostData("customer/auth/login");
  const changePasswordMutation = usePutData(
    `customer/settings/security/update/password`
  );

  const login = async ({ password }: { password: string }) => {
    setOldPassword(password);
    const payload = {
      username: user?.email,
      remember_me: true,
      password: password,
    };
    try {
      const response = await loginMutation.mutateAsync(payload);
      updateUser(response?.data);
      notifications.show({
        title: "Password Validation Successful",
        message: "Password validated successfully",
        color: "green",
      });
      setStep(2);
    } catch (error) {
      notifications.show({
        title: "Password Validation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  function closeModal() {
    setSuccessModalOpen(false);
    navigate("/profile/settings");
  }

  async function validatePassword(values: PasswordFormValues) {
    const payload = {
      old_password: oldPassword,
      ...values,
    };
    try {
      const response = await changePasswordMutation.mutateAsync(payload);
      setSuccessModalOpen(true);
      notifications.show({
        title: "Password Update Successful",
        message: response?.message || "Password updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Password Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <div>
      <MyGameHeader
        title={
          <>
            Account Security:{" "}
            <span className="!text-primary-red">Change your Password</span>
          </>
        }
        description="Manage your account security with ease."
      />
      <Divider />

      <Flex
        className="sm:!mx-5 !px-6 !md:px-16 py-10"
        align="center"
        justify="center"
      >
        <div className="sm:w-4/5 md:!w-5/9 lg:!w-5/10 mt-10">
          {step === 1 && (
            <OldPassword
              onComplete={login}
              loading={loginMutation.isPending}
              error={loginMutation.error?.message}
            />
          )}
          {step === 2 && (
            <NewPassword
              onComplete={validatePassword}
              isLoading={changePasswordMutation.isPending}
              error={changePasswordMutation.error?.message}
            />
          )}
        </div>
      </Flex>
      <AlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="New Password Created"
        description="Congratulations, you have successfully created a new password for your WindFall raffle Account. Now start playing"
        primaryButton={{
          label: "Continue",
          onClick: closeModal,
        }}
      />
    </div>
  );
}

export default ChangePassword;
