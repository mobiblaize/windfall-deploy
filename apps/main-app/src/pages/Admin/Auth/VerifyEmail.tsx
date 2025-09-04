import { useState, useEffect } from "react";
import { Card, Flex } from "@mantine/core";
import loginMain from "../../../assets/admin-login-main.png";
import loginBL from "../../../assets/admin-login-b-l.png";
import loginBR from "../../../assets/admin-login-b-r.png";
import leftImg from "../../../assets/legit.png";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useFetchData } from "../../../utils/hooks/useApis";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { IconLockFilled } from "@tabler/icons-react";
import CustomButton from "../../../components/Buttons/CustomButton";

export default function AdminChangePasswordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const {
    data: response,
    isError,
    isLoading,
    error,
  } = useFetchData(`admin/auth/email/verification/${id}`);

  const [emailContent, setEmailContent] = useState({
    title: "Verifying Email...",
    description: "Please wait while we verify your email address.",
  });

  // react to fetch result
  useEffect(() => {
    if (isLoading) {
      setEmailContent({
        title: "Verifying Email...",
        description: "Please wait while we verify your email address.",
      });
    }

    if (isError) {
      setEmailContent({
        title: "Verification Failed",
        description:
          (error as { message?: string })?.message ||
          "Something went wrong while verifying your email.",
      });

      notifications.show({
        title: "Account Verification Failed",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }

    if (response && !isError) {
      setEmailContent({
        title: "Email Verified",
        description: response?.message || "Your email has been verified.",
      });

      setUserId(response?.data.user);
      setSuccessModalOpen(true);

      notifications.show({
        title: "Account Verified Successfully",
        message: response?.message || "Account verified successfully",
        color: "green",
      });
    }
  }, [isLoading, isError, response, error]);

  function closeModal() {
    setSuccessModalOpen(false);
    navigate(`/admin/change-password/${userId}`, { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <Card className="!bg-white !rounded-4xl !my-10 !mx-10 !border !relative !border-[#C0C0C5] !flex-1 !flex !flex-col !justify-center !px-8 md:!px-16 lg:!px-24">
        <div className="mt-20 mb-40">
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <IconLockFilled className="text-red-500" size={20} />
          </div>

          <h1 className="text-red-500 font-bold text-3xl mb-2">
            {emailContent.title}
          </h1>
          <p className="text-[#818181] mb-5">{emailContent.description}</p>

          {isError && <CustomButton
            className="!mt-7"
            border={false}
            fullWidth
            onClick={()=> navigate('/admin/login')}
          >
            Back
          </CustomButton>}

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

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="Email Verified Successfully"
        description="Congratulation, you have successfully verified your WindFall Administrative Account. Please proceed to change your default password"
        primaryButton={{
          label: "Create Password",
          onClick: closeModal,
        }}
      />
    </div>
  );
}
