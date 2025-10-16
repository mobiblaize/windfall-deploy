import {
  Button,
  Card,
  Container,
  Flex,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
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
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";

const breadCrumbs: Crumb[] = [
  { label: "Raffle Management", to: "/admin/raffles" },
  { label: "Create a New Raffle", to: "/create-raffle" },
];

function CreateLayout() {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
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

  const categories = (() => {
    if (!categoriesData || !categoriesData.data) return [];
    return categoriesData.data?.records?.map(
      (item: { uuid: string; name: string }) => ({
        value: item.uuid,
        label: item.name,
      })
    );
  })();

  const form = useForm({
    mode: "uncontrolled",
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
      start_date: (val, values) => {
        if (!values.is_scheduled) return null;
        if (!val) return "Start date required";
        return null;
      },
      end_date: (val, values) => {
        if (!values.is_scheduled) return null;
        if (!val) return "End date required";
        if (values.start_date) {
          const start = new Date(values.start_date);
          const end = new Date(val);
          if (end < start) return "End date cannot be before start date";
        }
        return null;
      },
      start_time: (val, values) => {
        if (!values.is_scheduled) return null;
        if (!val) return "Start time required";
        return null;
      },
      end_time: (val, values) => {
        if (!values.is_scheduled) return null;
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

      // 🧩 Discount tiers validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tiers: (tiers: any[]) => {
        if (!tiers || tiers.length === 0) return null;

        for (let i = 0; i < tiers.length; i++) {
          const tier = tiers[i];
          if (!tier.name?.trim()) return `Tier ${i + 1}: Name is required`;
          if (tier.discount_percentage <= 0)
            return `Tier ${i + 1}: Discount percentage must be greater than zero`;
          if (Number(tier.number_of_entry_start) <= 0)
            return `Tier ${i + 1}: Minimum ticket range must be greater than zero`;
          if (Number(tier.number_of_entry_end) <= 0)
            return `Tier ${i + 1}: Maximum ticket range must be greater than zero`;
          if (
            Number(tier.number_of_entry_start) >=
            Number(tier.number_of_entry_end)
          )
            return `Tier ${i + 1}: Minimum ticket range cannot be equal to or greater than maximum range`;
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
            return `Tier ranges overlap between "${
              current.name || `Tier ${i + 1}`
            }" and "${next.name || `Tier ${i + 2}`}"`;
          }
        }
        return null;
      },
    },
  });

  // Step-wise field validation map
  const stepFieldMap: Record<number, string[]> = {
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
    2: ["competition_details", "sponsorship_details"],
    3: [],
  };

  const validateStep = (stepIndex: number) => {
    const fields = stepFieldMap[stepIndex];
    return !fields.map((f) => form.validateField(f).hasError).some((x) => x);
  };

  const nextStep = () => {
    const isStepValid = validateStep(active);
    if (!isStepValid) return;
    setActive((current) =>
      current < stepsLayout.length - 1 ? current + 1 : current
    );
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    console.log("submitting");

    if (form.validate().hasErrors) {
      return;
    }

    setAlertModalOpen(true);
  };

  function manageRaffles() {
    setSuccessModalOpen(false);
    navigate("/admin/raffles");
  }

  const stepsLayout = [
    {
      label: "basic information",
      description: "enter raffle basic detail below",
      component: <BasicInformation form={form} categories={categories} />,
    },
    {
      label: "ticket price & discount",
      description: "set ticket price and discount",
      component: <TicketPrice form={form} />,
    },
    {
      label: "content marketing",
      description:
        "Enter other content that influences the decision of customer for this raffle",
      component: <ContentMarketing form={form} />,
    },
    {
      label: "media content",
      description: "Set game banner, featured images etc.",
      component: <MediaContent form={form} />,
    },
  ];

  async function handleCreateRaffle() {
    // Build final payload structure
    const payload = {
      name: form.values.name,
      instant_game: String(!form.values.is_scheduled),
      total_tickets: Number(form.values.total_tickets),
      ticket_price: Number(form.values.ticket_price),
      description: form.values.description,
      long_description: form.values.long_description,
      category_id: form.values.category_id,
      minimum_ticket_number_purchase: Number(
        form.values.minimum_ticket_number_purchase
      ),
      maximum_ticket_number_purchase: Number(
        form.values.maximum_ticket_number_purchase
      ),
      maximum_ticket_amount_purchase: Number(
        form.values.maximum_ticket_amount_purchase
      ),
      percentage_markup: Number(form.values.percentage_markup),
      discount_type: form.values.discount_type,
      discount_percentage: Number(form.values.discount_percentage),
      tiers: form.values.tiers,
      is_scheduled: String(form.values.is_scheduled),
      start_date: form.values.start_date,
      end_date: form.values.end_date,
      start_time: form.values.start_time,
      end_time: form.values.end_time,
      cta_text: form.values.cta_text,
      status: form.values.status,
      allow_promo_code_usage: String(form.values.allow_promo_code_usage),
      allow_referral_balance_usage: String(
        form.values.allow_referral_balance_usage
      ),
      minimum_referral_balance_amount: Number(
        form.values.minimum_referral_balance_amount
      ),
      maximum_referral_balance_amount: Number(
        form.values.maximum_referral_balance_amount
      ),
      supporting_text: form.values.supporting_text,
      competition_details: form.values.competition_details,
      sponsorship_details: form.values.sponsorship_details,
      other_information: form.values.other_information,
      documents: form.values.documents,
      card_image: form.values.card_image,
      gallery_images: form.values.gallery_images,
      is_active: String(form.values.is_active),
    };

    console.log("✅ Final Payload:", payload);

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
          {stepsLayout.map((step, index) => (
            <Layout
              key={step.label}
              description={step.description}
              label={step.label}
              className={`${active === index ? "block" : "!hidden"}`}
            >
              {step.component}
            </Layout>
          ))}
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

export default CreateLayout;
