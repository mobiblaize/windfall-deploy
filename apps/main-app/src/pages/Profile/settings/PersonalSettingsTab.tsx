import {
  Card,
  Container,
  TextInput,
  Divider,
  Select,
  Button,
  Grid,
  Avatar,
  Alert,
  Text,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
import { useEffect, useState } from "react";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { FaAngleDown } from "react-icons/fa";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";
import LoadingState from "../../../components/LoadingState";
import { evaluateAge } from "../../../utils/helper/evaluateAge";
import { formatDateString } from "../../../utils/helper/formatDateString";
import AlertModal from "../../../components/Modals/AlertModal";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "../../../utils/hooks/useStorage";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

export interface UserProfile {
  uuid: string;
  uniqueID: string;
  email: string;
  phone_number: string;
  avatar: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: string;
  lga: string;
  area: string;
  spend_limit_status: string;
  referral_code: string;
  referral_link: string;
  referral_balance: string;
  exclusion_type: string;
  exclude_till: string;
  notification_setting: NotificationSetting;
}

export interface NotificationSetting {
  uuid: string;
  user_id: string;
  push_notification: string;
  email_notification: string;
  game_draw: string;
  game_result_winners: string;
  game_suggestions: string;
  new_games: string;
  payment_transactions: string;
  promotional: string;
  account_security: string;
  created_at: string;
  updated_at: string;
}

function PersonalSettingsTab() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { setUser } = useSessionStorage();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`customer/settings/profile/check_profile`);
  const {
    data: lgaData,
    isError: isLgaError,
    error: lgaError,
  } = useFetchData("guest/dropdown/lagos-lgas");
  const updateMutation = usePutData("customer/settings/profile/update_profile");

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch user profile",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setProfile(response.data);

      form.setValues({
        lga: response.data.lga || "",
        avatar: response.data.avatar || "",
        landmark: response.data.area || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, response]);

  if (isLgaError) {
    notifications.show({
      title: "Failed to load l.g.a",
      message:
        (lgaError as { message: string })?.message || "An error occurred",
      color: "var(--color-primary-red)",
    });
  }

  // Map LGAs for select
  const lgas = (() => {
    if (!lgaData || !lgaData.data) return [];
    return lgaData.data.map((item: { lga: string }) => ({
      value: item.lga.toString(),
      label: item.lga,
    }));
  })();

  const form = useForm({
    initialValues: {
      lga: "",
      avatar: "",
      landmark: "",
    },

    validate: {
      lga: (val) => (val ? null : "Select an LGA"),
      landmark: (val) => (val ? null : "Select a landmark"),
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) {
      return;
    }
    setConfirmationModalOpen(true);
  };

  async function updateProfile() {
    const payload = {
      lga: form.values.lga,
      landmark: form.values.landmark,
      avatar: form.values.avatar,
    };

    // API mutation
    try {
      const response = await updateMutation.mutateAsync(payload);
      notifications.show({
        title: "Profile Update Successful",
        message: response?.message || "Profile updated successfully",
        color: "green",
      });
      if (!response?.error) setUser(response.data);
      setConfirmationModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Profile Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      form.setFieldValue("avatar", base64);
      notifications.show({
        title: "Profile picture updated",
        message: "New profile picture has been loaded.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Upload failed",
        message: "Unable to process your image. Try again.",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <MyGameHeader
        title="Personal Information"
        description="Edit your personal information with ease today."
      >
        <Button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          loading={updateMutation.isPending}
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          px={30}
        >
          Save Changes
        </Button>
      </MyGameHeader>
      <Divider />

      <Container fluid>
        {isLoading && (
          <LoadingState description="Getting your profile details" />
        )}

        {!isLoading && (
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !py-9 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {updateMutation.isError && (
              <Alert
                color="var(--color-primary-red)"
                title="Update Failed"
                className="!mb-5"
              >
                <Text>{updateMutation.error.message}</Text>
              </Alert>
            )}
            {/* Full Name */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Full Name
                </h3>
                <p className="text-base text-secondary-text">
                  For identity verification and prize claim legitimacy.
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  value={`${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`}
                  disabled
                  styles={inputStyles}
                />
              </Grid.Col>
            </Grid>

            {/* Email Address */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Email Address
                </h3>
                <p className="text-base text-secondary-text">
                  For login credentials, confirmation, notifications, and draw
                  results.
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  value={profile?.email ?? ""}
                  disabled
                  styles={inputStyles}
                />
                <p className="text-sm mt-1 text-secondary-text">
                  So sorry, you can’t change or update your email address
                </p>
              </Grid.Col>
            </Grid>

            {/* Phone Number */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Phone Number
                </h3>
                <p className="text-base text-secondary-text">
                  For SMS alerts, verification, and follow-up (especially in
                  Nigeria).
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  value={profile?.phone_number ?? ""}
                  disabled
                  styles={inputStyles}
                />
                <p className="text-sm mt-1 text-secondary-text">
                  So sorry, you can’t change or update your phone number
                </p>
              </Grid.Col>
            </Grid>

            {/* Date of Birth */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Date of Birth / Age Confirmation
                </h3>
                <p className="text-base text-secondary-text">
                  To ensure the participant is above 18 (legally required in
                  most jurisdictions).
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  value={`${formatDateString(profile?.date_of_birth)} (${evaluateAge(profile?.date_of_birth)})`}
                  disabled
                  styles={inputStyles}
                />
                <p className="text-sm mt-1 text-secondary-text">
                  You are eligible to play game as you are more than 18 years of
                  Age
                </p>
              </Grid.Col>
            </Grid>

            {/* Location */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Location
                </h3>
                <p className="text-base text-secondary-text">
                  Select your state, local government area and landmark
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Grid gutter="sm">
                  <Grid.Col span={12}>
                    <Select
                      data={["Lagos"]}
                      value="Lagos"
                      disabled
                      label="State"
                      styles={inputStyles}
                      placeholder="Select State"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      data={lgas}
                      label="L.G.A"
                      placeholder="Select LGA"
                      withAsterisk
                      searchable
                      rightSection={<FaAngleDown />}
                      styles={inputStyles}
                      {...form.getInputProps("lga")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      data={lgas}
                      label="Landmark"
                      placeholder="Select Landmark"
                      withAsterisk
                      searchable
                      rightSection={<FaAngleDown />}
                      styles={inputStyles}
                      {...form.getInputProps("landmark")}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>

            {/* Profile Picture */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Profile Picture
                </h3>
                <p className="text-base text-secondary-text">
                  Helps for KYC (Know Your Customer) processes and for
                  displaying verified winners.
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <Button
                  variant="outline"
                  h={80}
                  color="red"
                  className="!flex !items-center !bg-secondary-red !rounded-xl"
                  onClick={() =>
                    document.getElementById("profilePicInput")?.click()
                  }
                >
                  <Avatar
                    src={form.values.avatar}
                    alt="profile"
                    className="!w-10 !h-10 !mr-2 !rounded-full !object-cover"
                  />
                  <span className="text-lg font-semibold text-black">
                    Click to Change Profile
                  </span>
                </Button>
              </Grid.Col>
            </Grid>
          </Card>
        )}
      </Container>
      <AlertModal
        opened={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        status="error"
        title="Save Changes ?"
        description="Are you sure you want to save and update this new changes? Kindly note that this new changes would override the pre-existing data"
        primaryButton={{
          label: "Save and Update Changes",
          fullWidth: true,
          loading: updateMutation.isPending,
          disabled: updateMutation.isPending,
          onClick: () => updateProfile(),
        }}
        secondaryButton={{
          label: "No, Close",
          onClick: () => setConfirmationModalOpen(false),
        }}
      />
      <AlertModal
        opened={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        status="success"
        title="New Changes Saved"
        description="Congratulations, you have successfully saved and updated new changes"
        primaryButton={{
          label: "Manage Settings",
          fullWidth: true,
          onClick: () => {
            setSuccessModalOpen(false);
            navigate("/profile/settings");
          },
        }}
        secondaryButton={{
          label: "Explore Game",
          fullWidth: true,
          onClick: () => {
            setSuccessModalOpen(false);
            navigate("/raffles");
          },
        }}
      />
    </form>
  );
}

export default PersonalSettingsTab;
