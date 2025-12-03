import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Switch,
  Divider,
  ActionIcon,
  Table,
  Group,
  Button,
  Box,
  TextInput,
  Select,
  Skeleton,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import TableContainer from "../../../components/TableContainer";
import { GoArrowUpRight } from "react-icons/go";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import TabSwitcher, {
  type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import { notifications } from "@mantine/notifications";
import {
  useDeleteData,
  useFetchData,
  useGetData,
  useGetExportData,
} from "../../../utils/hooks/useApis";
import type { User } from "../UserMgt/UserMgt";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import type { Role } from "./RoleMgt";
import { format } from "date-fns";
import TablePaginator from "../../../components/TablePaginator";
import LoadingState from "../../../components/LoadingState";
import EmptySection from "../../../components/EmptySection";
import EmptyState from "../../../components/EmptyState";

const breadCrumbs: Crumb[] = [
  { label: "Role Management", to: "/admin/roles" },
  { label: "View Role Details" },
];

const tabs: TabSwitcherTab[] = [
  {
    label: "Show All",
    value: "",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export default function RoleDetails() {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<Role>();
  const [users, setUsers] = useState<User[]>([]);
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const usersMutation = useGetData(
    `admin/user-management/roles/users-by-role/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportUsersMutation = useGetExportData(
    `admin/user-management/roles/users-by-role/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`admin/user-management/roles/show/${id}`);
  const deactivateRoleMutation = useGetData(
    `admin/user-management/roles/toggle-status/${id}`
  );
  const deleteRoleMutation = useDeleteData(
    `admin/user-management/roles/delete`
  );

  function isActive(isActive?: "true" | "false") {
    return isActive === "true";
  }

  const roleActive = isActive(role?.is_active);

  useEffect(() => {
    setFilterPage(1);
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sortBy, filterBy]);

  function onPageChange(page: number) {
    setFilterPage(page);
    getUsers();
  }

  async function getUsers() {
    setUsers([]);
    try {
      const response = await usersMutation.mutateAsync();
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

  // react to fetch result
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Role",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setRole(response.data?.record);
    }
  }, [error, isError, response]);

  const navigate = useNavigate();

  function closeDeleteModal() {
    setDeleteSuccessModalOpen(false);
    navigate("/admin/roles");
  }

  const deactivateRole = async () => {
    try {
      const response = await deactivateRoleMutation.mutateAsync();
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Role status updated",
        color: "green",
      });
      setRole((prev) =>
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

  const deleteRole = async () => {
    try {
      const response = await deleteRoleMutation.mutateAsync(id);
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Role deleted successfully",
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
    exportUsersMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${role?.name}_users_export_${new Date()
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
                    {role?.display_name || "-"}
                  </Title>
                )}
              <Text className="!text-secondary-text">
                View and manage role details
              </Text>
            </div>

            <Flex align="center" wrap="wrap" gap={20} justify="end">
              <Text className="!text-secondary-text !mr-5">Take Action</Text>

              <Tooltip label="Edit Role" withArrow>
                <ActionIcon
                  onClick={() => {
                    navigate(`/admin/roles/edit/${role?.uuid}`);
                  }}
                  size={35}
                  className="!text-[#4313F7] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#F4F3FF] !h-10 !w-10 !flex !items-center !justify-center"
                >
                  <FaUserEdit />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={roleActive ? "Deactivate Role" : "Activate Role"} withArrow>
                <span className="!cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-lg !bg-[#EDFCF2] !h-10 !w-10 !flex !items-center !justify-center">
                  <Switch
                    size="sm"
                    onClick={() => {
                      setDeactivateAlertModalOpen(true);
                    }}
                    checked={roleActive}
                    className="!cursor-pointer"
                    color="#13F7B5"
                    thumbIcon={<></>}
                  />
                </span>
              </Tooltip>
              <Tooltip label="Delete Role" withArrow>
                <ActionIcon
                  onClick={() => {
                    setDeleteAlertModalOpen(true);
                  }}
                  size={35}
                  className="!text-[#F71355] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#FFF1F3] !h-10 !w-10 !flex !items-center !justify-center"
                >
                  <RiDeleteBin3Fill />
                </ActionIcon>
              </Tooltip>
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
            <span
              className={`flex items-center uppercase justify-center h-11 w-11 rounded-lg transition !font-semibold !border-3 ${
                roleActive
                  ? "!bg-light-red !text-primary-red !border-[#FFBABA]"
                  : "!bg-[#FAFAFB] !border-[#ABABAB] !text-[#ABABAB]"
              }`}
            >
              {role?.display_name?.substring(0, 2) || "-"}
            </span>
            <Text className="!font-semibold !text-base !text-primary-text">
              Basic Details
            </Text>
          </div>

          <Divider c="#EFEEF2" className="mb-6" />

          {/* Empty state for missing role */}
          {!isLoading && !role ? (
            <EmptyState
              title="No Role Details"
              description="We couldn't find details for this role."
              format="secondary"
              fullWidth={true}
            />
          ) : (
            <>
              {/* Details Grid */}
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Text className="!text-sm !text-secondary-text">Role Name</Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {role?.display_name || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="md:border-l md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">
                    Number of Users
                  </Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {role?.user_count ?? "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col
                  span={{ base: 12, sm: 6, md: 3 }}
                  className="mantine-md:border-l mantine-md:border-gray-200"
                >
                  <Text className="!text-sm !text-secondary-text">
                    Date Created
                  </Text>
                  {isLoading ? (
                    <Skeleton height={16} width="80%" />
                  ) : (
                    <Text className="!font-medium break-words !text-[#575757]">
                      {role?.created_at
                        ? format(new Date(role.created_at), "MMMM d, yyyy")
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
                      {role?.updated_by?.name || "-"}
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col span={{ base: 12 }} className="pt-4">
                  <div className="md:pt-4 md:border-t md:border-gray-200">
                    <Text className="!text-sm !text-secondary-text">
                      Description
                    </Text>
                    {isLoading ? (
                      <Skeleton height={16} width="80%" />
                    ) : (
                      <Text className="!font-medium break-words !text-[#575757]">
                        {role?.description || "-"}
                      </Text>
                    )}
                  </div>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Card>

        {/* Users Section */}
        <section className="text-secondary-text">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  List of Users
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage users under this role
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportUsersMutation?.isPending}
                disabled={exportUsersMutation?.isPending}
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
              <Flex justify="space-between" align="center">
                <TabSwitcher
                  tabs={tabs}
                  activeTab={filterBy}
                  onChange={setFilterBy}
                />
              </Flex>
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
                {/* <Select
                  value={filterBy}
                  onChange={setFilterBy}
                  rightSection={<IoFilterOutline />}
                  placeholder="Filter by: Show all"
                  data={[
                    { value: "approved", label: "Approved" },
                    { value: "pending", label: "Pending" },
                    { value: "declined", label: "Declined" },
                  ]}
                  className="!rounded-xl !shadow-sm"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                /> */}
              </Group>
            </Flex>

            {usersMutation.isPending && (
              <LoadingState
                title="Loading users..."
                description="Fetching role users"
              />
            )}

            {!usersMutation.isPending && (
              <>
                {/* Table for larger screens */}
                <div className="!hidden sm:!block">
                  <TableContainer
                    headers={[
                      "User Name",
                      "User ID",
                      "Created",
                      "Last Active",
                      "",
                    ]}
                  >
                    {users.map((user, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>
                          <Text className="!text-base !font-medium text-[#3B3B3B]">
                            {user.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>{user.uniqueID}</Table.Td>
                        <Table.Td>
                          {user?.created_at
                            ? format(new Date(user.created_at), "MMMM d, yyyy")
                            : "-"}
                        </Table.Td>
                        <Table.Td>
                          {user?.last_login
                            ? format(
                                new Date(user.last_login),
                                "MMMM d, yyyy h:mm a"
                              )
                            : "-"}
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            size={35}
                            onClick={() =>
                              navigate(`/admin/users/${user.uuid}`)
                            }
                            className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                          >
                            <GoArrowUpRight />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </TableContainer>
                </div>

                {/* Card view for small screens */}
                <div className="sm:!hidden space-y-4 p-4">
                  {users.map((user, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
                    >
                      <p>
                        <strong>User Name:</strong> {user.name}
                      </p>
                      <p>
                        <strong>User ID:</strong> {user.uniqueID}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {user?.created_at
                          ? format(new Date(user.created_at), "MMMM d, yyyy")
                          : "-"}
                      </p>
                      <p>
                        <strong>Last Active:</strong>{" "}
                        {user?.last_login
                          ? format(
                              new Date(user.last_login),
                              "MMMM d, yyyy h:mm a"
                            )
                          : "-"}
                      </p>
                      <ActionIcon
                        size={35}
                        onClick={() => navigate(`/admin/users/${user.uuid}`)}
                        className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                      >
                        <GoArrowUpRight />
                      </ActionIcon>
                    </div>
                  ))}
                </div>

                {!users.length && (
                  <EmptySection
                    description="No Users Found"
                    title="No records found"
                    format="secondary"
                  />
                )}
              </>
            )}

            {/* Pagination */}
            <TablePaginator
              currentPage={currentPage}
              isLoading={usersMutation.isPending}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        </section>
      </div>

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${roleActive ? "Deactivate" : "Reactivate"} Role ?`}
        description={`${roleActive ? "Are you sure you want to deactivate this role ? Kindly note that users under this role would be temporarily been revoked of their access and be assigned to system default role." : "Are you sure you want to reactivate this role ? Kindly note that users under this role would be restored of their access and be assigned back to this role."}`}
        primaryButton={{
          label: `${roleActive ? "Deactivate" : "Reactivate"} Role`,
          loading: deactivateRoleMutation.isPending,
          disabled: deactivateRoleMutation.isPending,
          onClick: deactivateRole,
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
        title={`Role ${roleActive ? "Reactivated" : "Deactivated"}`}
        description={`${roleActive ? "Congratulations, Role  has been successfully reactivated" : "Congratulations, Role has been successfully deactivated"}`}
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
        title={<span className="!text-primary-red">Delete Role ?</span>}
        description="Are you sure you want to delete this role? Kindly note that action is irreversible and therefore, this role would be removed / permanently deleted and it associated user access would be revoked"
        primaryButton={{
          label: "Delete Role",
          loading: deleteRoleMutation.isPending,
          disabled: deleteRoleMutation.isPending,
          onClick: deleteRole,
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
        title="Role Deleted"
        description="Congratulations, role has been successfully Deleted"
        primaryButton={{
          label: "Close",
          onClick: closeDeleteModal,
        }}
      />
    </div>
  );
}
