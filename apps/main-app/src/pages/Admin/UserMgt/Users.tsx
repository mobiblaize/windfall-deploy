import { useEffect, useState } from "react";
import { Card, Avatar, Switch, Text, Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useGetData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../../components/EmptyState";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";

export interface UserData {
  records: User[];
}

export interface User {
  uuid: string;
  email: string;
  name: string;
  uniqueID: string;
  avatar: string;
  username: string;
  phone_number: string;
  is_active: "true" | "false";
  approvalStatus: string;
  login_count: number;
  updated_by: string;
  last_login?: string;
  created_at: string;
  roles: Role[];
}

export interface Role {
  uuid: string;
  name: string;
  display_name: string;
}

export default function Users() {
  const [userList, setUserList] = useState<User[]>([]);
  const getUsersMutation = useGetData("admin/user-management/users/all");
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);

  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeDeactivateAlertModal(userId: string) {
    setDeactivateAlertModalOpen(false);
    toggleUser(userId);
    setDeactivateSuccessModalOpen(true);
  }

  async function getUsers() {
    try {
      const response = await getUsersMutation.mutateAsync();
      setUserList(response.data.records);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch users",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const toggleUser = (id: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.uniqueID === id
          ? { ...u, is_active: isActive(u.is_active) ? "false" : "true" }
          : u
      )
    );
  };

  function isActive(isActive: "true" | "false") {
    return isActive === "true";
  }

  return (
    <>
      {userList.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userList.map((user) => (
            <Card
              key={user.uniqueID}
              radius="lg"
              className="!shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] !rounded-xl p-10"
            >
              <Flex justify="space-between" align="center" gap={5}>
                <Flex gap={10}>
                  <Avatar
                    src="/assets/profile.jpg"
                    alt="Profile"
                    radius="md"
                    size={40}
                    className="border-3 border-primary-red rounded-lg"
                  />
                  <div>
                    <Text className="!font-medium !text-primary-red !text-sm">
                      <NavLink to={"/admin/users/3"}>{user.name}</NavLink>
                    </Text>
                    <Text className="!text-secondary-text !text-sm">
                      Role:{" "}
                      <span className="!text-[#575757]">
                        <NavLink to={"/admin/roles/3"}>
                          {user.roles?.[0]?.display_name}
                        </NavLink>
                      </span>
                    </Text>
                  </div>
                </Flex>
                <Switch
                  size="md"
                  className="!cursor-pointer"
                  color="#039855"
                  thumbIcon={<></>}
                  defaultChecked
                  checked={isActive(user.is_active)}
                  onClick={() => {
                    setDeactivateAlertModalOpen(true);
                  }}
                />
              </Flex>
              <AdminAlertModal
                opened={deactivateAlertModalOpen}
                onClose={() => setDeactivateAlertModalOpen(false)}
                status="error"
                title={`${isActive(user.is_active) ? "Deactivate" : "Reactivate"} User ?`}
                description={`${isActive(user.is_active) ? "Are you sure you want to deactivate this user ? Kindly note that action would translate to this user access being temporarily revoked until their account is manually reactivated again" : "Are you sure you want to reactivate this user ? Kindly note that action would translate to this user revoked access being restored"}`}
                primaryButton={{
                  label: `${isActive(user.is_active) ? "Deactivate" : "Reactivate"} User`,
                  onClick: () => closeDeactivateAlertModal(user.uniqueID),
                }}
                secondaryButton={{
                  label: "Close",
                  onClick: () => setDeactivateAlertModalOpen(false),
                }}
              />
              {/* Deactivate Success Modal */}
              <AdminAlertModal
                opened={deactivateSuccessModalOpen}
                onClose={() => setDeactivateSuccessModalOpen(false)}
                status="success"
                title={`User ${isActive(user.is_active) ? "Activated" : "Deactivated"}`}
                description={`User profile has been successfully ${isActive(user.is_active) ? "activated" : "deactivated"} and their access to the platform has been ${isActive(user.is_active) ? "restored." : "revoked temporarily."}`}
                primaryButton={{
                  label: "Close",
                  onClick: () => setDeactivateSuccessModalOpen(false),
                }}
              />
            </Card>
          ))}
        </div>
      )}
      {!userList.length && (
        <EmptyState
          btnText="Add User"
          description="No users found"
          title="No users found"
          redirectLink="/admin/users/create"
        />
      )}
    </>
  );
}
