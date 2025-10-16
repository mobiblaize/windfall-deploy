import { Modal, Text, Badge, Divider } from "@mantine/core";
import { format } from "date-fns";
import type { UserActivity } from "./UserDetails";

type UserActionModalProps = {
  opened: boolean;
  onClose: () => void;
  activity: UserActivity | null;
};

export default function UserAction({ opened, onClose, activity }: UserActionModalProps) {
  if (!activity) return null;

  const fields = [
    {
      label: "Date",
      value: activity.created_at
        ? format(new Date(activity.created_at), "MMMM d, yyyy")
        : "-",
    },
    {
      label: "Time",
      value: activity.created_at
        ? format(new Date(activity.created_at), "h:mm a")
        : "-",
    },
    { label: "Affected Module", value: activity.action_module },
    { label: "Action Type", value: activity.action_type },
    { label: "Description", value: activity.description },
    {
      label: "Action Status (Review)",
      value: (
        <Badge
          color={
            activity.causer.approvalStatus === "approved"
              ? "green"
              : activity.causer.approvalStatus === "pending"
              ? "yellow"
              : "red"
          }
          radius="md"
          className="!capitalize !text-sm !h-[22px]"
          variant="light"
        >
          {activity.causer.approvalStatus}
        </Badge>
      ),
    },
    { label: "Causer", value: activity.causer?.name },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <Text className="!font-bold !text-lg">User action</Text>
          <Text className="!text[#4C4D61] mb-4">A Trail of user action</Text>
        </div>
      }
      className="!text-primary-text"
      centered
      radius="lg"
      size="lg"
    >
      <div className="mb-15">
        {fields.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center py-5">
              <Text className="!text[#4C4D61]">{item.label}</Text>
              <div className="!font-medium text-[#000014] text-end">{item.value}</div>
            </div>
            {idx !== fields.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Modal>
  );
}
