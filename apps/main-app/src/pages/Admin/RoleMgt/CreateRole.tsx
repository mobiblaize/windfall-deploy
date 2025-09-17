import { Card, Text, Title, Container, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import RoleStep1 from "./RoleStep1";
import RoleStep2 from "./RoleStep2";
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";

const breadCrumbs: Crumb[] = [
  { label: "Role Management", to: "/admin/roles" },
  { label: "Create a new role", to: `/admin/roles/create` },
];

export type Permission = {
  uuid: string;
  name: string;
  display_name: string;
  description: string;
  module: string;
  is_active: string;
  created_at: string;
  is_selected: boolean;
};

export default function CreateRole() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const togglePermission = (index: number) => {
    const updated = [...permissions];
    updated[index]["is_selected"] = !updated[index]["is_selected"];
    setPermissions(updated);
  };

  const {
    isError: isPermissionError,
    isLoading: isLoadingPermissions,
    data: permissionResponse,
    error: permissionError,
  } = useFetchData(`admin/user-management/permissions/all`);
  const createRoleMutation = usePostData("admin/user-management/roles/create");

  const [step, setStep] = useState<1 | 2>(1);

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (isPermissionError) {
      notifications.show({
        title: "Failed to fetch permissions",
        message:
          (permissionError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
    if (permissionResponse) {
      setPermissions(
        (permissionResponse.data as Permission[])?.map((permission) => {
          return {
            ...permission,
            is_selected: false,
          };
        })
      );
    }
  }, [permissionError, isPermissionError, permissionResponse]);

  const navigate = useNavigate();

  function manageRoles() {
    setSuccessModalOpen(false);
    navigate("/admin/roles");
  }

  function back() {
    if (step === 2) setStep(1);
    else navigate("/admin/roles");
  }

  function next() {
    if (step === 1) setStep(2);
    else setAlertModalOpen(true);
  }

  async function handleCreateRole() {
    const payload = {
      name,
      description,
      permissions: permissions
        .filter((p) => p.is_selected) // only include checked
        .map((p) => p.uuid), // extract ids
    };

    try {
      const response = await createRoleMutation.mutateAsync(payload);
      notifications.show({
        title: "Role Creation Successful",
        message: response?.message || "Role created successfully",
        color: "green",
      });
      setAlertModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Role Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-16 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-16 pt-7 pb-2">
          <Flex mb="lg" justify="space-between">
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                Create a New Role
              </Title>
              <Text className="!text-secondary-text">
                Create a new role on the system with ease.
              </Text>
            </div>
            <CustomButton
              size="lg"
              border={false}
              disabled={step === 2 ? false : true}
              fullWidth={false}
              variant="default"
              onClick={next}
            >
              <span className="!font-medium">Save and Update Changes</span>
            </CustomButton>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        {step === 1 && (
          <RoleStep1
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            back={back}
            next={next}
          />
        )}
        {step === 2 && (
          <RoleStep2
            permissions={permissions}
            togglePermission={togglePermission}
            isLoadingPermissions={isLoadingPermissions}
            back={back}
            next={next}
          />
        )}
      </Container>

      <AdminAlertModal
        opened={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        status="error"
        title={<span>Create Role ?</span>}
        description={
          <span>
            Are you sure you want to create this role with it associated
            permission? <br /> <br /> Kindly note that creation might not be
            immediate as it might pass through an approval process.
          </span>
        }
        primaryButton={{
          label: "Create Role",
          onClick: handleCreateRole,
          loading: createRoleMutation.isPending,
          disabled: createRoleMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setAlertModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={manageRoles}
        status="success"
        title="Role Created"
        description="Role has been successfully Created"
        secondaryButton={{
          label: "Close",
          onClick: manageRoles,
        }}
      />
    </div>
  );
}
