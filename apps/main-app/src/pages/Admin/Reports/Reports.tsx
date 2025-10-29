import { Text, Title, Flex, Card } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import Paginator from "../../../components/Paginator";
import type { Permission } from "../RoleMgt/CreateRole";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { CiCalendar } from "react-icons/ci";
import { useForm } from "@mantine/form";

export interface Role {
  uuid: string;
  name: string;
  display_name: string;
  guard_name?: string;
  description: string;
  is_active: "true" | "false";
  created_at: string;
  user_count: number;
  updated_by: UpdatedBy;
  permissions: Permission[];
}

export interface UpdatedBy {
  uuid: string;
  name: string;
  uniqueID: string;
  avatar: string;
  enforce_password_change: boolean;
}

function isActive(isActive?: "true" | "false") {
  return isActive === "true";
}

type CardProps = {
  role: Role;
  selectReport: (role: Role) => void;
};

function ReportCard({ role, selectReport }: CardProps) {
  const active = isActive(role.is_active);
  return (
    <Card
      shadow="sm"
      radius="lg"
      padding="lg"
      onClick={() => selectReport(role)}
      className={`rounded-2xl border transition !cursor-pointer ${
        active
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-gray-50 opacity-70"
      }`}
    >
      <Text className="!text-primary-text !mt-3 !text-xl !leading-snug !font-bold">
        {role.display_name}
      </Text>
      <Text className="!text-sm !text-gray-600 !mt-1 !leading-snug">
        {role.description}
      </Text>
    </Card>
  );
}

export default function Reports() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const [currentRoleActiveStatus, setCurrentRoleActiveStatus] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const getRolesMutation = useGetData(
    `admin/user-management/roles/all?paginate=1&page=${filterPage}`
  );
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);

  const form = useForm({
    initialValues: {
      start_date: "",
      end_date: "",
    },

    validate: {
      start_date: (val) => (val ? null : "Start Date is required"),
      end_date: (val) => (val ? null : "End Date is required"),
    },
  });

  // Re-fetch when search or page changes
  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPage]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }
  
    const handleSubmit = async (values: typeof form.values) => {
      if (form.validate().hasErrors) {
        return;
      }
      console.log(currentRoleId);
      console.log(values);
      
    };

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

  const selectReport = (role: Role) => {
    setCurrentRoleId(role.uuid);
    setCurrentRoleActiveStatus(isActive(role.is_active));
    setDeactivateAlertModalOpen(true);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between" align={"self-start"}>
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                Report
              </Title>
              <Text className="!text-secondary-text">
                Generate reports across important touch points on system.
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-10 py-5">
        {getRolesMutation.isPending && (
          <LoadingState description="Fetching roles data from the system." />
        )}
        {!getRolesMutation.isPending && (
          <>
            {roles.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <ReportCard
                      key={role.uuid}
                      role={role}
                      selectReport={selectReport}
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
                btnText="Create Role"
                description="No roles found"
                format="secondary"
                fullWidth={true}
                title="No roles found"
                redirectLink="/admin/roles/create"
              />
            )}
          </>
        )}
      </div>

      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        title={`Generate Report`}
        description={
          <>
            <div className="mb-5">
              Generate a report to stay abreast with game and platform
              performances
            </div>

            <div className="text-start mb-5">
              <DateInput
                label="Start date"
                placeholder="Pick start date"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("start_date")}
                error={form.errors.start_date}
                rightSection={<CiCalendar />}
              />
            </div>

            <div className="text-start mb-10">
              <DateInput
                label="End date"
                placeholder="Pick end date"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("end_date")}
                error={form.errors.end_date}
                rightSection={<CiCalendar />}
              />
            </div>
          </>
        }
        primaryButton={{
          label: "Generate Report",
          onClick: () => handleSubmit(form.values),
        }}
        secondaryButton={{
          label: "No, Close",
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
    </form>
  );
}
