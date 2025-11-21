import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Switch,
  Avatar,
  Divider,
  ActionIcon,
  Group,
  Button,
  Box,
  TextInput,
  Select,
  Skeleton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { GoArrowUpRight } from "react-icons/go";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import UserAction from "./UserAction";
import type { User } from "./UserMgt";
import {
  useDeleteData,
  useFetchData,
  useGetData,
  useGetExportData,
} from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import TablePaginator from "../../../components/TablePaginator";
import { format } from "date-fns";
import DynamicTableSection from "../../../components/DynamicTableSection";
import EmptyState from "../../../components/EmptyState";

const breadCrumbs: Crumb[] = [
  { label: "User Management", to: "/admin/users" },
  { label: "View User Details" },
];

export interface UserActivity {
  uuid: string;
  uniqueID: string;
  name: string;
  action: string;
  action_type: string;
  action_module: string;
  causer_id: string;
  description: string;
  created_at: string;
  causer: Causer;
}

export interface Causer {
  uuid: string;
  name: string;
  approvalStatus: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userActionModalOpen, setUserActionModalOpen] = useState(false);
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(
    null
  );

  function showUserAction(activity: UserActivity) {
    setSelectedActivity(activity);
    setUserActionModalOpen(true);
  }

  const userActivitiesMutation = useGetData(
    `admin/user-management/users/show/activities/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}`
  );

  const exportActivitiesMutation = useGetExportData(
    `admin/user-management/users/show/activities/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&export=1`
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`admin/user-management/users/show/${id}`);
  const deactivateUserMutation = useGetData(
    `admin/user-management/users/toggle-status/${id}`
  );
  const deleteUserMutation = useDeleteData(
    `admin/user-management/users/delete`
  );

  function isActive(isActive?: "true" | "false") {
    return isActive === "true";
  }

  const userActive = isActive(user?.is_active);

  useEffect(() => {
    setFilterPage(1);
    getUserActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sortBy]);

  function onPageChange(page: number) {
    setFilterPage(page);
    getUserActivities();
  }

  async function getUserActivities() {
    setUserActivities([]);
    try {
      const response = await userActivitiesMutation.mutateAsync();
      setUserActivities(response.data?.records?.data || []);
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

  // react to fetch result
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setUser(response.data?.record);
    }
  }, [error, isError, response]);

  const navigate = useNavigate();

  function closeDeleteModal() {
    setDeleteSuccessModalOpen(false);
    navigate("/admin/users");
  }

  const deactivateUser = async () => {
    try {
      const response = await deactivateUserMutation.mutateAsync();
      notifications.show({
        title: "Action Successful",
        message: response?.message || "User status updated",
        color: "green",
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              is_active: response.data.is_active,
            }
          : prev
      );
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

  const deleteUser = async () => {
    try {
      const response = await deleteUserMutation.mutateAsync(id);
      notifications.show({
        title: "Action Successful",
        message: response?.message || "User deleted successfully",
        color: "green",
      });
      setDeleteAlertModalOpen(false);
      setDeleteSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Action Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const handleExport = () => {
    exportActivitiesMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `activities_export_${new Date()
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
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2 mb-7">
          <Flex justify="space-between" align="center">
            <div>
              {isLoading ? (
                <Skeleton height={35} width="100%" />
              ) : (
                <Title className="!text-primary-text text-2xl" order={2}>
                  {user?.name || "-"}
                </Title>
              )}

              <Text className="!text-secondary-text">
                View and manage user details
              </Text>
            </div>

            <Flex align="center" wrap="wrap" gap={20} justify="end">
              <Text className="!text-secondary-text !mr-5">Take Action</Text>

              <ActionIcon
                onClick={() => {
                  navigate(`/admin/users/edit/${id}`);
                }}
                size={35}
                className="!text-[#4313F7] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#F4F3FF] !h-10 !w-10 !flex !items-center !justify-center"
              >
                <FaUserEdit />
              </ActionIcon>

              <span
                onClick={() => {
                  setDeactivateAlertModalOpen(true);
                }}
                className="!cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-lg !bg-[#EDFCF2] !h-10 !w-10 !flex !items-center !justify-center"
              >
                <Switch
                  size="sm"
                  checked={userActive}
                  className="!cursor-pointer"
                  color="#13F7B5"
                  thumbIcon={<></>}
                />
              </span>
              <ActionIcon
                onClick={() => {
                  setDeleteAlertModalOpen(true);
                }}
                size={35}
                className="!text-[#F71355] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#FFF1F3] !h-10 !w-10 !flex !items-center !justify-center"
              >
                <RiDeleteBin3Fill />
              </ActionIcon>
            </Flex>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-10 pt-10 pb-10 ">
        <Card
          shadow="sm"
          radius="lg"
          p="lg"
          className="w-full rounded-2xl border !mb-10 border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <Avatar
              src={user?.avatar}
              alt="Profile"
              radius="md"
              size={40}
              className="!border-3 border-primary-red rounded-lg"
            />
            <Text className="!font-semibold !text-base !text-primary-text">
              Basic Details
            </Text>
          </div>

          <Divider c="#EFEEF2" className="mb-6" />

          {!isLoading && !user ? (
            <EmptyState
              title="No User Details"
              description="We couldn't find details for this user."
              format="secondary"
              fullWidth={true}
            />
          ) : (
            <>
              {/* Details Grid */}
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Text className="!text-sm !text-secondary-text">Username</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.name || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="md:border-l md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">Role</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.roles?.map((role) => role.display_name).join(", ") || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="mantine-md:border-l mantine-md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">Email</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.email || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="md:border-l md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">
                    Phone Number
                  </Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.phone_number || "-"}
                    </Text>
                  )}
                </Grid.Col>
              </Grid>

              <Grid
                gutter="xl"
                className="md:mt-8 mb-4 pt-8 md:!border-t md:!border-gray-200"
              >
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Text className="!text-sm !text-secondary-text">
                    Date Created
                  </Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.created_at
                        ? format(new Date(user.created_at), "MMMM d, yyyy")
                        : "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="md:border-l md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">Created by</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.updated_by || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 6 }}
                  className="md:border-l md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">Last Active</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {user?.last_login
                        ? format(new Date(user.last_login), "MMMM d, yyyy h:mm a")
                        : "-"}
                    </Text>
                  )}
                </Grid.Col>
              </Grid>
            </>
          )}
        </Card>

        <section className="text-secondary-text">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  User activities
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage user activity within platform
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportActivitiesMutation?.isPending}
                disabled={exportActivitiesMutation?.isPending}
              >
                Export
              </Button>
            </Flex>
            <Divider mt="md" mb="lg" />
            <Flex
              justify="space-between"
              px="md"
              mb="lg"
              wrap="wrap"
              gap={8}
              align="center"
            >
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!w-72 !rounded-xl shadow-sm"
              />
              <Group>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  rightSection={<IoFilterOutline />}
                  placeholder="Sort by: Show all"
                  data={[
                    { value: "asc", label: "Oldest to Newest" },
                    { value: "desc", label: "Newest to Oldest" },
                  ]}
                  className="!rounded-xl !shadow-sm"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Group>
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Date", key: "date" },
                { label: "Time", key: "time" },
                { label: "Affected Module", key: "module" },
                { label: "Action Type", key: "type" },
                { label: "", key: "action" },
              ]}
              data={userActivities}
              loading={userActivitiesMutation.isPending}
              renderItems={(activity) => [
                activity?.created_at
                  ? format(new Date(activity.created_at), "MMMM d, yyyy")
                  : "-",
                activity?.created_at
                  ? format(new Date(activity.created_at), "h:mm a")
                  : "-",
                activity.action_module,
                activity.action_type,
                
                <ActionIcon
                  onClick={() => showUserAction(activity)}
                  size={35}
                  className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                >
                  <GoArrowUpRight />
                </ActionIcon>
              ]}
            />


            <TablePaginator
              currentPage={currentPage}
              isLoading={userActivitiesMutation.isPending}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        </section>
      </div>

      {/* Success Modal */}
      <UserAction
        opened={userActionModalOpen}
        onClose={() => setUserActionModalOpen(false)}
        activity={selectedActivity}
      />

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${userActive ? "Deactivate" : "Reactivate"} User ?`}
        description={`${userActive ? "Are you sure you want to deactivate this user ? Kindly note that action would translate to this user access being temporarily revoked until their account is manually reactivated again" : "Are you sure you want to reactivate this user ? Kindly note that action would translate to this user revoked access being restored"}`}
        primaryButton={{
          label: `${userActive ? "Deactivate" : "Reactivate"} User`,
          loading: deactivateUserMutation.isPending,
          disabled: deactivateUserMutation.isPending,
          onClick: deactivateUser,
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
        title={`User ${userActive ? "Activated" : "Deactivated"}`}
        description={`User profile has been successfully ${userActive ? "activated" : "deactivated"} and their access to the platform has been ${userActive ? "restored." : "revoked temporarily."}`}
        primaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />

      {/* Delete Alert Modal */}
      <AdminAlertModal
        opened={deleteAlertModalOpen}
        onClose={() => setDeleteAlertModalOpen(false)}
        status="delete"
        title={<span className="!text-primary-red">Delete User ?</span>}
        description="Are you sure you want to delete this user ? Kindly note that action is irreversible and therefore, this user would be removed / permanently deleted and their access revoked"
        primaryButton={{
          label: "Delete User",
          loading: deleteUserMutation.isPending,
          disabled: deleteUserMutation.isPending,
          onClick: deleteUser,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeleteAlertModalOpen(false),
        }}
      />

      {/* Delete Success Modal */}
      <AdminAlertModal
        opened={deleteSuccessModalOpen}
        onClose={closeDeleteModal}
        status="success"
        title="User Deleted"
        description="User profile has been successfully Deleted and their access revoked."
        primaryButton={{
          label: "Close",
          onClick: closeDeleteModal,
        }}
      />
    </div>
  );
}
