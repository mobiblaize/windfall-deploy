import {
  Card,
  Container,
  Divider,
  Button,
  Switch,
  Flex,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";

const settings = [
  {
    title: "Game Draw Reminder",
    description: "Be notified when your raffle draws are about to take place.",
  },
  {
    title: "Game Results & Winners",
    description: "Get notified instantly when results are announced or if you’ve won",
  },
  {
    title: "Related Game Suggestions",
    description: "Discover similar raffles based on your interests and past entries.",
  },
  {
    title: "New Game Alerts",
    description: "Be the first to know when new raffles launch on the platform.",
  },
  {
    title: "Payment & Transaction Alerts",
    description: "Receive confirmation for ticket purchases etc.",
  },
  {
    title: "Promotional Emails",
    description: "Get exclusive offers, limited-time discounts, and raffle promotions.",
  },
  {
    title: "Account & Security Alerts",
    description: "Stay informed about password changes, new logins, or suspicious activity.",
  },
];

function NotificationSettingsTab() {
  return (
    <div>
      <MyGameHeader
        title="Notification Setting"
        description="Manage your Notification with ease."
      >
        <Button
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          px={30}
        >
          Save Changes
        </Button>
      </MyGameHeader>

      <Divider />

      <Container fluid>
        <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
          {settings.map((item, index) => (
            <Flex
              key={item.title}
              justify="space-between"
              align="center"
              className={`!gap-10 pb-6 ${index !== settings.length - 1 ? "border-b border-[#C0C0C5] mb-6" : ""}`}
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="text-base text-gray-500">{item.description}</p>
              </div>
              <Switch size="md" thumbIcon={<></>} defaultChecked />
            </Flex>
          ))}
        </Card>
      </Container>
    </div>
  );
}

export default NotificationSettingsTab;
