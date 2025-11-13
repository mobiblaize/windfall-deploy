import {
  Button,
  Card,
  Container,
  Flex,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import BasicInformation from "./BasicInformation";
import Layout from "./Layout";
import TicketPrice from "./TicketPrice";
import ContentMarketing from "./ContentMarketing";
import MediaContent from "./MediaContent";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { useForm } from "@mantine/form";
import {
  useFetchData,
  useGetData,
  usePostData,
} from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useLocation } from "react-router-dom";
import Prizes from "./Prizes";

function CreateRaffleLayout() {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on instant-raffles route
  const isInstantRaffleRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles");
  }, [location.pathname]);

  // Determine base route for relative navigation
  const baseRoute = useMemo(() => {
    return isInstantRaffleRoute ? "/admin/instant-raffles" : "/admin/raffles";
  }, [isInstantRaffleRoute]);

  // Build breadcrumbs dynamically
  const breadCrumbs: Crumb[] = useMemo(() => [
    { label: isInstantRaffleRoute ? "Instant Raffle Management" : "Raffle Management", to: baseRoute },
    { label: "Create a New Raffle", to: "" },
  ], [isInstantRaffleRoute, baseRoute]);
  const [active, setActive] = useState(0);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [lastCheckedName, setLastCheckedName] = useState<string>("");
  const validateNameMutation = useGetData(
    lastCheckedName
      ? `admin/game-management/check-name-exists?name=${encodeURIComponent(lastCheckedName)}`
      : ""
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
      // Basic Info
      name: "",
      description: "",
      long_description: "",
      category_id: "",
      cta_text: "",
      supporting_text: "",
      other_information: "",
      competition_details: "",
      sponsorship_details: "",

      // Ticket & Pricing
      total_tickets: 0,
      ticket_price: 0,
      percentage_markup: 0,
      prize_cost: 0,
      minimum_ticket_number_purchase: 1,
      maximum_ticket_number_purchase: 1,
      maximum_ticket_amount_purchase: 0,
      discount_type: "straight_line",
      discount_percentage: 0,

      // Schedule
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",

      // Flags
      allow_promo_code_usage: false,
      allow_referral_balance_usage: false,
      is_scheduled: false,
      is_active: true,
      status: "published",
      instant_game: true,

      // Referral limits
      minimum_referral_balance_amount: 0,
      maximum_referral_balance_amount: 0,

      // Media / documents
      documents: "",
      card_image: "",
      gallery_images: "",

      // Nested arrays
      tiers: [],
      prizes: [
        {
          name: "",
          quantity: 1,
          prize_cost: 0,
          image: "",
          description: "",
        },
      ],
    },

    validate: {
      name: (val) => (val.trim().length > 0 ? null : "Raffle name is required"),
      description: (val) =>
        val.trim().length > 0 ? null : "Short description required",
      category_id: (val) => (val ? null : "Category is required"),
      ticket_price: (val) =>
        val > 0 ? null : "Ticket price must be greater than zero",
      total_tickets: (val) =>
        val > 0 ? null : "Total Tickets must be greater than zero",
      prize_cost: (val) =>
        val > 0 ? null : "Prize cost must be greater than zero",
      minimum_ticket_number_purchase: (val) =>
        val > 0 ? null : "Minimum ticket number must be greater than zero",
      maximum_ticket_number_purchase: (val, values) => {
        if (Number(val) <= 0)
          return "Maximum ticket number must be greater than zero";
        if (Number(val) < Number(values.minimum_ticket_number_purchase))
          return "Maximum ticket number cannot be less than Minimum ticket number";
        return null;
      },
      minimum_referral_balance_amount: (val, values) => {
        if (!values.allow_referral_balance_usage) return null;
        if (val < 0) return "Minimum referral balance cannot be less than zero";
      },
      maximum_referral_balance_amount: (val, values) => {
        if (!values.allow_referral_balance_usage) return null;
        if (Number(val) <= 0)
          return "Maximum referral balance must be greater than zero";
        if (Number(val) < Number(values.minimum_referral_balance_amount))
          return "Maximum referral balance cannot be less than Minimum referral balance";
        return null;
      },
      percentage_markup: (val) =>
        val >= 0 ? null : "Markup cannot be negative",

      // ✅ CTA text: required + max 15 chars
      cta_text: (val) => {
        if (val.trim().length === 0) return "CTA text is required";
        if (val.trim().length > 15)
          return "CTA text cannot exceed 15 characters";
        return null;
      },

      // ✅ Start / End date validations
      start_date: (val) => {
        // if (!values.is_scheduled) return null;
        if (!val) return "Start date required";
        return null;
      },
      end_date: (val, values) => {
        // if (!values.is_scheduled) return null;
        if (!val) return "End date required";
        if (values.start_date) {
          const start = new Date(values.start_date);
          const end = new Date(val);
          if (end < start) return "End date cannot be before start date";
        }
        return null;
      },
      start_time: (val) => {
        // if (!values.is_scheduled) return null;
        if (!val) return "Start time required";
        return null;
      },
      end_time: (val, values) => {
        // if (!values.is_scheduled) return null;
        if (!val) return "End time required";
        if (!values.start_date || !values.end_date || !values.start_time)
          return null;
        const startDateTime = new Date(
          `${values.start_date}T${values.start_time}`
        );
        const endDateTime = new Date(`${values.end_date}T${val}`);
        if (endDateTime < startDateTime)
          return "End time cannot be before start time";
        return null;
      },

      competition_details: (val) =>
        val.trim().length > 0 ? null : "Competition details are required",
      sponsorship_details: (val) =>
        val.trim().length > 0 ? null : "Sponsorship details are required",

      // ✅ New validations for media content
      card_image: (val) =>
        val && val.trim().length > 0 ? null : "Card image is required",
      gallery_images: (val) =>
        val && val.trim().length > 0
          ? null
          : "At least one gallery image is required",

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prizes: (prizes: any[], values) => {
        if (!prizes || prizes.length === 0)
          return "At least one prize item is required";

        // 🧩 New Rule: Scheduled raffles can only have one prize
        if (values.is_scheduled && prizes.length > 1) {
          return "Scheduled raffles can only have one prize";
        }

        for (let i = 0; i < prizes.length; i++) {
          const prize = prizes[i];
          if (!prize.name?.trim()) return `Prize ${i + 1}: Name is required`;
          if (Number(prize.prize_cost) <= 0)
            return `Prize ${i + 1}: Prize cost must be greater than zero`;
          if (Number(prize.quantity) <= 0)
            return `Prize ${i + 1}: Prize units must be greater than zero`;
          if (!prize.image?.trim()) return `Prize ${i + 1}: Image is required`;
        }

        return null;
      },

      // 🧩 Discount tiers validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tiers: (tiers: any[], values) => {
        if (!tiers || tiers.length === 0) return null;

        for (let i = 0; i < tiers.length; i++) {
          const tier = tiers[i];
          if (!tier.name?.trim()) 
            return `Discount Tier ${i + 1}: Please provide a name for this tier`;
          if (Number(tier.discount_percentage) <= 0)
            return `Discount Tier ${i + 1} ("${tier.name}"): Discount percentage must be greater than 0%`;
          if (Number(tier.discount_percentage) > 100)
            return `Discount Tier ${i + 1} ("${tier.name}"): Discount percentage cannot exceed 100%`;
          if (Number(tier.number_of_entry_start) <= 0)
            return `Discount Tier ${i + 1} ("${tier.name}"): Minimum ticket range must start from at least 1`;
          if (Number(tier.number_of_entry_end) <= 0)
            return `Discount Tier ${i + 1} ("${tier.name}"): Maximum ticket range must be greater than 0`;
          if (
            Number(tier.number_of_entry_start) >=
            Number(tier.number_of_entry_end)
          )
            return `Discount Tier ${i + 1} ("${tier.name}"): Minimum range (${tier.number_of_entry_start}) must be less than maximum range (${tier.number_of_entry_end})`;
        }

        const sorted = [...tiers].sort(
          (a, b) =>
            Number(a.number_of_entry_start) - Number(b.number_of_entry_start)
        );

        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i];
          const next = sorted[i + 1];
          if (
            Number(current.number_of_entry_end) >=
            Number(next.number_of_entry_start)
          ) {
            return `Discount tier ranges overlap: "${current.name}" (${current.number_of_entry_start}-${current.number_of_entry_end}) overlaps with "${next.name}" (${next.number_of_entry_start}-${next.number_of_entry_end}). Please ensure each tier has a unique, non-overlapping range.`;
          }
        }

        // ✅ NEW VALIDATION: min tier cannot be less than minimum_ticket_number_purchase
        const minTierStart = Math.min(
          ...tiers.map((t) => Number(t.number_of_entry_start))
        );

        if (minTierStart < Number(values.minimum_ticket_number_purchase)) {
          return `Discount tier validation error: The lowest tier's starting range (${minTierStart}) cannot be less than the minimum tickets per purchase setting (${values.minimum_ticket_number_purchase}). Please adjust your tier ranges or minimum purchase settings.`;
        }

        // ✅ NEW VALIDATION: max tier cannot exceed maximum_ticket_number_purchase
        const maxTierEnd = Math.max(
          ...tiers.map((t) => Number(t.number_of_entry_end))
        );

        if (maxTierEnd > Number(values.maximum_ticket_number_purchase)) {
          return `Discount tier validation error: The highest tier's ending range (${maxTierEnd}) exceeds the maximum tickets per purchase setting (${values.maximum_ticket_number_purchase}). Please adjust your tier ranges or maximum purchase settings.`;
        }

        return null;
      },
    },
  });

  const checkNameExists = useCallback(async (name: string) => {
    setIsCheckingName(true);
    setLastCheckedName(name);
    try {
      const resp = await validateNameMutation.mutateAsync();
      // Adjust this logic depending on your actual API result shape
      if (resp?.data?.exists) {
        form.setFieldError("name", "Game name already exists");
        setIsCheckingName(false);
        return false;
      } else {
        return true;
      }
    } catch {
      form.setFieldError("name", "Failed to check name uniqueness");
      setIsCheckingName(false);
      return false;
    } finally {
      setIsCheckingName(false);
    }
  }, [form, validateNameMutation]);

  // Step-wise field validation map (memoized to prevent recreating on every render)
  const stepFieldMap: Record<number, string[]> = useMemo(() => ({
    0: [
      "name",
      "description",
      "category_id",
      "cta_text",
      "start_date",
      "end_date",
      "start_time",
      "end_time",
      "maximum_referral_balance_amount",
      "minimum_referral_balance_amount",
    ],
    1: [
      "ticket_price",
      "total_tickets",
      "percentage_markup",
      "prize_cost",
      "minimum_ticket_number_purchase",
      "maximum_ticket_number_purchase",
      "tiers",
    ],
    2: ["prizes"],
    3: ["competition_details", "sponsorship_details"],
    4: ["card_image", "gallery_images"],
  }), []);

  const stepsLayout = useMemo(() => {
    return [
      {
        label: "basic information",
        description: "enter raffle basic detail below",
        Component: BasicInformation, // component reference
        props: { categories },
      },
      {
        label: "ticket price & discount",
        description: "set ticket price and discount",
        Component: TicketPrice,
        props: {},
      },
      {
        label: "Game Prizes",
        description: "Add prize to be won for this game",
        Component: Prizes,
        props: {},
      },
      {
        label: "content marketing",
        description: "Enter other content ...",
        Component: ContentMarketing,
        props: {},
      },
      {
        label: "media content",
        description: "Set game banner ...",
        Component: MediaContent,
        props: {},
      },
    ];
  }, [categories]);

  // const validateStep = (stepIndex: number) => {
  //   const fields = stepFieldMap[stepIndex];
  //   return !fields.map((f) => form.validateField(f).hasError).some((x) => x);
  // };

  const validateStep = useCallback(async (stepIndex: number) => {
    const fields = stepFieldMap[stepIndex];
    // Validate fields synchronously first
    const localValid = !fields
      .map((f) => form.validateField(f).hasError)
      .some((x) => x);

    let nameCheckValid = true;
    if (stepIndex === 0 && localValid) {
      // Async check for name uniqueness
      nameCheckValid = await checkNameExists(form.getValues().name);
    }

    return localValid && (stepIndex !== 0 || nameCheckValid);
  }, [form, checkNameExists, stepFieldMap]);

  const nextStep = useCallback(async () => {
    setIsCheckingName(true); // show loading early
    const isStepValid = await validateStep(active);
    setIsCheckingName(false);
    if (!isStepValid) return;
    setActive((current) =>
      current < stepsLayout.length - 1 ? current + 1 : current
    );
  }, [active, validateStep, stepsLayout.length]);

  const prevStep = useCallback(() =>
    setActive((current) => (current > 0 ? current - 1 : current)), []);

  // REWRITE: Make handleSubmit async, check name uniqueness, show notification on errors.
  const handleSubmit = useCallback(async () => {
    // Run all validation, plus name uniqueness

    const result = form.validate();

    let hasErrors = result.hasErrors;

    let nameValid = true;

    if (!hasErrors) {
      // Still check the name uniqueness for final
      setIsCheckingName(true);
      nameValid = await checkNameExists(form.getValues().name);
      setIsCheckingName(false);
      if (!nameValid) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      notifications.show({
        title: "Form Error",
        message:
          "Some fields are invalid or missing. Please check the form for errors.",
        color: "var(--color-primary-red)",
      });
      return;
    }

    setAlertModalOpen(true);
  }, [form, checkNameExists]);

  const manageRaffles = useCallback(() => {
    setSuccessModalOpen(false);
    navigate(baseRoute);
  }, [navigate, baseRoute]);

  const handleCreateRaffle = useCallback(async () => {
    // Build final payload structure
    const values = form.getValues();
    const payload = {
      name: values.name,
      instant_game: String(!values.is_scheduled),
      total_tickets: Number(values.total_tickets),
      ticket_price: Number(values.ticket_price),
      description: values.description,
      long_description: values.long_description,
      category_id: values.category_id,
      minimum_ticket_number_purchase: Number(
        values.minimum_ticket_number_purchase
      ),
      maximum_ticket_number_purchase: Number(
        values.maximum_ticket_number_purchase
      ),
      maximum_ticket_amount_purchase: Number(
        values.maximum_ticket_amount_purchase
      ),
      percentage_markup: Number(values.percentage_markup),
      discount_type: values.discount_type,
      discount_percentage: Number(values.discount_percentage),
      tiers: values.tiers,
      prizes: values.prizes, // ✅ Include prizes array
      is_scheduled: String(values.is_scheduled),
      start_date: values.start_date,
      end_date: values.end_date,
      start_time: values.start_time,
      end_time: values.end_time,
      cta_text: values.cta_text,
      status: values.status,
      allow_promo_code_usage: String(values.allow_promo_code_usage),
      allow_referral_balance_usage: String(
        values.allow_referral_balance_usage
      ),
      minimum_referral_balance_amount: Number(
        values.minimum_referral_balance_amount
      ),
      maximum_referral_balance_amount: Number(
        values.maximum_referral_balance_amount
      ),
      supporting_text: values.supporting_text,
      competition_details: values.competition_details,
      sponsorship_details: values.sponsorship_details,
      other_information: values.other_information,
      documents: values.documents,
      card_image: values.card_image,
      gallery_images: values.gallery_images,
      is_active: String(values.is_active),
    };

    try {
      const response = await createMutation.mutateAsync(payload);
      notifications.show({
        title: "Game Creation Successful",
        message: response?.message || "Game created successfully",
        color: "green",
      });
      setAlertModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Game Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }, [form, createMutation]);

  const ActiveStep = useMemo(() => stepsLayout[active].Component, [stepsLayout, active]);
  const activeStepProps = useMemo(() => stepsLayout[active].props || {}, [stepsLayout, active]);

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
                Create a raffle
              </Title>
              <Text className="!text-secondary-text">
                Create new raffle game in simple step
              </Text>
            </div>
            <Flex gap={15}>
              <CustomButton
                border={false}
                className="!rounded-lg"
                size="md"
                buttonType="submit"
                loading={isCheckingName}
                disabled={isCheckingName}
                rightSection={
                  <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                    <BsPlus className="!text-xl !text-white" />
                  </div>
                }
              >
                Create New Raffle
              </CustomButton>
            </Flex>
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

          {active < stepsLayout.length - 1 && (
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              onClick={nextStep}
              rightSection={<BsChevronRight />}
              loading={isCheckingName}
              disabled={isCheckingName}
            >
              Continue
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
          <span>
            Are you sure, you want to create a new raffle draw/game? Kindly note
            that this game would go live now and customer would be able to view
            raffle details and buy raffle ticket accordingly.
          </span>
        }
        primaryButton={{
          label: "Yes, Create Raffle Game",
          onClick: handleCreateRaffle,
          loading: createMutation.isPending,
          disabled: createMutation.isPending,
        }}
        secondaryButton={{
          label: "No, Close",
          onClick: () => setAlertModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={manageRaffles}
        status="success"
        title="Raffle Created"
        description="Congratulation, you have successfully Created a New Raffle Game / Draw"
        secondaryButton={{
          label: "Close",
          onClick: manageRaffles,
        }}
      />
    </form>
  );
}

export default CreateRaffleLayout;
