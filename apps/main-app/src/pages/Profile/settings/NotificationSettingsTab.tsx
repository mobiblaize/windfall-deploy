import { Card, Container, Divider, Button, Switch, Flex } from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import AlertModal from "../../../components/Modals/AlertModal";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../../components/LoadingState";

const settings = [
  {
    key: "game_draw",
    title: "Game Draw Reminder",
    description: "Be notified when your raffle draws are about to take place.",
  },
  {
    key: "game_result_winners",
    title: "Game Results & Winners",
    description:
      "Get notified instantly when results are announced or if you’ve won.",
  },
  {
    key: "game_suggestions",
    title: "Related Game Suggestions",
    description:
      "Discover similar raffles based on your interests and past entries.",
  },
  {
    key: "new_games",
    title: "New Game Alerts",
    description:
      "Be the first to know when new raffles launch on the platform.",
  },
  {
    key: "payment_transactions",
    title: "Payment & Transaction Alerts",
    description: "Receive confirmation for ticket purchases etc.",
  },
  {
    key: "promotional",
    title: "Promotional Emails",
    description:
      "Get exclusive offers, limited-time discounts, and raffle promotions.",
  },
  {
    key: "account_security",
    title: "Account & Security Alerts",
    description:
      "Stay informed about password changes, new logins, or suspicious activity.",
  },
];

export default function NotificationSettingsTab() {
  const navigate = useNavigate();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`customer/settings/notification/fetch`);
  const updateMutation = usePutData("customer/settings/notification/update");

  const form = useForm({
    initialValues: {
      push_notification: false,
      email_notification: false,
      game_draw: false,
      game_result_winners: false,
      game_suggestions: false,
      new_games: false,
      payment_transactions: false,
      promotional: false,
      account_security: false,
    },
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch notification settings",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }

    if (response?.data) {
      const apiData = response.data;
      form.setValues({
        push_notification: apiData.push_notification === "true",
        email_notification: apiData.email_notification === "true",
        game_draw: apiData.game_draw === "true",
        game_result_winners: apiData.game_result_winners === "true",
        game_suggestions: apiData.game_suggestions === "true",
        new_games: apiData.new_games === "true",
        payment_transactions: apiData.payment_transactions === "true",
        promotional: apiData.promotional === "true",
        account_security: apiData.account_security === "true",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isError, error]);

  const updateNotifications = async () => {
    const payload = Object.fromEntries(
      Object.entries(form.values).map(([key, value]) => [
        key,
        value ? "true" : "false",
      ])
    );

    try {
      const response = await updateMutation.mutateAsync(payload);
      notifications.show({
        title: "Notifications Update Successful",
        message:
          response.message || "Notification preferences updated successfully",
        color: "green",
      });
      setConfirmationModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          (error as { message: string })?.message ||
          "Failed to update notification preferences",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(() => setConfirmationModalOpen(true))}>
      <MyGameHeader
        title="Notification Setting"
        description="Manage your Notification with ease."
      >
        <Button
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          px={30}
          // loading={mutation.isPending}
          type="submit"
        >
          Save Changes
        </Button>
      </MyGameHeader>

      <Divider />

      <Container fluid>
        {isLoading && (
          <LoadingState description="Getting your notification settings" />
        )}

        {!isLoading && (
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {/* General notification toggles */}
            <Flex
              justify="space-between"
              align="center"
              className="border-b border-[#C0C0C5] pb-6 mb-6"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Push Notification
                </h3>
                <p className="text-base text-gray-500">
                  Receive push notifications on your device.
                </p>
              </div>
              <Switch
                size="md"
                thumbIcon={<></>}
                checked={form.values.push_notification}
                onChange={(e) =>
                  form.setFieldValue(
                    "push_notification",
                    e.currentTarget.checked
                  )
                }
              />
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              className="border-b border-[#C0C0C5] pb-6 mb-6"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Email Notification
                </h3>
                <p className="text-base text-gray-500">
                  Receive updates via your registered email.
                </p>
              </div>
              <Switch
                size="md"
                thumbIcon={<></>}
                checked={form.values.email_notification}
                onChange={(e) =>
                  form.setFieldValue(
                    "email_notification",
                    e.currentTarget.checked
                  )
                }
              />
            </Flex>

            {/* Dynamic Game-related toggles */}
            {settings.map((item, index) => (
              <Flex
                key={item.key}
                justify="space-between"
                align="center"
                className={`!gap-10 pb-6 ${
                  index !== settings.length - 1
                    ? "border-b border-[#C0C0C5] mb-6"
                    : ""
                }`}
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-500">{item.description}</p>
                </div>
                <Switch
                  size="md"
                  thumbIcon={<></>}
                  checked={form.values[item.key as keyof typeof form.values]}
                  onChange={(e) =>
                    form.setFieldValue(item.key, e.currentTarget.checked)
                  }
                />
              </Flex>
            ))}
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
          onClick: () => updateNotifications(),
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
