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
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import type { Role } from "./UserMgt";
import { useForm } from "@mantine/form";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

const breadCrumbs: Crumb[] = [
  { label: "User Management", to: "/admin/users" },
  { label: "Create a new user", to: `/admin/users/create` },
];

export default function CreateUser() {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const navigate = useNavigate();

  const {
    isError,
    data: response,
    error,
  } = useFetchData(`admin/user-management/roles/all?paginate=0`);
  const createUserMutation = usePostData("admin/user-management/users/create");

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch roles",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setRoles(response.data?.records);
    }
  }, [error, isError, response]);

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

  const handleSubmit = async (values: typeof form.values) => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      role_id: values.role_id,
    };

    try {
      const response = await createUserMutation.mutateAsync(payload);
      notifications.show({
        title: "User Creation Successful",
        message: response?.message || "User created successfully",
        color: "green",
      });
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "User Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  function manageUsers() {
    setSuccessModalOpen(false);
    navigate("/admin/users");
  }

  function closeModal() {
    form.reset();
    setSuccessModalOpen(false);
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
                Create a User
              </Title>
              <Text className="!text-secondary-text">
                Add a new user to raffle management system
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
                  type="email"
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
              onClick={manageUsers}
              leftSection={<BsChevronLeft />}
            >
              Back
            </Button>
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              buttonType="submit"
              variant="default"
              rightSection={<BsChevronRight />}
              disabled={createUserMutation.isPending}
              loading={createUserMutation.isPending}
            >
              Continue
            </CustomButton>
          </Flex>
        </form>
      </Container>

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="User Profile Created"
        description="A new user profile has been successfully created. Given this, a corresponding email has been shared with this user with steps to setup their account to access WinIT Platform."
        primaryButton={{
          label: "Manage Users",
          onClick: manageUsers,
        }}
        secondaryButton={{
          label: "Close",
          onClick: closeModal,
        }}
      />
    </div>
  );
}
