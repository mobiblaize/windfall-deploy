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
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, { type Crumb } from "../../../components/DynamicBreadCrumbs";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

const dummyStates = [
  { value: "lagos", label: "Lagos State" },
  { value: "oyo", label: "Oyo State" },
  { value: "abuja", label: "FCT" },
];

const breadCrumbs: Crumb[] = [
    { label: "User Management", to: "/admin/users" },
    { label: "Create a new user", to: `/admin/users/create` },
  ];

export default function CreateUser() {
  const [fullName, setFullName] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [state, setState] = useState<string | null>("lagos");

  const navigate = useNavigate();

  function manageUsers() {
    setSuccessModalOpen(false);
    navigate("/admin/users");
  }

  function closeModal() {
    setSuccessModalOpen(false);
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
        <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
          {/* User Name */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={12}>
              <h3 className="font-bold text-xl text-primary-red">
                Create a User
              </h3>
              <p className="text-base text-secondary-text">Enter valid information / details below</p>
            </Grid.Col>
          </Grid>
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                User Name <span className="text-red-500">*</span>
              </h3>
              <p className="text-base text-secondary-text">Enter a unique name</p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <TextInput
                placeholder="Enter user name"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
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
              <TextInput placeholder="example@mail.com" styles={inputStyles} />
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
              <TextInput placeholder="+234" styles={inputStyles} />
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
                data={dummyStates}
                value={state}
                onChange={(value) => setState(value)}
                styles={inputStyles}
                placeholder="Select State"
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
            onClick={() => setSuccessModalOpen(true)}
          >
            Continue
          </CustomButton>
        </Flex>
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
