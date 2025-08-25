import { Modal, Text, Badge, Divider } from "@mantine/core";

type UserActionModalProps = {
  opened: boolean;
  onClose: () => void;
};

export default function UserAction({ opened, onClose }: UserActionModalProps) {
  const action = {
    date: "April 11, 2025",
    time: "11:12.04 am W.A.T",
    module: "Game Management",
    type: "Created a Game",
    actionFrom1: "MacBook Pro M1",
    actionFrom2: "MacBook Pro M1",
    status: "Pending",
    ip: "8944HJHDh08944784",
    location: "Lagos State, Nigeria",
  };

  const fields = [
    { label: "Date", value: action.date },
    { label: "Time", value: action.time },
    { label: "Affected Module", value: action.module },
    { label: "Action Type", value: action.type },
    { label: "Action From", value: action.actionFrom1 },
    { label: "Action From", value: action.actionFrom2 },
    {
      label: "Action Status (Review)",
      value: <Badge color="#B54708" radius="md" className="!capitalize !text-sm !h-[22px]" variant="light">{action.status}</Badge>,
    },
    { label: "IP Address", value: action.ip },
    { label: "Location", value: <span className="font-semibold">{action.location}</span> },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<div>
        <Text className="!font-bold !text-lg">User action</Text>
        <Text className="!text[#4C4D61] mb-4">
            A Trail of user action
        </Text>
      </div>}
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
              <Text className="!font-medium text-[#000014]">{item.value}</Text>
            </div>
            {idx !== fields.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Modal>
  );
}
