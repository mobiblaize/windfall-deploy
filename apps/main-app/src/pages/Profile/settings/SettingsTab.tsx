import {
  Button,
  Card,
  Container,
  Divider,
  SimpleGrid,
  Text,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
import { FiLogOut } from "react-icons/fi";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../../components/Modals/AlertModal";
import { useState } from "react";
import { useAuth } from "../../../utils/hooks/useAuth";
import { useGetData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";

const settings: {
  title: string;
  description: string;
  route: string;
}[] = [
  {
    title: "Personal Information",
    description: "Edit your Personal Information like name etc.",
    route: "personal",
  },
  {
    title: "Account Security",
    description: "Secure your account wth ease.",
    route: "account",
  },
  {
    title: "Notification Setting",
    description: "Edit your Notifications settings with ease.",
    route: "notification",
  },
];

function SettingsTab() {
  const navigate = useNavigate();
  const [logoutAlertModalOpen, setLogoutAlertModalOpen] = useState(false);

  const { logout } = useAuth();

  const logoutMutation = useGetData("customer/auth/logout");

  const logoutUser = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      setLogoutAlertModalOpen(false);
      logout();
      notifications.show({
        title: "Logout Successful",
        message: response?.message || "User logged out successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Logout Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  return (
    <div>
      <MyGameHeader
        title="Settings"
        description="Manage your account settings in one place."
      >
        <Button
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          rightSection={<FiLogOut size={20} />}
          px={30}
          onClick={() => setLogoutAlertModalOpen(true)}
        >
          Log Out
        </Button>
      </MyGameHeader>

      <Divider />
      <Container fluid className="sm:!mx-5 !px-6 !md:px-16">
        <SimpleGrid
          my={54}
          cols={{ base: 1, md: 3 }}
          spacing={{ base: 10, sm: "md", md: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {settings.map((setting) => (
            <Card
              key={setting.route}
              withBorder
              onClick={() => navigate(setting.route)}
              className="!p-6 !rounded-xl !space-y-2 justify-items-start cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-md">
                <HiDocumentArrowDown className="!text-xl !text-primary-red" />
              </div>
              <div>
                <Text className="!text-lg !font-bold !text-primary-text">
                  {setting.title}
                </Text>
                <Text className="!text-sm !text-secondary-text">
                  {setting.description}
                </Text>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <AlertModal
        opened={logoutAlertModalOpen}
        onClose={() => setLogoutAlertModalOpen(false)}
        status="error"
        title="Log out from your Account"
        description={`Are you sure you want to log out from your Account`}
        primaryButton={{
          label: "Yes, Logout",
          loading: logoutMutation.isPending,
          disabled: logoutMutation.isPending,
          onClick: logoutUser,
        }}
        secondaryButton={{
          label: "No, Cancel",
          onClick: () => setLogoutAlertModalOpen(false),
        }}
      />
    </div>
  );
}

export default SettingsTab;
