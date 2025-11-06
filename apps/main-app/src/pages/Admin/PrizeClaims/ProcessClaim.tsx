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
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../CreateRaffle/Layout";
import CustomerForm from "./CustomerForm";
import ClaimInformation from "./ClaimInformation";
import DocumentUpload from "./DocumentUpload";
import WinnerStory from "./WinnerStory";
import LoadingState from "../../../components/LoadingState";

const breadCrumbs: Crumb[] = [
  { label: "Prize Claim", to: "/admin/prize-claims" },
  { label: "Claim a Prize" },
];

interface DocumentChecklistItem {
  name: string;
  description?: string;
  document: string; // base64 or URL
}

function ProcessClaim() {
  const { id } = useParams();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [processClaimSuccessModalOpen, setProcessClaimSuccessModalOpen] = useState(false);
  const [testimonialSuccessModalOpen, setTestimonialSuccessModalOpen] = useState(false);
  const [testimonialConfirmModalOpen, setTestimonialConfirmModalOpen] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [claimStatus, setClaimStatus] = useState<'claimed' | 'unclaimed'>('unclaimed');
  
  // Fetch prize claim data
  const {
    data: prizeClaimResponse,
    isLoading: isLoadingPrizeClaim,
    isError: isErrorPrizeClaim,
    error: prizeClaimError,
  } = useFetchData(
    id ? `admin/prize-claim-management/show/${id}` : null
  );

  // API mutations - use empty string if id not available, mutation won't run
  const processClaimMutation = usePutData(
    id ? `admin/prize-claim-management/process-claim/${id}` : "admin/prize-claim-management/process-claim/temp"
  );
  const uploadTestimonialMutation = usePutData(
    id ? `admin/prize-claim-management/record-testimonial/${id}` : "admin/prize-claim-management/record-testimonial/temp"
  );

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

  const form = useForm({
    mode: "controlled",
    validateInputOnBlur: false,
    validateInputOnChange: false,

    initialValues: {
      // Customer details (read-only)
      customer_uuid: "",
      customer_firstname: "",
      customer_lastname: "",
      customer_email: "",
      customer_phone: "",
      
      // Game/Ticket details (read-only)
      game_uuid: "",
      game_name: "",
      game_category: "",
      ticket_number: "",
      draw_index: "",
      
      // Prize details (read-only)
      prize_won: "",
      prize_uuid: "",
      
      // Claim information
      claim_officer: "",
      short_description: "",
      
      // Documents - Process Claim API payload
      document_checklist: [] as DocumentChecklistItem[],
      
      // Testimonial - Upload Testimonial API payload
      testimonial_short_description: "",
      testimonial: "",
      media: [] as string[], // array of base64 strings or URLs
      video_url: "",
    },

    validate: {
      short_description: (value) => {
        if (!value?.trim()) {
          return "Short description is required";
        }
        return null;
      },
      document_checklist: (value) => {
        if (!value || value.length === 0) {
          return null; // Allow empty, but individual items validated separately
        }
        for (let i = 0; i < value.length; i++) {
          const item = value[i] as DocumentChecklistItem;
          if (!item.name?.trim()) {
            return `Document ${i + 1}: Name is required`;
          }
          if (!item.document?.trim()) {
            return `Document ${i + 1}: Document upload is required`;
          }
        }
        return null;
      },
      testimonial_short_description: (value) => {
        if (!value?.trim()) {
          return "Testimonial short description is required";
        }
        return null;
      },
      testimonial: (value) => {
        if (!value?.trim()) {
          return "Testimonial is required";
        }
        return null;
      },
      media: (value) => {
        if (!value || value.length === 0) {
          return "At least one image upload is required";
        }
        return null;
      },
    },
  });

  // Populate form with API data
  useEffect(() => {
    setClaimStatus(prizeClaimResponse?.data?.winner?.status || 'unclaimed');
    if (prizeClaimResponse?.data?.winner) {
      const winner = prizeClaimResponse.data.winner;
      const customer = winner.customer || {};
      const claimOfficer = winner.claim_officer;
      
      // Map document_checklist from API response
      const documentChecklist: DocumentChecklistItem[] = 
        Array.isArray(winner.document_checklist)
          ? winner.document_checklist.map((doc: { name: string; description?: string; path?: string }) => ({
              name: doc.name || "",
              description: doc.description || "",
              document: doc.path || "",
            }))
          : [];

          console.log(documentChecklist);
      form.setValues({
        customer_uuid: customer.uuid || "",
        customer_firstname: customer.firstname || "",
        customer_lastname: customer.lastname || "",
        customer_email: customer.email || "",
        customer_phone: customer.phone_number || "",
        game_uuid: winner.game_name || "",
        game_name: winner.game_name || "",
        game_category: winner.game_category || "",
        ticket_number: winner.ticket_number || "",
        draw_index: winner.draw_index || "",
        prize_won: winner.prize_won || "",
        prize_uuid: winner.uuid || "",
        claim_officer: claimOfficer?.name || "",
        short_description: winner.short_description || "",
        document_checklist: documentChecklist,
        testimonial_short_description: winner.testimonial_short_description || "",
        testimonial: winner.testimonial || "",
        media: Array.isArray(winner.media) ? winner.media : [],
        video_url: winner.video_url || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeClaimResponse]);

  const validateCurrentStep = () => {
    if (active === 1) {
      // Validate step 1: short_description and document_checklist
      form.validateField("short_description");
      form.validateField("document_checklist");
      return !form.errors.short_description && !form.errors.document_checklist;
    } else if (active === 2) {
      // Validate step 2: testimonial fields
      form.validateField("testimonial_short_description");
      form.validateField("testimonial");
      return !form.errors.testimonial_short_description && !form.errors.testimonial;
    } else if (active === 3) {
      // Validate step 3: media
      form.validateField("media");
      return !form.errors.media;
    }
    return true; // Step 0 has no validation
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    setActive((current) =>
      current < stepsLayout.length - 1 ? current + 1 : current
    );
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleCompleteClaim = () => {
    // Validate steps 0 and 1
    form.validateField("short_description");
    form.validateField("document_checklist");
    
    if (form.errors.short_description || form.errors.document_checklist) {
      return;
    }
    
    setAlertModalOpen(true);
  };

  const handlePublishStory = () => {
    // Validate steps 2 and 3
    form.validateField("testimonial_short_description");
    form.validateField("testimonial");
    form.validateField("media");
    
    if (form.errors.testimonial_short_description || form.errors.testimonial || form.errors.media) {
      return;
    }
    
    setTestimonialConfirmModalOpen(true);
  };

  async function handleProcessClaim() {
    if (!id) {
      notifications.show({
        title: "Error",
        message: "Claim ID is missing",
        color: "var(--color-primary-red)",
      });
      return;
    }

    const payload = {
      document_checklist: form.values.document_checklist.map((item: DocumentChecklistItem) => ({
        name: item.name,
        description: item.description || "",
        document: item.document,
      })),
      short_description: form.values.short_description,
    };

    try {
      const response = await processClaimMutation.mutateAsync(payload);
      notifications.show({
        title: "Prize Claim Successful",
        message: response?.message || "Claim has been processed successfully",
        color: "green",
      });
      setAlertModalOpen(false);
      setProcessClaimSuccessModalOpen(true);
      setClaimStatus(response?.data?.winner?.status || 'unclaimed');
    } catch (error) {
      notifications.show({
        title: "Prize Claim Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function handleUploadTestimonial() {
    if (!id) {
      notifications.show({
        title: "Error",
        message: "Claim ID is missing",
        color: "var(--color-primary-red)",
      });
      return;
    }

    const payload = {
      testimonial_short_description: form.values.testimonial_short_description,
      testimonial: form.values.testimonial,
      media: form.values.media,
      video_url: form.values.video_url || "",
    };

    try {
      const response = await uploadTestimonialMutation.mutateAsync(payload);
      notifications.show({
        title: "Testimonial Uploaded Successfully",
        message: response?.message || "Testimonial has been uploaded successfully",
        color: "green",
      });
      setTestimonialConfirmModalOpen(false);
      setTestimonialSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Testimonial Upload Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  function handleProcessClaimSuccess() {
    setProcessClaimSuccessModalOpen(false);
    setActive(2); // Move to step 2 (testimonial)
  }

  function handleTestimonialSuccess() {
    setTestimonialSuccessModalOpen(false);
    navigate("/admin/prize-claims");
  }

  const isClaimed = claimStatus === 'claimed';

  const stepsLayout = useMemo(() => {
    return [
      {
        label: "Customer Details",
        description: "Enter customer details for prize claim",
        Component: CustomerForm, // component reference
      },
      {
        label: `Document upload`,
        description: `Upload Supporting document for prize claims`,
        Component: DocumentUpload,
        props: { isClaimed },
      },
      {
        label: "Exclusive Winner Story",
        description: "Enter winner's story here",
        Component: WinnerStory,
        props: {},
      },
      {
        label: "Winners Details",
        description: "Enter winners media details for this Prize.",
        Component: ClaimInformation,
        props: {},
      },
    ];
  }, [isClaimed]);

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
        <LoadingState 
          title="Loading prize claim data..."
          description="Please wait while we fetch the claim information"
        />
      </div>
    );
  }

  return (
    <div className="pb-5">
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
                Process a prize claim for this raffle winner / customer.
              </Text>
            </div>
            
            {active === 1 && (
              <CustomButton
                border={false}
                className="!rounded-lg"
                size="md"
                buttonType="button"
                onClick={handleCompleteClaim}
              >
                Complete Claim
              </CustomButton>
            )}
            
            {active === 3 && (
              <CustomButton
                border={false}
                className="!rounded-lg"
                size="md"
                buttonType="button"
                onClick={handlePublishStory}
              >
                Publish Story
              </CustomButton>
            )}
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
              isClaimed={isClaimed}
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
              disabled={!isClaimed && active === 1}
              onClick={nextStep}
              rightSection={<BsChevronRight />}
            >
              {active === 1 ? 'Add Winner Story' : 'Continue'}
            </CustomButton>
          ) : null}
        </Flex>
      </Container>
      {/* Process Claim Confirmation Modal */}
      <AdminAlertModal
        opened={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        status="error"
        title={<span>Create and Complete Prize Claim ?</span>}
        description={
          <span className="text-center">
            Are you sure you want to complete and create a prize claim process
            for this raffle winner vis-à-vis prize won in a raffle ? <br />
            <br /> Kindly note that this implies that the designated raffle
            prize will be issued to the customer / raffle winner after approval by the admin has been given.
          </span>
        }
        primaryButton={{
          label: "Yes, Create Prize Claim",
          onClick: handleProcessClaim,
          loading: processClaimMutation.isPending,
          disabled: processClaimMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setAlertModalOpen(false),
        }}
      />

      {/* Process Claim Success Modal */}
      <AdminAlertModal
        opened={processClaimSuccessModalOpen}
        onClose={handleProcessClaimSuccess}
        status="success"
        title="Prize Claim Completed"
        description="Prize Claim has been successfully processed"
        secondaryButton={{
          label: "Add Winner Story",
          onClick: handleProcessClaimSuccess,
        }}
      />

      {/* Upload Testimonial Confirmation Modal */}
      <AdminAlertModal
        opened={testimonialConfirmModalOpen}
        onClose={() => setTestimonialConfirmModalOpen(false)}
        status="error"
        title={<span>Publish Winner Story ?</span>}
        description={
          <span className="text-center">
            Are you sure you want to publish this winner story? This will make the testimonial and media publicly visible.
          </span>
        }
        primaryButton={{
          label: "Yes, Publish Story",
          onClick: handleUploadTestimonial,
          loading: uploadTestimonialMutation.isPending,
          disabled: uploadTestimonialMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setTestimonialConfirmModalOpen(false),
        }}
      />

      {/* Upload Testimonial Success Modal */}
      <AdminAlertModal
        opened={testimonialSuccessModalOpen}
        onClose={handleTestimonialSuccess}
        status="success"
        title="Testimonial Published"
        description="Winner story has been successfully published"
        secondaryButton={{
          label: "Continue",
          onClick: handleTestimonialSuccess,
        }}
      />
    </div>
  );
}

export default ProcessClaim;
