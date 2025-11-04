import {
  Avatar,
  Badge,
  ActionIcon,
  Group,
  Text,
  Burger,
  Drawer,
  ScrollArea,
  Card,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBell, IconLogout } from "@tabler/icons-react";
import SideMenu from "./SideMenu";
import { useAtom } from "jotai";
import { userAtom } from "../utils/hooks/useStorage";
import AdminAlertModal from "./Modals/AdminAlertModal";
import { useState } from "react";
import { useGetData } from "../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdminMenu } from "../utils/hooks/useAdminMenu";

export default function AdminHeader() {
  const [user] = useAtom(userAtom);
  const [logoutAlertModalOpen, setLogoutAlertModalOpen] =
    useState(false);
  const menuSections = useAdminMenu();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 1095px)");

  const logoutMutation = useGetData("admin/logout");

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
        <Avatar
          src={user?.avatar}
          alt="Profile"
          radius="md"
          size={40}
          className="border-3 border-primary-red rounded-lg"
        />
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
    </Card>
  );
}
