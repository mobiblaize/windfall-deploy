import { Card, Text, Title, Container, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import RoleStep1 from "./RoleStep1";
import RoleStep2 from "./RoleStep2";
import type { Permission } from "./CreateRole";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import type { Role } from "./RoleMgt";
import LoadingState from "../../../components/LoadingState";

export default function EditRole() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();

  const breadCrumbs: Crumb[] = [
    { label: "Role Management", to: "/admin/roles" },
    { label: "Role Details", to: `/admin/roles/${id}` },
    { label: "Edit role", to: `/admin/roles/create` },
  ];

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [step, setStep] = useState<1 | 2>(1);

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

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

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`admin/user-management/roles/show/${id}`);

  const updateRoleMutation = usePutData(
    `admin/user-management/roles/update/${id}`
  );

  useEffect(() => {
    if (isPermissionError) {
      notifications.show({
        title: "Failed to fetch roles",
        message:
          (permissionError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    if (permissionResponse) {
      const basePermissions = (permissionResponse.data as Permission[])?.map(
        (permission) => ({
          ...permission,
          is_selected: false,
        })
      );

      // If role details also exist, mark the selected ones
      if (response) {
        const role = response.data?.record as Role;
        const selected = role.permissions.map((p) => p.uuid);

        setPermissions(
          basePermissions.map((permission) => ({
            ...permission,
            is_selected: selected.includes(permission.uuid),
          }))
        );
      } else {
        // otherwise just set the base list
        setPermissions(basePermissions);
      }
    }
  }, [isPermissionError, permissionError, permissionResponse, response]);

  // react to fetch result
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch permissions",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setName((response.data?.record as Role)?.name);
      setDescription((response.data?.record as Role)?.description);
      setPermissions((permissions) => {
        return permissions.map((permission) => {
          return {
            ...permission,
            is_selected: (response.data?.record as Role).permissions.some(
              (x) => x.uuid === permission.uuid
            ),
          };
        });
      });
    }
  }, [error, isError, response]);

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
      const response = await updateRoleMutation.mutateAsync(payload);
      notifications.show({
        title: "Role Update Successful",
        message: response?.message || "Role updated successfully",
        color: "green",
      });
      setAlertModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Role Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between">
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                {name}
              </Title>
              <Text className="!text-secondary-text">
                Edit role details and save changes
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
        {isLoading && <LoadingState description="Fetching role details" />}

        {!isLoading && (
          <>
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
          </>
        )}
      </Container>

      <AdminAlertModal
        opened={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        status="error"
        title={<span>Save Changes ?</span>}
        description={
          <span>
            Are you sure you want save this changes for role ? Kindly note that
            action is irreversible as this new changes would override the
            existing data.
          </span>
        }
        primaryButton={{
          label: "Yes, Save and Update Changes",
          onClick: handleCreateRole,
          loading: updateRoleMutation.isPending,
          disabled: updateRoleMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setAlertModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={successModalOpen}
        onClose={manageRoles}
        status="success"
        title="New Changes Saved"
        description="Congratulation, new changed saved and updated successfully"
        secondaryButton={{
          label: "Close",
          onClick: manageRoles,
        }}
      />
    </div>
  );
}
