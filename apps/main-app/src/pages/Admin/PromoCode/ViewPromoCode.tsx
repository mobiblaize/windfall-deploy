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
  Menu,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import {
  useDeleteData,
  useFetchData,
  usePutData,
} from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { FaAngleDown } from "react-icons/fa";
import { MultiSelect } from "@mantine/core";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import type { Raffle } from "../GameMgt/RaffleList";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import LoadingState from "../../../components/LoadingState";

const breadCrumbs: Crumb[] = [
  { label: "Promo Code", to: "/admin/promo-codes" },
  { label: "View Promo Code Details" },
];

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export default function ViewPromoCode() {
  const { id } = useParams<{ id: string }>();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch promo by id
  const {
    data: promoResponse,
    isError: isPromoError,
    isLoading: loadingPromo,
    error: promoError,
  } = useFetchData(`admin/promo-code-management/show/${id}`);

  // Fetch possible games for the dropdown
  const {
    data: rafflesResponse,
    isError: isRafflesError,
    error: rafflesError,
  } = useFetchData(`admin/game-management/game-list/all?paginate=0`);

  const updatePromoMutation = usePutData(
    `admin/promo-code-management/update/${id}`
  );
  const toggleStatusMutation = usePutData(
    `admin/promo-code-management/toggle-status/${id}`
  );
  const deletePromoMutation = useDeleteData(
    `admin/promo-code-management/delete`
  );

  useEffect(() => {
    if (isPromoError) {
      notifications.show({
        title: "Failed to fetch Promo Code",
        message:
          (promoError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [promoError, isPromoError]);

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

  const today = useMemo(getToday, []);

  const promo = promoResponse?.data?.promoCode;

  function closeDeleteModal() {
    setDeleteSuccessModalOpen(false);
    navigate(`/admin/promo-codes`, { replace: true });
  }

  const form = useForm({
    initialValues: {
      name: "",
      code: "",
      description: "",
      type: "",
      type_value: "",
      start_date: "",
      end_date: "",
      is_active: "",
      game_ids: [] as string[],
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      code: (value) =>
        !value || /^[A-Za-z0-9-]+$/.test(value)
          ? null
          : "Code must be alphanumeric with hyphens only",
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      type: (value) => (!value ? "Please select a promo code type" : null),
      type_value: (value, values) => {
        if (!value || isNaN(Number(value))) {
          return "Please enter a valid numeric value";
        }
        if (values.type === "percentage") {
          const num = Number(value);
          if (num > 100) return "Percentage discount cannot be more than 100%";
          if (num <= 0) return "Percentage discount must be greater than 0%";
        } else if (values.type === "amount") {
          const num = Number(value);
          if (num <= 0) return "Amount must be greater than zero";
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
        (value as string[]).length === 0
          ? "Please select at least one game"
          : null,
    },
  });

  // Populate form from API response
  useEffect(() => {
    if (!promo) return;
    form.setValues({
      name: promo.name || "",
      code: promo.code || "",
      description: promo.description || "",
      type: promo.type || "",
      type_value: String(promo.type_value ?? ""),
      start_date: promo.start_date || "",
      end_date: promo.end_date || "",
      is_active: promo.is_active || "",
      game_ids: Array.isArray(promo.games)
        ? promo.games.map((g: { uuid: string }) => String(g.uuid))
        : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoResponse]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmModalOpen(true);
  };

  const updatePromo = async () => {
    if (form.validate().hasErrors) return;

    const payload = {
      ...form.values,
    };

    try {
      const response = await updatePromoMutation.mutateAsync(payload);
      notifications.show({
        title: "Promo Code Updated",
        message: response?.message || "Promo code updated successfully",
        color: "green",
      });
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const promoActive = form.values.is_active === "true";

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
                {promo?.name ?? "Edit Promo Code"}
              </Title>
              <Text className="!text-secondary-text">
                View and manage promo-code details
              </Text>
            </div>
            <Menu position="bottom-end" shadow="md" width={280}>
              <Menu.Target>
                <CustomButton rightSection={<FaAngleDown />} border={false}>
                  Take Action
                </CustomButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Take Action</Menu.Label>
                <Menu.Item onClick={() => setConfirmModalOpen(true)}>
                  Save Changes
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  onClick={() =>setDeactivateAlertModalOpen(true)}
                >
                  {promoActive ? 'Deactivate': 'Reactivate'} Promo-Code
                </Menu.Item>
                <Menu.Item
                  className="!text-red-500"
                  onClick={() => setDeleteAlertModalOpen(true)}
                >
                  Delete Promo-Code
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        {loadingPromo && (
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            <LoadingState
              title="Loading Promo-Code"
              description="Getting your promo code, please wait..."
            />
          </Card>
        )}
        {!loadingPromo && (
          <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
            <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
              {/* Basic Information */}
              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
                <Grid.Col span={12}>
                  <h3 className="font-bold text-xl text-primary-red">
                    Basic Information
                  </h3>
                  <p className="text-base text-secondary-text">
                    Fill out the right information below
                  </p>
                </Grid.Col>
              </Grid>
              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
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

              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
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
              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Promo-code Type <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-base text-secondary-text">
                    Define how promo-code / discounted value should be
                    applicable to customer.
                  </p>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Radio.Group
                    {...form.getInputProps("type")}
                    required
                    error={form.errors.type}
                    name="type"
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
                      label={`${form.values.type === "percentage" ? "Percentage" : "Fixed"} Value`}
                      placeholder={`${form.values.type === "percentage" ? "Percentage" : "Fixed"} value`}
                      required
                      classNames={{ input: "placeholder:text-xs" }}
                      {...form.getInputProps("type_value")}
                      error={form.errors.type_value}
                    />
                  </Card>
                </Grid.Col>
              </Grid>

              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
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
              <Grid
                gutter="md"
                className="border-b border-[#C0C0C5] !pb-6 !mb-6"
              >
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
                        const labelWords = option.label
                          .toLowerCase()
                          .split(" ");
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
                    Enter a unique alphanumeric combination as the promo-code.
                    Or system would generate a sample promo-code
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
                onClick={() => navigate("/admin/promo-codes")}
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
                loading={updatePromoMutation.isPending}
                disabled={updatePromoMutation.isPending}
              >
                Save Changes
              </CustomButton>
            </Flex>
          </form>
        )}
      </Container>

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        status="error"
        title="Save Changes ?"
        description="Are you sure you want to save this new changes?. Kindly note, that prior changes would be override by this new changes and action is irreversible."
        primaryButton={{
          label: "Save Changes",
          onClick: updatePromo,
          disabled: updatePromoMutation.isPending,
          loading: updatePromoMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        status="success"
        title="New Changes Saved"
        description="Congratulations, New changes has been successfully saved and updated."
        primaryButton={{
          label: "Close",
          onClick: () => setSuccessModalOpen(false),
        }}
      />

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${promoActive ? "Deactivate" : "Reactivate"} Promo-Code ?`}
        description={`${promoActive ? "Are you sure you want to deactivate this promo-code ? Kindly note that this action implies promo-code can't be used again by customer until reactivated" : "Are you sure you want to Reactivate this promo-code ? Kindly note that this action implies promo-code can now be used again by customer for ticket purchase"}`}
        primaryButton={{
          label: `Yes, ${promoActive ? "Deactivate" : "Reactivate"}`,
          onClick: async () => {
            const action = promoActive ? "deactivated" : "reactivated";
            try {
              const response = await toggleStatusMutation.mutateAsync({});
              setDeactivateAlertModalOpen(false);
              setDeactivateSuccessModalOpen(true);
              notifications.show({
                title: `Promo-Code ${action} successfully`,
                message: response?.message || `Promo-Code ${action} successfully`,
                color: "green",
              });
              form.setFieldValue('is_active', response?.data?.is_active);
            } catch (error) {
              notifications.show({
                title: "Toggle Failed",
                message:
                  (error as { message?: string })?.message ||
                  "An error occurred",
                color: "var(--color-primary-red)",
              });
            }
          },
          loading: toggleStatusMutation.isPending,
          disabled: toggleStatusMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeactivateAlertModalOpen(false),
        }}
      />

      {/* Deactivate Success Modal */}
      <AdminAlertModal
        opened={deactivateSuccessModalOpen}
        onClose={() => setDeactivateSuccessModalOpen(false)}
        status="success"
        title={`Promo-Code ${(!promoActive ? "deactivate" : "reactivate") === "deactivate" ? "Deactivated" : "Reactivated"}`}
        description={`Congratulations, promo-code has been successfully ${(!promoActive ? "deactivate" : "reactivate") === "deactivate" ? "deactivated" : "reactivated"}`}
        primaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />

      {/* Delete Alert Modal */}
      <AdminAlertModal
        opened={deleteAlertModalOpen}
        onClose={() => setDeleteAlertModalOpen(false)}
        status="delete"
        title={<span className="!text-primary-red">Delete Promo-Code ?</span>}
        description="Are you sure you want to delete this Promo-Code ? Kindly note that action is irreversible"
        primaryButton={{
          label: "Yes, Delete",
          onClick: async () => {
            try {
              const response = await deletePromoMutation.mutateAsync(id as string);
              setDeleteAlertModalOpen(false);
              setDeleteSuccessModalOpen(true);
              notifications.show({
                title: "Promo-Code Deleted Successfully",
                message: response?.message || "Promo-Code has been deleted successfully",
                color: "green",
              });
            } catch (error) {
              notifications.show({
                title: "Delete Failed",
                message:
                  (error as { message?: string })?.message ||
                  "An error occurred",
                color: "var(--color-primary-red)",
              });
            }
          },
          loading: deletePromoMutation.isPending,
          disabled: deletePromoMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeleteAlertModalOpen(false),
        }}
      />

      {/* Delete Success Modal */}
      <AdminAlertModal
        opened={deleteSuccessModalOpen}
        onClose={closeDeleteModal}
        status="success"
        title="Promo-Code Deleted"
        description="Promo-Code profile has been successfully Deleted and their access revoked."
        primaryButton={{
          label: "Close",
          onClick: closeDeleteModal,
        }}
      />
    </div>
  );
}
