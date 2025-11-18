import {
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Box,
  TextInput,
  Radio,
  SimpleGrid,
  Button,
  type ComboboxItem,
} from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { FaAngleDown } from "react-icons/fa";
import type { Raffle } from "../GameMgt/RaffleList";
import { MultiSelect } from "@mantine/core";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const breadCrumbs: Crumb[] = [
  { label: "Promo Code", to: "/admin/promo-codes" },
  { label: "Create a Promo-Code" },
];

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight
  return today;
}

export default function CreatePromoCode() {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch possible games for the dropdown, if available
  const {
    data: rafflesResponse,
    isError: isRafflesError,
    error: rafflesError,
  } = useFetchData(`admin/game-management/game-list/all?paginate=0`);

  const createPromoCodeMutation = usePostData(
    `admin/promo-code-management/create`
  );

  useEffect(() => {
    if (isRafflesError) {
      notifications.show({
        title: "Failed to fetch Raffle Games",
        message:
          (rafflesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [rafflesError, isRafflesError]);

  // gamesData now memoized for performance, given the addition of search logic
  const gamesData = useMemo(
    () =>
      Array.isArray(rafflesResponse?.data)
        ? (rafflesResponse.data as Raffle[]).map((g) => ({
            value: String(g.uuid),
            label: g.name,
          }))
        : [],
    [rafflesResponse]
  );

  const form = useForm({
    initialValues: {
      name: "",
      code: "",
      description: "",
      type: "percentage",
      type_value: "",
      start_date: "",
      end_date: "",
      is_active: "true",
      game_ids: [],
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      code: (value) =>
        !value || /^[A-Za-z0-9-]+$/.test(value)
          ? null
          : "Code must be alphanumeric with hyphens only",
      description: (value) =>
        !value ? "Description is required" : null,
      type: (value) => (!value ? "Please select a promo code type" : null), //amount | percentage
      type_value: (value, values) => {
        if (!value || isNaN(Number(value))) {
          return "Please enter a valid numeric value";
        }
        if (values.type === "percentage") {
          const num = Number(value);
          if (num > 100) {
            return "Percentage discount cannot be more than 100%";
          }
          if (num <= 0) {
            return "Percentage discount must be greater than 0%";
          }
        } else if (values.type === "amount") {
          const num = Number(value);
          if (num <= 0) {
            return "Amount must be greater than zero";
          }
        }
        return null;
      },
      start_date: (value) => (!value ? "Start date is required" : null),
      end_date: (value, values) => {
        if (!value) return "End date is required";
        if (new Date(value) <= new Date(values.start_date))
          return "End date must be after start date";
        return null;
      },
      game_ids: (value) =>
        value.length === 0 ? "Please select at least one game" : null,
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmModalOpen(true);
  };

  const createPromo = async () => {

    const payload = {
      ...form.values,
    };

    try {
      const response = await createPromoCodeMutation.mutateAsync(payload);
      notifications.show({
        title: "User Update Successful",
        message: response?.message || "User updated successfully",
        color: "green",
      });
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "User Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const isPercentageDiscount = form.values.type === 'percentage';

  function promoCodes() {
    setSuccessModalOpen(false);
    navigate(`/admin/promo-codes`, { replace: true });
  }

  // type_value is the actual discount value (fixed or percent)

  const today = useMemo(getToday, []);

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
                Promo Code Name
              </Title>
              <Text className="!text-secondary-text">
                View and manage promo-code details
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {/* Basic Information */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={12}>
                <h3 className="font-bold text-xl text-primary-red">
                  Basic Information
                </h3>
                <p className="text-base text-secondary-text">
                  Fill out the right information below
                </p>
              </Grid.Col>
            </Grid>

            {/* Promo-code Name */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Promo-code Name <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Enter a unique name for this promo
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <TextInput
                  placeholder="Enter promo-code name"
                  {...form.getInputProps("name")}
                  required
                  error={form.errors.name}
                />
              </Grid.Col>
            </Grid>

            {/* Description */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Short Description
                </h3>
                <p className="text-base text-secondary-text">
                  Briefly describe what this promo
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <TextInput
                  placeholder="Enter promo code description"
                  {...form.getInputProps("description")}
                  required
                  error={form.errors.description}
                />
              </Grid.Col>
            </Grid>

            {/* Promo-code Type */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Promo-code Type <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Define how promo-code / discounted value should be applicable
                  to customer.
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Radio.Group
                  {...form.getInputProps("type")}
                  required
                  error={form.errors.type}
                  name="type"
                  // label="Promo Disount Type"
                >
                  <Radio
                    value="percentage"
                    label="Percentage Value"
                    description="x percentage value is deducted from the final cost of purchase during checkout. "
                  />
                  <Radio
                    mt={"md"}
                    value="amount"
                    label="Fixed Value"
                    description="A certain ₦xxxx value is deducted from the final cost of purchase during checkout. i.e ₦1,000"
                  />
                </Radio.Group>

                <Card withBorder mt="md" radius="md" className="!p-8 !pt-6">
                  <h3 className="font-medium text-primary-red mb-2">
                    Discounted Value
                  </h3>
                  <TextInput
                    label={`${isPercentageDiscount ? 'Percentage': 'Fixed'} Value`}
                    placeholder={`${isPercentageDiscount ? 'Percentage': 'Fixed'} value`}
                    required
                    classNames={{ input: "placeholder:text-xs" }}
                    {...form.getInputProps("type_value")}
                    error={form.errors.type_value}
                  />
                </Card>
              </Grid.Col>
            </Grid>

            {/* Validity Duration */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Promo Validity Duration
                </h3>
                <p className="text-base text-secondary-text">
                  Define the start and End date for when this promo-code would
                  be valid to use by the customers
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <DateInput
                    label="Start date"
                    placeholder="Pick start date"
                    required
                    {...form.getInputProps("start_date")}
                    error={form.errors.start_date}
                    minDate={today}
                  />
                  <DateInput
                    label="End date"
                    placeholder="Pick end date"
                    required
                    {...form.getInputProps("end_date")}
                    error={form.errors.end_date}
                    minDate={today}
                  />
                </SimpleGrid>
              </Grid.Col>
            </Grid>

            {/* Game Applicable */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Game Applicable
                </h3>
                <p className="text-base text-secondary-text">
                  Add a game that this promo-code is applicable to
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <MultiSelect
                  rightSection={<FaAngleDown />}
                  placeholder="Game: "
                  data={gamesData}
                  filter={({ options, search }) => {
                    const searchTerms = search
                      .toLowerCase()
                      .split(" ")
                      .filter(Boolean);

                    if (searchTerms.length === 0) return options;

                    return (options as ComboboxItem[]).filter((option) => {
                      // option.label may have multiple words, match any word
                      const labelWords = option.label.toLowerCase().split(" ");
                      // Return true only if *every* search word is found as a substring of any label word
                      return searchTerms.every((term) =>
                        labelWords.some((word) => word.includes(term))
                      );
                    });
                  }}
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                  {...form.getInputProps("game_ids")}
                  error={form.errors.game_ids}
                  searchable
                  clearable
                />
              </Grid.Col>
            </Grid>

            {/* Applicable Code & code (editable) */}
            <Grid gutter="md" className="!pb-6 !mb-1 -mt-3">
              <Grid.Col span={{ base: 12 }}>
                <Box
                  className="border border-dashed !text-center border-primary-red bg-secondary-red rounded-2xl"
                  px={"md"}
                  py={"lg"}
                  my={"md"}
                >
                  <Text mb={2} tt="capitalize" c="var(--secondary-text)">
                    Applicable Code
                  </Text>
                  <TextInput
                    className="!text-center !font-bold !text-3xl !text-primary-red"
                    styles={{
                      input: {
                        fontSize: "2.25rem",
                        fontWeight: 800,
                        color: "var(--color-primary-red)",
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                        textAlign: "center",
                        padding: 0,
                        height: "fit-content"
                      },
                    }}
                    placeholder="e.g. Get-₦5K-Off"
                    {...form.getInputProps("code")}
                    autoFocus={false}
                    error={form.errors.code}
                  />
                </Box>
              </Grid.Col>
            </Grid>

            <Grid
              gutter="md"
              className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              align="center"
              justify="center"
            >
              <Grid.Col span={{ base: 10 }}>
                <p className="text-base text-secondary-text !text-center">
                  Enter a unique alphanumeric combination as the promo-code. Or
                  system would generate a sample promo-code
                </p>
              </Grid.Col>
            </Grid>
          </Card>

          <Flex
            justify="flex-end"
            gap={20}
            className="!bg-white !rounded-xl !border !border-gray-200 !p-6 sm:!mx-5 md:!mx-30 lg:!mx-40 !mb-10"
          >
            <Button
              size="lg"
              fullWidth={false}
              variant="default"
              onClick={() => navigate("admin/promo-codes")}
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
              loading={createPromoCodeMutation.isPending}
              disabled={createPromoCodeMutation.isPending}
            >
              Continue
            </CustomButton>
          </Flex>
        </form>
      </Container>

      {/* MODALS */}

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        status="error"
        title="Create a Promo-Code ?"
        description="Are you sure you want to create this new promo-code ? Kindly note that at live promo-code can be used on the system by the customer, to get specific discounted value."
        primaryButton={{
          label: "Create Promo-Code",
          onClick: createPromo,
          disabled: createPromoCodeMutation.isPending,
          loading: createPromoCodeMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={promoCodes}
        status="success"
        title="Promo-Code Created"
        description="Congratulations, promo-code has been successfully Created."
        primaryButton={{
          label: "Close",
          onClick: promoCodes,
        }}
      />
    </div>
  );
}
