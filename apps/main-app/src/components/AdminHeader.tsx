import {
  Badge,
  ActionIcon,
  Group,
  Text,
  Burger,
  Drawer,
  ScrollArea,
  Card,
  Modal,
  TextInput,
  Button,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBell, IconLogout } from "@tabler/icons-react";
import SideMenu from "./SideMenu";
import { useAtom } from "jotai";
import { userAtom } from "../utils/hooks/useStorage";
import AdminAlertModal from "./Modals/AdminAlertModal";
import { useState, useEffect } from "react";
import { useGetData, usePutData } from "../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdminMenu } from "../utils/hooks/useAdminMenu";
import UserAvatar from "./UserAvatar";
import { useForm } from "@mantine/form";
import { fileToBase64 } from "../utils/helper/fileToBase64";
import ImageCard from "../pages/Admin/CreateRaffle/ImageCard";
import CustomButton from "./Buttons/CustomButton";
import type { User } from "../pages/Admin/UserMgt/UserMgt";

export default function AdminHeader() {
  const [user, setUser] = useAtom(userAtom);
  const [logoutAlertModalOpen, setLogoutAlertModalOpen] =
    useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const menuSections = useAdminMenu();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 1095px)");

  const logoutMutation = useGetData("admin/logout");
  const updateProfileMutation = usePutData("admin/profile");

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      phone_number: "",
      avatar: "",
    },
    validate: {
      name: (val) => (val.trim().length > 0 ? null : "Name is required"),
    },
  });

  // Prefill form when modal opens
  useEffect(() => {
    if (profileModalOpen && user) {
      form.setValues({
        name: user.name || "",
        phone_number: user.phone_number || "",
        avatar: user.avatar || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileModalOpen, user]);

  const setAvatar = (base64: string) => {
    form.setFieldValue("avatar", base64);
  };

  const handleUpdateProfile = async () => {
    if (form.validate().hasErrors) return;

    const payload = {
      name: form.values.name,
      phone_number: form.values.phone_number || "",
      avatar: form.values.avatar || "",
    };

    try {
      const response = await updateProfileMutation.mutateAsync(payload);
      notifications.show({
        title: "Profile Updated",
        message: response?.message || "Profile updated successfully",
        color: "green",
      });

      // Update user atom with new data
      const updatedUserResponse = response?.data as User;
      if (user) {
        const updatedUser = {
          ...user,
          name: updatedUserResponse.name,
          phone_number: updatedUserResponse.phone_number,
          avatar: updatedUserResponse.avatar,
        };
        setUser(updatedUser);
        // Also update localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      setProfileModalOpen(false);
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const closeProfileModal = () => {
    form.reset();
    setProfileModalOpen(false);
  };

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
    <Card className="!flex !flex-row !items-center !justify-between !w-full !py-3 !px-4 !bg-white !border-b !border-b-gray-200">
      {/* Left: Profile */}
      <Group gap="sm" className="!text-primary-text">
        {isMobile && <Burger opened={opened} onClick={toggle} size="sm" />}
        <div
          onClick={() => setProfileModalOpen(true)}
          className="cursor-pointer"
        >
          <UserAvatar
            image={user?.avatar}
            subString={user?.name}
            radius="md"
            size={40}
            className="border-3 border-primary-red rounded-lg"
          />
        </div>
        <div>
          <Text className="!text-gray-700 !font-medium !text-sm">
            {user?.name}
          </Text>
          <Badge
            radius="sm"
            size="md"
            className="!bg-light-red !text-[#C01048] !capitalize !font-medium !rounded-2xl"
          >
            {user?.roles?.[0]?.display_name}
          </Badge>
        </div>
      </Group>

      {/* Right: Icons */}
      <Group gap="xs">
        <ActionIcon
          onClick={() => navigate('/admin/notifications')}
          variant="light"
          radius="md"
          size="lg"
          className="!bg-red-50 hover:!bg-red-100 !w-[40px] !h-[40px] !border-[#FFD5D6]"
        >
          <IconBell className="text-primary-red" size={22} />
        </ActionIcon>

        <ActionIcon
          variant="light"
          radius="md"
          size="lg"
          className="!bg-red-50 hover:!bg-red-100 !w-[40px] !h-[40px] !border !border-[#FFD5D6]"
          onClick={() => setLogoutAlertModalOpen(true)}
        >
          <IconLogout className="text-primary-red" size={22} />
        </ActionIcon>
      </Group>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          opened={opened}
          onClose={close}
          title={null}
          padding={0}
          size="250px"
          zIndex={1001}
          withCloseButton={false}
        >
          <ScrollArea>
            <SideMenu
              menus={menuSections}
              hideLink={true}
              onClose={close}
            />
          </ScrollArea>
        </Drawer>
      )}

      <AdminAlertModal
        opened={logoutAlertModalOpen}
        onClose={() => setLogoutAlertModalOpen(false)}
        status="error"
        title="Log out from your Account"
        description={`Are you sure you want to log out from your Admin Account`}
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

      {/* Update Profile Modal */}
      <Modal
        opened={profileModalOpen}
        onClose={closeProfileModal}
        centered={true}
        withCloseButton={false}
        radius="lg"
        padding="xl"
        title={
          <div>
            <Text fz={20} fw="bold" className="!text-primary-red">
              Update Profile
            </Text>
            <Text className="!text-secondary-text">
              Update your profile information
            </Text>
          </div>
        }
        size="lg"
      >
        <form
          onSubmit={form.onSubmit(handleUpdateProfile)}
          className="!space-y-4 !text-primary-text"
        >
          <TextInput
            label="Name"
            placeholder="Enter Name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Phone Number"
            placeholder="Enter Phone Number"
            type="number"
            {...form.getInputProps("phone_number")}
          />

          <div>
            <Text fz={14} fw={500} className="!text-primary-text !mb-1">
              Profile Image
            </Text>
            <ImageCard
              width={360}
              src={form.values.avatar || undefined}
              height={240}
              onDelete={() => setAvatar("")}
              onUpload={async (file: File) => {
                try {
                  const base64 = await fileToBase64(file, 1);
                  setAvatar(base64);
                } catch (error) {
                  notifications.show({
                    title: "Upload failed",
                    message: (error as Error).message,
                    color: "red",
                  });
                }
              }}
            />
            {form.errors.avatar && (
              <Text fz="xs" c="red" mt={4}>
                {form.errors.avatar}
              </Text>
            )}
          </div>

          <CustomButton
            fullWidth
            size="lg"
            border={false}
            buttonType="submit"
            className="flex-1 !font-medium"
            disabled={updateProfileMutation.isPending}
            loading={updateProfileMutation.isPending}
          >
            Save Changes
          </CustomButton>

          <Button
            fullWidth
            size="lg"
            onClick={closeProfileModal}
            variant="default"
            className="flex-1 !font-medium"
          >
            Cancel
          </Button>
        </form>
      </Modal>
    </Card>
  );
}
