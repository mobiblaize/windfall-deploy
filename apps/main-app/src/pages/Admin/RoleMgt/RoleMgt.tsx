import {
  Tabs,
  Text,
  Title,
  Flex,
  Switch,
  Card,
  TextInput,
} from "@mantine/core";
import { BsPlus } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { GoArrowUpRight } from "react-icons/go";
import { useGetData, useGetExportData } from "../../../utils/hooks/useApis";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { format } from "date-fns";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import Paginator from "../../../components/Paginator";
import type { Permission } from "./CreateRole";

export interface Role {
  uuid: string;
  name: string;
  display_name: string;
  guard_name?: string;
  description: string;
  is_active: "true" | "false";
  created_at: string;
  user_count: number;
  updated_by: UpdatedBy
  permissions: Permission[]
}

export interface UpdatedBy {
  uuid: string
  name: string
  uniqueID: string
  avatar: string
  enforce_password_change: boolean
}

function isActive(isActive?: "true" | "false") {
  return isActive === "true";
}

type CardProps = {
  role: Role;
  selectRole: (role: Role) => void;
};

function RoleCard({ role, selectRole }: CardProps) {
  const active = isActive(role.is_active);
  return (
    <Card
      shadow="sm"
      radius="lg"
      padding="lg"
      className={`rounded-2xl border transition ${
        active
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-gray-50 opacity-70"
      }`}
    >
      <div className="flex items-center justify-between">
        <NavLink to={`/admin/roles/${role.uuid}`}>
          <div className="flex flex-wrap items-start gap-4">
            {/* Avatar with initials */}
            <span
              className={`flex items-center uppercase justify-center h-11 w-11 rounded-lg transition !font-semibold !border-3 ${
                active
                  ? "!bg-light-red !text-primary-red !border-[#FFBABA]"
                  : "!bg-[#FAFAFB] !border-[#ABABAB] !text-[#ABABAB]"
              }`}
            >
              {role.display_name.substring(0,2)}
            </span>
            {/* Role Info */}
            <div>
              <Text className="!font-semibold !text-sm">{role.display_name}</Text>
              <Text className="!text-sm !text-gray-500">
                Date Created:{" "}
                <span className="text-gray-700">
                  {role?.created_at
                    ? format(new Date(role.created_at), "MMMM d, yyyy")
                    : "-"}
                </span>
              </Text>
              <Text className="!text-sm !text-gray-500">
                Number of User: <span className="!text-gray-700">{role.user_count}</span>
              </Text>
            </div>
          </div>
        </NavLink>

        {/* Toggle */}
        <Switch
          size="md"
          className="!cursor-pointer"
          color="#039855"
          thumbIcon={<></>}
          checked={isActive(role.is_active)}
          onClick={() => selectRole(role)}
        />
      </div>

      {/* Description */}
      <Text className="!text-sm !text-gray-600 !mt-3 !leading-snug">
        {role.description}
      </Text>
    </Card>
  );
}

export default function RoleManagement() {
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>();
  const activeTab = section || "roles";

  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const [currentRoleActiveStatus, setCurrentRoleActiveStatus] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const getRolesMutation = useGetData(
    `admin/user-management/roles/all?paginate=1&search=${debouncedSearch}&page=${filterPage}`
  );
  const exportMutation = useGetExportData(
    `admin/user-management/roles/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&export=1`
  );
  const deactivateRoleMutation = useGetData(
    `admin/user-management/roles/toggle-status/${currentRoleId}`
  );

  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);

  // Re-fetch when search or page changes
  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterPage]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  async function getRoles() {
    try {
      const response = await getRolesMutation.mutateAsync();
      setRoles(response.data?.records?.data || []);
      setCurrentPage(response.data?.records?.current_page || 1);
      setTotal(response.data?.records?.total || 0);
      setPageSize(response.data?.records?.per_page || 10);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch roles",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const selectRole = (role: Role) => {
    setCurrentRoleId(role.uuid);
    setCurrentRoleActiveStatus(isActive(role.is_active));
    setDeactivateAlertModalOpen(true);
  };

  const deactivateRole = async () => {
    try {
      const response = await deactivateRoleMutation.mutateAsync();
      getRoles();
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Role status updated",
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
        a.download = `roles_export_${new Date()
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

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    navigate(`/admin/${value}`);
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
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
                  Role Management
                </Title>
                <Text className="!text-secondary-text">
                  Manage all roles access on your system
                </Text>
              </div>
              <Flex gap={15}>
                <CustomButton
                  border={false}
                  className="!rounded-lg"
                  size="md"
                  onClick={() => navigate("/admin/roles/create")}
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
          <Tabs.Panel value="users" pt="md">
            User management content goes here...
          </Tabs.Panel>

          <Tabs.Panel value="roles" pt="md" pb={30}>
            {getRolesMutation.isPending && (
              <LoadingState description="Fetching roles data from the system." />
            )}
            {!getRolesMutation.isPending && (
              <>
                {roles.length ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <RoleCard
                          key={role.uuid}
                          role={role}
                          selectRole={selectRole}
                        />
                      ))}
                    </div>
                    <div className="mt-10">
                      <Paginator
                        currentPage={currentPage}
                        isLoading={getRolesMutation.isPending}
                        total={total}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                      />
                    </div>
                  </>
                ) : (
                  <EmptyState
                    btnText="Add User"
                    description="No roles found"
                    title="No roles found"
                    redirectLink="/admin/roles/create"
                  />
                )}
              </>
            )}
          </Tabs.Panel>
        </div>
      </Tabs>
      {/* deactivate modals */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${currentRoleActiveStatus ? "Deactivate" : "Reactivate"} Role ?`}
        description={`${currentRoleActiveStatus ? "Are you sure you want to deactivate this role ? Kindly note that users under this role would be temporarily been revoked of their access and be assigned to system default role." : "Are you sure you want to reactivate this role ? Kindly note that users under this role would be restored of their access and be assigned back to this role."}`}
        primaryButton={{
          label: currentRoleActiveStatus ? "Deactivate" : "Reactivate",
          loading: deactivateRoleMutation.isPending,
          disabled: deactivateRoleMutation.isPending,
          onClick: deactivateRole,
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
        title={`Role ${!currentRoleActiveStatus ? "Reactivated" : "Deactivated"}`}
        description={`${!currentRoleActiveStatus ? "Congratulations, Role  has been successfully reactivated" : "Congratulations, Role has been successfully deactivated"}`}
        primaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />
    </div>
  );
}
