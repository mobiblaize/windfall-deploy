import {
  Tabs,
  Text,
  Title,
  Flex,
  Switch,
  Avatar,
  Card,
  TextInput,
} from "@mantine/core";
import { BsPlus } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import EmptyState from "../../../components/EmptyState";
import { useEffect, useState } from "react";
import { useGetData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import Paginator from "../../../components/Paginator";
import { GoArrowUpRight } from "react-icons/go";
import { HiSearch } from "react-icons/hi";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import LoadingState from "../../../components/LoadingState";

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
  last_login: string;
  created_at: string;
  roles: Role[];
}

export interface Role {
  uuid: string;
  name: string;
  display_name: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>();
  const activeTab = section || "users";

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserActiveStatus, setCurrentUserActiveStatus] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const getUsersMutation = useGetData(
    `admin/user-management/users/all?paginate=1&search=${debouncedSearch}&page=${filterPage}`
  );
  const exportMutation = useGetExportData(
    `admin/user-management/users/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&export=1`
  );
  const deactivateUserMutation = useGetData(
    `admin/user-management/users/toggle-status/${currentUserId}`
  );

  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);

  // Re-fetch when search or page changes
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterPage]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  async function getUsers() {
    try {
      const response = await getUsersMutation.mutateAsync();
      setUsers(response.data?.records?.data || []);
      setCurrentPage(response.data?.records?.current_page || 1);
      setTotal(response.data?.records?.total || 0);
      setPageSize(response.data?.records?.per_page || 10);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch users",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const selectUser = (user: User) => {
    setCurrentUserId(user.uuid);
    setCurrentUserActiveStatus(isActive(user.is_active));
    setDeactivateAlertModalOpen(true);
  };

  function isActive(isActive?: "true" | "false") {
    return isActive === "true";
  }

  const deactivateUser = async () => {
    try {
      const response = await deactivateUserMutation.mutateAsync();
      getUsers();
      notifications.show({
        title: "Action Successful",
        message: response?.message || "User status updated",
        color: "green",
      });
      setDeactivateAlertModalOpen(false);
      setDeactivateSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Action Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const handleExport = () => {
    exportMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_export_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`; // adjust extension if CSV/PDF
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Export Successful",
          message: "Your file has been downloaded",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Export Failed",
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={(value) => value && navigate(`/admin/${value}`)}
        classNames={{
          tab: "!text-secondary-text hover:!text-primary-red !transition !bg-white hover:!bg-light-red !text-[14px] !border-transparent !font-medium data-[active=true]:!text-primary-red hover:!border-primary-red  data-[active=true]:!border-primary-red !pb-4",
          list: "gap-6",
        }}
      >
        <div className="bg-white border-b-2 border-[#d0d5dd]">
          <div className="px-6 md:px-10 pt-5 pb-2">
            <Flex mb="lg" justify="space-between">
              <div>
                <Title className="!text-primary-text text-2xl" order={2}>
                  User Management
                </Title>
                <Text className="!text-secondary-text">
                  Manage all user access on your system
                </Text>
              </div>
              <Flex gap={15}>
                <CustomButton
                  border={false}
                  className="!rounded-lg"
                  size="md"
                  onClick={() => navigate("/admin/users/create")}
                  rightSection={
                    <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                      <BsPlus className="!text-xl !text-white" />
                    </div>
                  }
                >
                  Add New
                </CustomButton>
                <CustomButton
                  border={false}
                  type="dark"
                  className=""
                  size="md"
                  onClick={handleExport}
                  loading={exportMutation?.isPending}
                  disabled={exportMutation?.isPending}
                  rightSection={
                    <div className="!inline-flex !bg-[#686868] p-1 w-fit rounded-md">
                      <GoArrowUpRight className="!text-xl !text-white" />
                    </div>
                  }
                >
                  Export
                </CustomButton>
              </Flex>
            </Flex>
          </div>

          <Flex className="px-6 md:px-10" gap={15} justify="space-between">
            <Tabs.List>
              <Tabs.Tab value="users">Manage Users</Tabs.Tab>
              <Tabs.Tab value="roles">Manage Roles</Tabs.Tab>
            </Tabs.List>

            <TextInput
              leftSection={<HiSearch />}
              placeholder="Search"
              radius="md"
              className="!w-72 max-w-[100%]"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </Flex>
        </div>

        <div className="px-6 md:px-10">
          <Tabs.Panel value="users" pt="md" pb={30}>
            {getUsersMutation.isPending && <LoadingState description="Fetching users data from the system." />}
            {!getUsersMutation.isPending && (
              <>
                {users.length ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map((user) => (
                        <Card key={user.uuid} radius="lg" className="p-10">
                          <Flex justify="space-between" align="center" gap={5}>
                            <Flex gap={10}>
                              <Avatar
                                src={user.avatar}
                                alt="Profile"
                                radius="md"
                                size={40}
                                className="border-3 border-primary-red rounded-lg"
                              />
                              <div>
                                <Text className="!font-medium !text-primary-red !text-sm">
                                  <NavLink to={`/admin/users/${user.uuid}`}>
                                    {user.name}
                                  </NavLink>
                                </Text>
                                <Text className="!text-secondary-text !text-sm">
                                  Role:{" "}
                                  <span className="!text-[#575757]">
                                    <NavLink
                                      to={`/admin/roles/${user.roles?.[0]?.uuid}`}
                                    >
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
                              checked={isActive(user.is_active)}
                              onClick={() => selectUser(user)}
                            />
                          </Flex>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-10">
                      <Paginator
                        currentPage={currentPage}
                        isLoading={getUsersMutation.isPending}
                        total={total}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                      />
                    </div>
                  </>
                ) : (
                  <EmptyState
                    btnText="Add User"
                    description="No users found"
                    title="No users found"
                    redirectLink="/admin/users/create"
                  />
                )}
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="roles" pt="md">
            <Text>Role management content goes here...</Text>
          </Tabs.Panel>
        </div>
      </Tabs>

      {/* deactivate modals */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${currentUserActiveStatus ? "Deactivate" : "Reactivate"} User ?`}
        description={`Are you sure you want to ${
          currentUserActiveStatus ? "deactivate" : "reactivate"
        } this user?`}
        primaryButton={{
          label: currentUserActiveStatus ? "Deactivate" : "Reactivate",
          loading: deactivateUserMutation.isPending,
          disabled: deactivateUserMutation.isPending,
          onClick: deactivateUser,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeactivateAlertModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={deactivateSuccessModalOpen}
        onClose={() => setDeactivateSuccessModalOpen(false)}
        status="success"
        title={`User ${!currentUserActiveStatus ? "Activated" : "Deactivated"}`}
        description={`User profile has been successfully ${
          !currentUserActiveStatus ? "activated" : "deactivated"
        }.`}
        primaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />
    </div>
  );
}
