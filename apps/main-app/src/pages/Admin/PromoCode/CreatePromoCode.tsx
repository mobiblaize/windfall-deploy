import {
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Textarea,
  Box,
  TextInput,
  Radio,
  SimpleGrid,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import type { User } from "../UserMgt/UserMgt";
import { DateInput } from "@mantine/dates";
import { FaAngleDown } from "react-icons/fa";

const breadCrumbs: Crumb[] = [
  { label: "Promo Code", to: "/admin/promo-codes" },
  { label: "View Promo Code Details" },
];

export default function CreatePromoCode() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  //   const {
  //     isError: isRoleError,
  //     data: roleResponse,
  //     error: roleError,
  //   } = useFetchData(`admin/user-management/roles/all?paginate=0`);

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useFetchData(`admin/user-management/users/show/${id}`);

  const updateUserMutation = usePutData(
    `admin/user-management/users/update/${id}`
  );

  //   useEffect(() => {
  //     if (isRoleError) {
  //       notifications.show({
  //         title: "Failed to fetch roles",
  //         message:
  //           (roleError as { message?: string })?.message || "An error occurred",
  //         color: "red",
  //       });
  //     }
  //     if (roleResponse) {
  //       setRoles(roleResponse.data?.records);
  //     }
  //   }, [roleError, isRoleError, roleResponse]);

  useEffect(() => {
    if (isUserError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (userError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (userResponse) {
      setUser(userResponse.data?.record);
    }
  }, [userError, isUserError, userResponse]);

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        role_id: user.roles?.[0]?.uuid || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      role_id: "",
    },

    validate: {
      name: (val) =>
        val.trim().split(" ").length >= 2
          ? null
          : "Enter both firstname and lastname",
      email: (val) => {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
      phone_number: (val) =>
        val.length >= 10 ? null : "Enter a valid phone number",
      role_id: (val) => (val ? null : "Select a Role"),
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmModalOpen(true);
  };

  const updateUser = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      name: form.values.name,
      email: form.values.email,
      phone_number: form.values.phone_number,
      role_id: form.values.role_id,
    };

    try {
      const response = await updateUserMutation.mutateAsync(payload);
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

  function userDetails() {
    setSuccessModalOpen(false);
    navigate(`/admin/users/${id}`, { replace: true });
  }

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
            <CustomButton
              size="lg"
              border={false}
              fullWidth={false}
              variant="default"
              onClick={() => setResolveModalOpen(true)}
            >
              <span className="!font-medium">Resolve</span>
            </CustomButton>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {/* User Name */}
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
                />
              </Grid.Col>
            </Grid>

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
                />
              </Grid.Col>
            </Grid>

            {/* Phone Number */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Promo-code Type
                </h3>
                <p className="text-base text-secondary-text">
                  Define how promo-code / discounted value should be applicable
                  to customer.
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Radio
                  //   checked={discountType === "straight_line"}
                  //   onChange={() => handleDiscountTypeChange("straight_line")}
                  label="Apply to unit price of ticket"
                  description="Discount is applied to each ticket individually For example: Ticket = ₦5,000 ; Discount = 10% ; Buyer gets each ticket for ₦4,500"
                />
                <Radio
                  mt={"md"}
                  //   checked={discountType === "band"}
                  //   onChange={() => handleDiscountTypeChange("band")}
                  label="Apply to Culmination of Ticket Unit"
                  description="Discount is applied after adding up the total cost. For example: 5 Tickets = ₦25,000 ; Discount = 10% ; Total after discount = ₦22,500 "
                />

                <Card withBorder mt="md" radius="md" className="!p-8 !pt-6">
                  <h3 className="font-medium text-primary-red mb-2">
                    Discounted Value
                  </h3>
                  <TextInput
                    label="Fixed Value"
                    placeholder="Fixed discount value"
                    required
                    classNames={{ input: "placeholder:text-xs" }}
                  />
                </Card>
              </Grid.Col>
            </Grid>

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
                    // classNames={{ input: "placeholder:text-xs" }}
                    // {...form.getInputProps("start_date")}
                    error={form.errors.start_date}
                  />
                  <DateInput
                    label="End date"
                    placeholder="Pick end date"
                    required
                    // classNames={{ input: "placeholder:text-xs" }}
                    // {...form.getInputProps("end_date")}
                    error={form.errors.end_date}
                  />
                </SimpleGrid>
              </Grid.Col>
            </Grid>

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
                <Select
                //   value={raffleId}
                //   onChange={setRaffleId}
                  rightSection={<FaAngleDown />}
                  placeholder="Game: "
                //   data={rafflesData}
                  className="!shadow-md"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md" className="!pb-6 !mb-1 -mt-3">
              <Grid.Col span={{ base: 12 }}>
                <Box
                  className="border border-dashed !text-center border-primary-red bg-secondary-red rounded-2xl"
                  px={"md"}
                  py={"md"}
                  my={"md"}
                >
                  <Text tt="capitalize" c="var(--secondary-text)">
                    Applicable Code
                  </Text>
                  <Text tt="capitalize" className="!text-primary-red !text-3xl" fw={700}>
                    Get-₦5K-Off
                  </Text>
                </Box>
              </Grid.Col>
            </Grid>

            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6" align="center" justify="center">
              <Grid.Col span={{ base: 10 }}>
                <p className="text-base text-secondary-text !text-center">
                  Enter a unique alphanumeric combination as the promo-code. Or system would generate a sample promo-code
                </p>
              </Grid.Col>
            </Grid>
          </Card>
        </form>
      </Container>

      <AdminAlertModal
        opened={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title={<div className="!text-start">Why Resolve</div>}
        description={
          <div className="!text-start -mt-3">
            <Text className="!text-base !text-start !text-[#818181] !mb-5">
              Provide a reason as to why this resolution
              <br />
            </Text>

            <Textarea
              label="Provide more context "
              required
              placeholder="Provide more context as to why this resolution"
              autosize
              minRows={4}
              classNames={{ label: "text-xs font-medium capitalize" }}
            />
            <Text fz="xs" mt={4} c="dimmed">
              120 characters, including spaces & punctuation
            </Text>
          </div>
        }
        primaryButton={{
          label: "Yes, Resolve Case",
          onClick: () => {
            setResolveModalOpen(false);
            setConfirmModalOpen(true);
          },
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setResolveModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        status="error"
        title="Resolve Complaints ?"
        description="Are you sure you want to Resolve this complaint?"
        primaryButton={{
          label: "Yes, Resolve Case",
          onClick: updateUser,
          disabled: updateUserMutation.isPending,
          loading: updateUserMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={userDetails}
        status="success"
        title="Case resolved"
        description="Case has been successfully Resolved"
        primaryButton={{
          label: "Close",
          onClick: userDetails,
        }}
      />
    </div>
  );
}
