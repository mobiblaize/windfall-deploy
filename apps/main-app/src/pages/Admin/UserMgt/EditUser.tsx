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
    { label: "Edit user" },
  ];

export default function EditUser() {
  const [fullName, setFullName] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [state, setState] = useState<string | null>("lagos");

  const navigate = useNavigate();

  function showSuccessModal() {
    setConfirmModalOpen(false);
    setSuccessModalOpen(true);
  }

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
        <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
          {/* User Name */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={12}>
              <h3 className="font-bold text-xl text-primary-red">
                Edit User
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
            onClick={() => setConfirmModalOpen(true)}
          >
            Continue
          </CustomButton>
        </Flex>
      </Container>

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={()=>setConfirmModalOpen(false)}
        status="error"
        title="Save Changes ?"
        description="Are you sure you want save this changes for this user ?  Kindly note that action is irreversible as this new changes would override the existing data."
        primaryButton={{
          label: "Yes, Save and Update Changes",
          onClick: showSuccessModal,
        }}
        secondaryButton={{
          label: "Close",
          onClick: ()=>setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="New Changes Saved"
        description="Congratulation, new changed saved and updated successfully"
        primaryButton={{
          label: "Close",
          onClick: manageUsers,
        }}
      />
    </div>
  );
}
