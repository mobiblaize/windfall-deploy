import {
  Button,
  Card,
  Container,
  Flex,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useForm } from "@mantine/form";
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../CreateRaffle/Layout";
import CustomerForm from "./CustomerForm";
import ClaimInformation from "./ClaimInformation";
import DocumentUpload from "./DocumentUpload";
import WinnerStory from "./WinnerStory";

const breadCrumbs: Crumb[] = [
  { label: "Prize Claim", to: "/admin/prize-claims" },
  { label: "Claim a Prize" },
];

function ProcessClaim() {
  const { id } = useParams();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  
  // Fetch prize claim data
  const {
    data: prizeClaimResponse,
    isLoading: isLoadingPrizeClaim,
    isError: isErrorPrizeClaim,
    error: prizeClaimError,
  } = useFetchData(
    id ? `admin/prize-claim-management/show/${id}` : null
  );

  const createMutation = usePostData("admin/game-management/games");
  const {
    data: categoriesData,
    isError: iscategoriesError,
    error: categoriesError,
  } = useFetchData("admin/game-management/category/all?paginate=0");

  useEffect(() => {
    if (iscategoriesError) {
      notifications.show({
        title: "Failed to load Game Categories",
        message:
          (categoriesError as { message: string })?.message ||
          "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }, [iscategoriesError, categoriesError]);

  // Handle prize claim fetch error
  useEffect(() => {
    if (isErrorPrizeClaim) {
      notifications.show({
        title: "Failed to load Prize Claim",
        message:
          (prizeClaimError as { message?: string })?.message ||
          "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }, [isErrorPrizeClaim, prizeClaimError]);

  const categories = useMemo(() => {
    if (!categoriesData || !categoriesData.data) return [];
    return categoriesData.data.records.map(
      (item: { uuid: string; name: string }) => ({
        value: item.uuid,
        label: item.name,
      })
    );
  }, [categoriesData]);

  const form = useForm({
    mode: "controlled",
    validateInputOnBlur: false,
    validateInputOnChange: false,

    initialValues: {
      // Customer details
      customer_uuid: "",
      customer_firstname: "",
      customer_lastname: "",
      customer_email: "",
      customer_phone: "",
      
      // Game/Ticket details
      game_uuid: "",
      game_name: "",
      game_category: "",
      ticket_number: "",
      draw_index: "",
      
      // Prize details
      prize_won: "",
      prize_uuid: "",
      
      // Claim information
      claim_officer: "",
      short_description: "",
      evidence: "",
      
      // Documents
      documents: "",
      
      // Winner story
      winner_story: "",
    },

    validate: {},
  });

  // Populate form with API data
  useEffect(() => {
    if (prizeClaimResponse?.data?.winner) {
      const winner = prizeClaimResponse.data.winner;
      const customer = winner.customer || {};
      
      form.setValues({
        customer_uuid: customer.uuid || "",
        customer_firstname: customer.firstname || "",
        customer_lastname: customer.lastname || "",
        customer_email: customer.email || "",
        customer_phone: customer.phone_number || "",
        game_uuid: winner.game_name || "", // Using game_name as identifier
        game_name: winner.game_name || "",
        game_category: winner.game_category || "",
        ticket_number: winner.ticket_number || "",
        draw_index: winner.draw_index || "",
        prize_won: winner.prize_won || "",
        prize_uuid: winner.uuid || "",
        claim_officer: winner.claim_officer || "",
        short_description: winner.short_description || "",
        evidence: winner.evidence || "",
        documents: "",
        winner_story: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeClaimResponse]);

  const nextStep = () => {
    setActive((current) =>
      current < stepsLayout.length - 1 ? current + 1 : current
    );
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    console.log("submitting");
    setAlertModalOpen(true);
  };

  function manageClaims() {
    setSuccessModalOpen(false);
    navigate("/admin/prize-claims");
  }

  async function handleCreateRaffle() {
    console.log("Claim form values:", form.values);
    // TODO: Implement actual submission logic
    try {
      notifications.show({
        title: "Prize Claim Successful",
        message: "Claim has been processed successfully",
        color: "green",
      });
      setAlertModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Prize Claim Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const stepsLayout = useMemo(() => {
    return [
      {
        label: "Customer Details",
        description: "Enter customer details for prize claim",
        Component: CustomerForm, // component reference
        props: { categories },
      },
      {
        label: "Claim Information",
        description: "Enter raffle claim verifiable details",
        Component: ClaimInformation,
        props: {},
      },
      {
        label: `Document upload`,
        description: `Upload Supporting document for prize claims`,
        Component: DocumentUpload,
        props: {},
      },
      {
        label: "Exclusive Winner Story",
        description: "Enter winner's story here",
        Component: WinnerStory,
        props: {},
      },
    ];
  }, [categories]);

  const ActiveStep = stepsLayout[active].Component;
  const activeStepProps = stepsLayout[active].props || {};

  if (isLoadingPrizeClaim) {
    return (
      <div className="text-primary-text px-6 md:px-10 pb-10">
        <Card className="bg-white !border-b !p-0 !border-b-gray-200">
          <div className="px-6 md:px-10 py-1">
            <DynamicBreadcrumbs items={breadCrumbs} />
          </div>
        </Card>
        <div className="text-center py-20">
          <Text className="!text-secondary-text">Loading prize claim data...</Text>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="pb-5">
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
                Claim a Prize
              </Title>
              <Text className="!text-secondary-text">
                Create a prize claim process for this raffle winner / customer 
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <Container
        className="text-primary-text !mx-auto w-full md:w-2/3 lg:w-[70%]"
        mt="lg"
      >
        <Stepper
          allowNextStepsSelect={false}
          active={active}
          onStepClick={setActive}
          className="capitalize"
          size="xs"
          icon={<FaCheck className="text-secondary-red" />}
          styles={{
            stepBody: { display: "none" },
            step: { padding: 0 },
            stepIcon: { color: "white" },
            separator: { marginLeft: -2, marginRight: -2, height: 4 },
          }}
        >
          {stepsLayout.map((step) => (
            <Stepper.Step
              key={step.label}
              label={step.label}
              allowStepClick={false}
            />
          ))}
        </Stepper>

        <Card withBorder mt="xl" radius="md">
          <Layout
            // remove the key here — mounting/unmounting can be controlled separately.
            description={stepsLayout[active].description}
            label={stepsLayout[active].label}
            className="block"
          >
            <ActiveStep
              form={form}
              {...activeStepProps}
              categories={categories}
            />
          </Layout>
        </Card>

        {/* Footer Buttons */}
        <Flex
          justify="flex-end"
          gap={20}
          className="!bg-white !rounded-xl !border !border-gray-200 !p-6 mt-10 !mb-10"
        >
          {active > 0 && (
            <Button
              size="lg"
              onClick={prevStep}
              variant="default"
              leftSection={<BsChevronLeft />}
            >
              Back
            </Button>
          )}

          {active < stepsLayout.length - 1 ? (
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              onClick={nextStep}
              rightSection={<BsChevronRight />}
            >
              Continue
            </CustomButton>
          ) : (
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              buttonType="submit"
            >
              Create Claim
            </CustomButton>
          )}
        </Flex>
      </Container>
      <AdminAlertModal
        opened={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        status="error"
        title={<span>Create New Raffle Game ?</span>}
        description={
          <span className="text-center">
            Are you sure you want to complete and create a prize claim process
            for this raffle winner vis-a-vis prize won in a raffle ? <br />
            <br /> Kindly note that this implies that the designated raffle
            prize has been issued to the customer / raffle winner. <br />
            <br /> Additionally, changes cannot be made to this prize claim
            process as soon as it posted hence synced into the system.
          </span>
        }
        primaryButton={{
          label: "Yes, Create and Complete Prize Claim",
          onClick: handleCreateRaffle,
          loading: createMutation.isPending,
          disabled: createMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setAlertModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={manageClaims}
        status="success"
        title="Prize Claim Completed"
        description="Prize Claim has been successfully submitted"
        secondaryButton={{
          label: "Close",
          onClick: manageClaims,
        }}
      />
    </form>
  );
}

export default ProcessClaim;
