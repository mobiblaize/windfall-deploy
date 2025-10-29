import {
  TextInput,
  Select,
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import type { Role, User } from "./UserMgt";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const navigate = useNavigate();

  const {
    isError: isRoleError,
    data: roleResponse,
    error: roleError,
  } = useFetchData(`admin/user-management/roles/all?paginate=0`);

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useFetchData(`admin/user-management/users/show/${id}`);

  const updateUserMutation = usePutData(
    `admin/user-management/users/update/${id}`
  );

  useEffect(() => {
    if (isRoleError) {
      notifications.show({
        title: "Failed to fetch roles",
        message:
          (roleError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (roleResponse) {
      setRoles(roleResponse.data?.records);
    }
  }, [roleError, isRoleError, roleResponse]);

  useEffect(() => {
    if (isUserError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (userError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (userResponse) {
      setUser(userResponse.data?.record);
    }
  }, [userError, isUserError, userResponse]);

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        role_id: user.roles?.[0]?.uuid || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      role_id: "",
    },

    validate: {
      name: (val) =>
        val.trim().split(" ").length >= 2
          ? null
          : "Enter both firstname and lastname",
      email: (val) => {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
      phone_number: (val) =>
        val.length >= 10 ? null : "Enter a valid phone number",
      role_id: (val) => (val ? null : "Select a Role"),
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmModalOpen(true);
  };

  const updateUser = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      name: form.values.name,
      email: form.values.email,
      phone_number: form.values.phone_number,
      role_id: form.values.role_id,
    };

    try {
      const response = await updateUserMutation.mutateAsync(payload);
      notifications.show({
        title: "User Update Successful",
        message: response?.message || "User updated successfully",
        color: "green",
      });
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "User Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const userLink = `/admin/users/${id}`;

  function userDetails() {
    setSuccessModalOpen(false);
    navigate(`/admin/users/${id}`, { replace: true });
  }

  const breadCrumbs: Crumb[] = [
    { label: "User Management", to: "/admin/users" },
    { label: user?.name || 'User', to: userLink },
    { label: "Edit user" },
  ];

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
                Edit User
              </Title>
              <Text className="!text-secondary-text">
                Update user information to raffle management system
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {/* User Name */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={12}>
                <h3 className="font-bold text-xl text-primary-red">
                  Create a User
                </h3>
                <p className="text-base text-secondary-text">
                  Enter valid information / details below
                </p>
              </Grid.Col>
            </Grid>
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  User Name <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Enter a unique name
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <TextInput
                  placeholder="Enter user name"
                  {...form.getInputProps("name")}
                />
              </Grid.Col>
            </Grid>

            {/* Email Address */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Email Address <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Enter a unique email address. This would be used for login
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <TextInput
                  placeholder="example@mail.com"
                  styles={inputStyles}
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
            </Grid>

            {/* Phone Number */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Phone Number
                </h3>
                <p className="text-base text-secondary-text">
                  Enter user’s phone number
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <TextInput
                  placeholder="+234"
                  styles={inputStyles}
                  {...form.getInputProps("phone_number")}
                />
              </Grid.Col>
            </Grid>

            {/* Role */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Role <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Assign this user to a role, with an associated permission
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Select
                  data={roles?.map((role) => {
                    return {
                      label: role.display_name,
                      value: role.uuid,
                    };
                  })}
                  styles={inputStyles}
                  placeholder="Select Role"
                  {...form.getInputProps("role_id")}
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Footer Buttons */}
          <Flex
            justify="flex-end"
            gap={20}
            className="!bg-white !rounded-xl !border !border-gray-200 !p-6 sm:!mx-5 md:!mx-30 lg:!mx-40 !mb-10"
          >
            <Button
              size="lg"
              fullWidth={false}
              variant="default"
              onClick={userDetails}
              leftSection={<BsChevronLeft />}
            >
              Back
            </Button>
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              variant="default"
              rightSection={<BsChevronRight />}
              disabled={isUserLoading}
              buttonType="submit"
            >
              Continue
            </CustomButton>
          </Flex>
        </form>
      </Container>

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        status="error"
        title="Save Changes ?"
        description="Are you sure you want save this changes for this user ?  Kindly note that action is irreversible as this new changes would override the existing data."
        primaryButton={{
          label: "Yes, Save and Update Changes",
          onClick: updateUser,
          disabled: updateUserMutation.isPending,
          loading: updateUserMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={userDetails}
        status="success"
        title="New Changes Saved"
        description="Congratulation, new changed saved and updated successfully"
        primaryButton={{
          label: "Close",
          onClick: userDetails,
        }}
      />
    </div>
  );
}
