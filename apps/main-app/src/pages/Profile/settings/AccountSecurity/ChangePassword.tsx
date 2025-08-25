import { Divider, Flex } from "@mantine/core";
import MyGameHeader from "../../MyGameHeader";
import NewPassword from "./NewPassword";
import OldPassword from "./OldPassword";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../../../components/Modals/AlertModal";

function ChangePassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  function closeModal() {
    setSuccessModalOpen(false);
    navigate("/profile/settings");
  }

  const navigate = useNavigate();

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
          {step === 1 && <OldPassword onComplete={() => setStep(2)} />}
          {step === 2 && (
            <NewPassword onComplete={() => setSuccessModalOpen(true)} />
          )}
        </div>
      </Flex>
      <AlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="New Password Created"
        description="Congratulation, you have successfully created a new password for your WindFall raffle Account. Now start playing"
        primaryButton={{
          label: "Continue",
          onClick: closeModal,
        }}
      />
    </div>
  );
}

export default ChangePassword;
