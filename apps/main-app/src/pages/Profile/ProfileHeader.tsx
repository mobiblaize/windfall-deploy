import { Text, Flex, Avatar, ActionIcon } from "@mantine/core";
import { useAtom } from "jotai";
import { Link, useLocation } from "react-router-dom";
import { userAtom } from "../../utils/hooks/useStorage";
import { FiLogOut } from "react-icons/fi";
import AlertModal from "../../components/Modals/AlertModal";
import { useGetData } from "../../utils/hooks/useApis";
import { useAuth } from "../../utils/hooks/useAuth";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
const tabs = [
  { label: "My games", value: "all-games" },
  { label: "result", value: "result" },
  { label: "reward", value: "reward" },
  { label: "transaction", value: "transaction" },
  { label: "notifications", value: "notifications" },
  { label: "settings", value: "settings" },
];
function ProfileHeader() {
  const location = useLocation();
  const [user] = useAtom(userAtom);
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
    <header className=" bg-white px-10 pb-0 pt-6">
      <Flex className="flex flex-col md:flex-row gap-3 justify-between !mb-8">
        <div>
          <Text className="!text-3xl !font-semibold">My Profile</Text>
          <Text className="!text-secondary-text">
            Manage your profile, games all in one place
          </Text>
        </div>
        <Flex align="center" gap={10}>
          <Avatar size="lg" src={user?.avatar} />
          <div className="capitalize text-[#575757]">
            <Text>
              {user?.firstname} {user?.lastname}
            </Text>
            <Text className="!text-primary-red">ID: {user?.uniqueID}</Text>
          </div>

          <ActionIcon
            className="!border-2 !border-dashed !border-primary-red"
            color="black"
            size={"input-md"}
			onClick={() => setLogoutAlertModalOpen(true)}
          >
            <FiLogOut size={20} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Flex
        fz="lg"
        className="!flex !flex-nowrap !justify-around overflow-x-scroll md:overflow-x-hidden"
      >
        {tabs.map(({ label, value }) => {
          const isActive = location.pathname.includes(`/profile/${value}`);
          return (
            <Link key={value} to={`/profile/${value}`}>
              <Text
                className={`
                                    !py-2 !px-5
                              relative 
							  !text-nowrap
                              !capitalize !text-lg
                              cursor-pointer 
                              after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                              after:w-full after:h-[1px]
                              after:bg-primary-red
                              after:origin-center after:scale-x-0
                              after:transition-transform after:duration-300 after:ease-in-out
                              hover:after:scale-x-100
                              ${isActive ? "after:scale-x-100 !text-primary-red" : "!text-[#ABABAB]"}
                            `}
              >
                {label}
              </Text>
            </Link>
          );
        })}
      </Flex>
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
    </header>
  );
}

export default ProfileHeader;
