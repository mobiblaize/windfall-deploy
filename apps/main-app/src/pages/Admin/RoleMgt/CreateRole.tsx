import { Card, Text, Title, Container, Flex, Button } from "@mantine/core";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import RoleStep1 from "./RoleStep1";
import RoleStep2 from "./RoleStep2";

const breadCrumbs: Crumb[] = [
  { label: "Role Management", to: "/admin/roles" },
  { label: "Create a new role", to: `/admin/roles/create` },
];

export type Permission = {
  module: string;
  description: string;
  canView: boolean;
  canEdit: boolean;
};

const initialPermissions: Permission[] = [
  {
    module: "Dashboard",
    description: "Overview of system activities.",
    canView: false,
    canEdit: true,
  },
  {
    module: "Raffle Management",
    description: "Create and manage all raffles.",
    canView: false,
    canEdit: false,
  },
  {
    module: "Draw Management",
    description: "Control and schedule raffle draws.",
    canView: true,
    canEdit: false,
  },
  {
    module: "Customer Management",
    description: "View and manage user profiles",
    canView: true,
    canEdit: false,
  },
  {
    module: "Transaction Management",
    description: "Track all user payment activity",
    canView: true,
    canEdit: false,
  },
  {
    module: "Prize Management",
    description: "Add or update prize offerings",
    canView: false,
    canEdit: true,
  },
  {
    module: "Prize Claim",
    description: "Handle and approve prize claims",
    canView: false,
    canEdit: false,
  },
];

export default function CreateRole() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [permissions, setPermissions] = useState(initialPermissions);

  const togglePermission = (index: number, field: "canView" | "canEdit") => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const [step, setStep] = useState<1 | 2>(1);

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  function manageRoles() {
    setSuccessModalOpen(false);
    navigate("/admin/roles");
  }

  function closeAlertModal() {
    setAlertModalOpen(false);
    setSuccessModalOpen(true);
  }

  function back() {
    if (step === 2) setStep(1);
    else navigate("/admin/roles");
  }

  function next() {
    if (step === 1) setStep(2);
    else setAlertModalOpen(true);
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
          />
        )}
        {step === 2 && (
          <RoleStep2
            permissions={permissions}
            togglePermission={togglePermission}
          />
        )}

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
            onClick={back}
          >
            Back
          </Button>
          <CustomButton
            size="lg"
            border={false}
            fullWidth={false}
            variant="default"
            rightSection={<BsChevronRight />}
            onClick={next}
          >
            Continue
          </CustomButton>
        </Flex>
      </Container>
      
      <AdminAlertModal
        opened={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        status="error"
        title={<span>Create Role ?</span>}
        description={<span>Are you sure you want to create this role with it associated permission? <br/> <br/> Kindly note that creation might not be immediate as it might pass through an approval process.</span>}
        primaryButton={{
          label: "Create Role",
          onClick: closeAlertModal,
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
