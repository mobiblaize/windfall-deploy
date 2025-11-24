import {
  Button,
  Card,
  Container,
  Flex,
  Skeleton,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { TakeAction, type ActionItem } from "../../../components/TakeAction";
import CommentsModal from "../../../components/CommentsModal";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import type { ApprovalStatus } from "../../../utils/models/approval";
import { useApprovalProcess } from "../../../utils/hooks/useApprovalProcess";
import ApprovalOfficersTooltip from "../../../components/ApprovalOfficersTooltip";
import CustomBadge from "../../../components/CustomBadge";
import getApprovalStatusInfo from "../../../utils/helper/getStatusInfo";

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
  const [processClaimSuccessModalOpen, setProcessClaimSuccessModalOpen] =
    useState(false);
  const [testimonialSuccessModalOpen, setTestimonialSuccessModalOpen] =
    useState(false);
  const [testimonialConfirmModalOpen, setTestimonialConfirmModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [claimStatus, setClaimStatus] = useState<"claimed" | "unclaimed">(
    "unclaimed"
  );
  const [approvalAction, setApprovalAction] =
    useState<ApprovalStatus>("approved");
  const [approvePrizeClaimModalOpen, setApprovePrizeClaimModalOpen] =
    useState(false);
  const [approvalConfirmationModalOpen, setApprovalConfirmationModalOpen] =
    useState(false);
  const [approvalSuccessModalOpen, setApprovalSuccessModalOpen] =
    useState(false);
  const { canApprovePrizeClaim } = usePermissions();

  const isApprove = approvalAction === "approved";

  // Fetch prize claim data
  const {
    data: prizeClaimResponse,
    isLoading: isLoadingPrizeClaim,
    isError: isErrorPrizeClaim,
    refetch: refetchPrizeClaim,
    error: prizeClaimError,
  } = useFetchData(id ? `admin/prize-claim-management/show/${id}` : null);

  // API mutations - use empty string if id not available, mutation won't run
  const processClaimMutation = usePutData(
    id
      ? `admin/prize-claim-management/process-claim/${id}`
      : "admin/prize-claim-management/process-claim/temp"
  );
  const uploadTestimonialMutation = usePutData(
    id
      ? `admin/prize-claim-management/record-testimonial/${id}`
      : "admin/prize-claim-management/record-testimonial/temp"
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
    clearInputErrorOnChange: true,

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
          return "Testimonial summary is required";
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

  // Step-wise field validation map (memoized to prevent recreating on every render)
  const stepFieldMap: Record<number, string[]> = useMemo(
    () => ({
      0: [], // Step 0: Customer Details - no validation needed (read-only)
      1: ["short_description", "document_checklist"], // Step 1: Document Upload
      2: ["testimonial_short_description", "testimonial"], // Step 2: Winner Story
      3: ["media"], // Step 3: Media Upload
    }),
    []
  );

  // Clear errors when step changes
  useEffect(() => {
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Populate form with API data - memoize to prevent unnecessary re-renders
  const formInitialData = useMemo(() => {
    if (!prizeClaimResponse?.data?.winner) return null;

    const winner = prizeClaimResponse.data.winner;
    const customer = winner.customer || {};
    const claimOfficer = winner.claim_officer;

    // Map document_checklist from API response
    const documentChecklist: DocumentChecklistItem[] = Array.isArray(
      winner.document_checklist
    )
      ? winner.document_checklist.map(
          (doc: { name: string; description?: string; path?: string }) => ({
            name: doc.name || "",
            description: doc.description || "",
            document: doc.path || "",
          })
        )
      : [];

    return {
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
    };
  }, [prizeClaimResponse]);

  // Populate form with API data
  useEffect(() => {
    if (formInitialData) {
      setClaimStatus(prizeClaimResponse?.data?.winner?.status || "unclaimed");
      form.setValues(formInitialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInitialData]);

  const validateCurrentStep = useCallback(() => {
    const fields = stepFieldMap[active];

    // Step 0: Customer Details - no validation needed (read-only)
    if (active === 0) {
      return true;
    }

    // Validate fields for current step using validateField
    const hasErrors = fields
      .map((f) => form.validateField(f).hasError)
      .some((x) => x);

    return !hasErrors;
  }, [active, form, stepFieldMap]);

  const nextStep = useCallback(() => {
    // Clear previous errors first
    form.clearErrors();

    // Validate current step
    const isValid = validateCurrentStep();

    if (!isValid) {
      // Show validation error notification - get first error from current step fields
      const fields = stepFieldMap[active];
      for (const field of fields) {
        const fieldValidation = form.validateField(field);
        if (fieldValidation.hasError) {
          notifications.show({
            title: "Validation Error",
            message:
              fieldValidation.error || "Please fill in all required fields",
            color: "var(--color-primary-red)",
          });
          break;
        }
      }
      return;
    }

    // Clear errors before moving to next step
    form.clearErrors();
    setActive(
      (current) => (current < 3 ? current + 1 : current) // Total of 4 steps (0-3)
    );
  }, [active, form, stepFieldMap, validateCurrentStep]);

  const prevStep = useCallback(() => {
    // Clear validation errors when going back
    form.clearErrors();
    setActive((current) => (current > 0 ? current - 1 : current));
  }, [form]);

  const handleCompleteClaim = useCallback(() => {
    // Clear previous errors first
    form.clearErrors();

    // Validate steps 0 and 1 fields (steps 0-1 for Process Claim section)
    const step0Fields = stepFieldMap[0];
    const step1Fields = stepFieldMap[1];
    const allFields = [...step0Fields, ...step1Fields];

    // Validate all fields for steps 0 and 1
    const hasErrors = allFields
      .map((f) => form.validateField(f).hasError)
      .some((x) => x);

    if (hasErrors) {
      // Show first validation error
      for (const field of allFields) {
        const fieldValidation = form.validateField(field);
        if (fieldValidation.hasError) {
          notifications.show({
            title: "Validation Error",
            message:
              fieldValidation.error || "Please fill in all required fields",
            color: "var(--color-primary-red)",
          });
          break;
        }
      }
      return;
    }

    setAlertModalOpen(true);
  }, [form, stepFieldMap]);

  const handlePublishStory = useCallback(() => {
    // Clear previous errors first
    form.clearErrors();

    // Validate steps 2 and 3 - validate all testimonial and media fields
    const step2Fields = stepFieldMap[2];
    const step3Fields = stepFieldMap[3];
    const allFields = [...step2Fields, ...step3Fields];

    // Validate all fields for steps 2 and 3
    const hasErrors = allFields
      .map((f) => form.validateField(f).hasError)
      .some((x) => x);

    if (hasErrors) {
      // Show first validation error
      for (const field of allFields) {
        const fieldValidation = form.validateField(field);
        if (fieldValidation.hasError) {
          notifications.show({
            title: "Validation Error",
            message:
              fieldValidation.error || "Please fill in all required fields",
            color: "var(--color-primary-red)",
          });
          break;
        }
      }
      return;
    }

    setTestimonialConfirmModalOpen(true);
  }, [form, stepFieldMap]);

  const handleProcessClaim = useCallback(async () => {
    if (!id) {
      notifications.show({
        title: "Error",
        message: "Claim ID is missing",
        color: "var(--color-primary-red)",
      });
      return;
    }

    const payload = {
      document_checklist: form.values.document_checklist.map(
        (item: DocumentChecklistItem) => ({
          name: item.name,
          description: item.description || "",
          document: item.document,
        })
      ),
      short_description: form.values.short_description,
    };

    try {
      const response = await processClaimMutation.mutateAsync(payload);
      notifications.show({
        title: "Prize Claim Successful",
        message: response?.message || "Claim has been processed successfully",
        color: "green",
      });      
      refetchPrizeClaim();
      setAlertModalOpen(false);
      setProcessClaimSuccessModalOpen(true);
      setClaimStatus(response?.data?.winner?.status || "unclaimed");
    } catch (error) {
      notifications.show({
        title: "Prize Claim Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }, [id, form.values.document_checklist, form.values.short_description, processClaimMutation, refetchPrizeClaim]);

  const handleUploadTestimonial = useCallback(async () => {
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
        message:
          response?.message || "Testimonial has been uploaded successfully",
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
  }, [id, form, uploadTestimonialMutation]);

  const handleProcessClaimSuccess = useCallback(() => {
    setProcessClaimSuccessModalOpen(false);
    setActive(2); // Move to step 2 (testimonial)
  }, []);

  const handleProcessClaimSuccessClose = useCallback(() => {
    setProcessClaimSuccessModalOpen(false);
    navigate("/admin/prize-claims");
  }, [navigate]);

  const handleTestimonialSuccess = useCallback(() => {
    setTestimonialSuccessModalOpen(false);
    navigate("/admin/prize-claims");
  }, [navigate]);

  const isClaimed = useMemo(() => claimStatus !== "unclaimed", [claimStatus]);

  // Prize Claim Steps (0-1)
  const prizeClaimSteps = useMemo(() => {
    return [
      {
        label: "Customer Details",
        description: "Enter customer details for prize claim",
        Component: CustomerForm,
      },
      {
        label: "Document Upload",
        description: "Upload supporting documents for prize claims",
        Component: DocumentUpload,
        props: { isClaimed },
      },
    ];
  }, [isClaimed]);

  // Winner Story Steps (2-3)
  const winnerStorySteps = useMemo(() => {
    return [
      {
        label: "Winner Story",
        description: "Enter winner's story here",
        Component: WinnerStory,
        props: {},
      },
      {
        label: "Media Upload",
        description: "Upload media for winner story",
        Component: ClaimInformation,
        props: {},
      },
    ];
  }, []);

  // Determine which section we're in - memoized to prevent recalculation
  const isPrizeClaimSection = useMemo(() => active < 2, [active]);
  const isWinnerStorySection = useMemo(() => active >= 2, [active]);

  // Get current step layout based on section
  const currentStepsLayout = useMemo(
    () => (isPrizeClaimSection ? prizeClaimSteps : winnerStorySteps),
    [isPrizeClaimSection, prizeClaimSteps, winnerStorySteps]
  );
  const currentStepIndex = useMemo(
    () => (isPrizeClaimSection ? active : active - 2),
    [isPrizeClaimSection, active]
  );

  const ActiveStep = useMemo(
    () => currentStepsLayout[currentStepIndex]?.Component,
    [currentStepsLayout, currentStepIndex]
  );
  const activeStepProps = useMemo(
    () => currentStepsLayout[currentStepIndex]?.props || {},
    [currentStepsLayout, currentStepIndex]
  );

  const { approveProcess, isPending: isApprovingProcess } = useApprovalProcess({
    onSuccess: () => {
      refetchPrizeClaim();
      setApprovePrizeClaimModalOpen(false);
      setApprovalSuccessModalOpen(true);
    },
  });

  const approvePrizeClaim = async (reason: string) => {
    await approveProcess({
      process_id:
        prizeClaimResponse?.data?.approval_workflows?.approver?.process_id,
      reason,
      status: approvalAction,
    });
  };

  const claimApprovalStatus = prizeClaimResponse?.data?.winner?.claim_approval_status;

  // Memoize action items based on raffle data
  const actionItems = useMemo<ActionItem[]>(() => {
    if (!id) return [];

    const items: ActionItem[] = [];

    const isPendingApproval = claimApprovalStatus === "pending";

    if (canApprovePrizeClaim && isPendingApproval && isClaimed) {
      items.push(
        {
          id: "approve-prize-claim",
          label: "Approve Prize Claim",
          description: "Approve this prize claim for the winner",
          onClick: () => initiateApproval("approved"),
          disabled: !canApprovePrizeClaim,
          color: "green",
          divider: true, // Add divider before this action
        },
        {
          id: "decline-prize-claim",
          label: "Reject Prize Claim",
          description: "Reject this prize claim for this player",
          onClick: () => initiateApproval("declined"),
          disabled: !canApprovePrizeClaim,
          color: "red",
          divider: true, // Add divider before this action
        }
      );
    }

    return items;
  }, [canApprovePrizeClaim, claimApprovalStatus, id, isClaimed]);

  const initiateApproval = (status: ApprovalStatus) => {
    setApprovalAction(status);
    setApprovalConfirmationModalOpen(true);
  };

  // Memoized back button handler
  const handleBackButton = useCallback(() => {
    if (isWinnerStorySection && currentStepIndex === 0) {
      // Go back to last step of Prize Claim section
      setActive(1);
    } else {
      prevStep();
    }
  }, [isWinnerStorySection, currentStepIndex, prevStep]);

  // Memoized handler for navigating to winner story
  const handleNavigateToWinnerStory = useCallback(() => {
    setActive(2);
  }, []);

  const approvalWorkflow = prizeClaimResponse?.data?.approval_workflows;
  const statusInfo = getApprovalStatusInfo(claimApprovalStatus)
  

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
                {isPrizeClaimSection ? "Claim a Prize" : "Winner Story"}
              </Title>
              <Text className="!text-secondary-text">
                {isPrizeClaimSection
                  ? "Process a prize claim for this raffle winner / customer."
                  : "Share the winner's story and upload media for their testimonial."}
              </Text>
            </div>

            {active === 1 && !isClaimed && (
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

            {isClaimed && active <= 1 && (
              <Flex align="center" wrap="wrap" gap={20} justify="end">
                {isLoadingPrizeClaim ? (
                  <Skeleton height={32} width={80} />
                ) : (
                  <ApprovalOfficersTooltip
                    officers={approvalWorkflow?.approval_processes ?? []}
                  >
                    <CustomBadge
                      status={statusInfo.status}
                      label={statusInfo.label}
                    />
                  </ApprovalOfficersTooltip>
                )}
                <TakeAction
                  actions={actionItems}
                  loading={isLoadingPrizeClaim}
                  disabled={isLoadingPrizeClaim}
                />
              </Flex>
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

      {isLoadingPrizeClaim ? (
        <LoadingState
          title="Loading prize claim data..."
          description="Please wait while we fetch the claim information"
        />
      ) : (
        <>
          <Container
            className="text-primary-text !mx-auto w-full md:w-2/3 lg:w-[70%]"
            mt="lg"
          >
            {/* Prize Claim Section */}
            {isPrizeClaimSection && (
              <Stepper
                allowNextStepsSelect={false}
                active={currentStepIndex}
                onStepClick={(step) => setActive(step)}
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
                {prizeClaimSteps.map((step) => (
                  <Stepper.Step
                    key={step.label}
                    label={step.label}
                    allowStepClick={false}
                  />
                ))}
              </Stepper>
            )}

            {/* Winner Story Section */}
            {isWinnerStorySection && (
              <Stepper
                allowNextStepsSelect={false}
                active={currentStepIndex}
                onStepClick={(step) => setActive(step + 2)}
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
                {winnerStorySteps.map((step) => (
                  <Stepper.Step
                    key={step.label}
                    label={step.label}
                    allowStepClick={false}
                  />
                ))}
              </Stepper>
            )}

            <Card withBorder mt="xl" radius="md">
              <Layout
                description={currentStepsLayout[currentStepIndex].description}
                label={currentStepsLayout[currentStepIndex].label}
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
              {/* Back button - show if not on first step of current section, or on first step of Winner Story to go back to Prize Claim */}
              {(currentStepIndex > 0 ||
                (isWinnerStorySection && currentStepIndex === 0)) && (
                <Button
                  size="lg"
                  onClick={handleBackButton}
                  variant="default"
                  leftSection={<BsChevronLeft />}
                >
                  Back
                </Button>
              )}

              {/* Continue/Next button */}
              {isPrizeClaimSection &&
                currentStepIndex < prizeClaimSteps.length - 1 && (
                  <CustomButton
                    size="lg"
                    border={false}
                    fullWidth={false}
                    disabled={!isClaimed && active === 1}
                    onClick={nextStep}
                    rightSection={<BsChevronRight />}
                  >
                    Continue
                  </CustomButton>
                )}

              {/* Add Winner Story button - show on step 1 of Prize Claim when isClaimed */}
              {isPrizeClaimSection && currentStepIndex === 1 && isClaimed && (
                <CustomButton
                  size="lg"
                  border={false}
                  fullWidth={false}
                  onClick={handleNavigateToWinnerStory}
                  rightSection={<BsChevronRight />}
                >
                  Edit Winner Story
                </CustomButton>
              )}

              {isWinnerStorySection &&
                currentStepIndex < winnerStorySteps.length - 1 && (
                  <CustomButton
                    size="lg"
                    border={false}
                    fullWidth={false}
                    onClick={nextStep}
                    rightSection={<BsChevronRight />}
                  >
                    Continue
                  </CustomButton>
                )}
            </Flex>
          </Container>
        </>
      )}

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
            prize will be issued to the customer / raffle winner after approval
            by the admin has been given.
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
        onClose={handleProcessClaimSuccessClose}
        status="success"
        title="Prize Claim Completed"
        description="Prize Claim has been successfully processed"
        primaryButton={{
          label: "Add Winner Story",
          onClick: handleProcessClaimSuccess,
        }}
        secondaryButton={{
          label: "Back to Prize Claims",
          onClick: handleProcessClaimSuccessClose,
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
            Are you sure you want to publish this winner story? This will make
            the testimonial and media publicly visible.
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

      <AdminAlertModal
        opened={approvalConfirmationModalOpen}
        onClose={() => setApprovalConfirmationModalOpen(false)}
        status="error"
        title={`${isApprove ? "Approve" : "Reject"} New Prize Claim ?`}
        description={`${isApprove ? "Are you sure you want to approve this new Prize Claim? Kindly note that this Prize Claim would go live now and customer would be able to apply in games accordingly." : "Are you sure you want to reject this new Prize Claim? Kindly note that this Prize Claim would not go live now."}`}
        primaryButton={{
          label: `${isApprove ? "Yes, Approve" : "Yes, Reject"} Prize Claim`,
          onClick: () => {
            setApprovalConfirmationModalOpen(false);
            setApprovePrizeClaimModalOpen(true);
          },
        }}
        secondaryButton={{
          label: "No, Close",
          onClick: () => setApprovalConfirmationModalOpen(false),
        }}
      />

      <CommentsModal
        modalOpen={approvePrizeClaimModalOpen}
        title={`${isApprove ? "Why Approve Prize Claim?" : "Why Reject Prize Claim? "}`}
        description={`${isApprove ? "Enter comment on prize Claim here" : "Provide a reason to why this prize Claim is rejected"}`}
        primaryButtonLabel={`${isApprove ? "Complete Prize Claim Approval" : "Complete Prize Claim Rejection"}`}
        label={`${isApprove ? "Comment here" : "Enter reason"}`}
        submitComment={approvePrizeClaim}
        isLoading={isApprovingProcess}
        closeModal={() => setApprovePrizeClaimModalOpen(false)}
      />

      <AdminAlertModal
        opened={approvalSuccessModalOpen}
        onClose={() => setApprovalSuccessModalOpen(false)}
        status="success"
        title={`Prize Claim ${isApprove ? "Approved" : "Rejected"}`}
        description={`${isApprove ? "Congratulations, you have successfully approved a New Prize Claim and posted it live" : "You have successfully rejected a New Prize Claim"}`}
        primaryButton={{
          label: "Manage Prize Claim",
          onClick: () => {
            setApprovalSuccessModalOpen(false);
            navigate(`/admin/prize-claims`, { replace: true });
          },
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setApprovalSuccessModalOpen(false),
        }}
      />
    </div>
  );
}

export default ProcessClaim;
