import {
  Button,
  Card,
  Container,
  Divider,
  SimpleGrid,
  Text,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
import { FiLogOut } from "react-icons/fi";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const settings: {
  title: string;
  description: string;
  route: string;
}[] = [
  {
    title: "Personal Information",
    description: "Edit your Personal Information like name etc.",
    route: "personal",
  },
  {
    title: "Account Security",
    description: "Secure your account wth ease.",
    route: "account",
  },
  {
    title: "Notification Setting",
    description: "Edit your Personal Information like name etc.",
    route: "notification",
  },
];

function SettingsTab() {
  const navigate = useNavigate();

  return (
    <div>
      <MyGameHeader
        title="Settings"
        description="Manage your account settings in one place."
      >
        <Button
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          rightSection={<FiLogOut size={20} />}
          px={30}
        >
          Log Out
        </Button>
      </MyGameHeader>

      <Divider />
      <Container fluid className="sm:!mx-5 !px-6 !md:px-16">
        <SimpleGrid
          my={54}
          cols={{ base: 1, md: 3 }}
          spacing={{ base: 10, sm: "md", md: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {settings.map((setting) => (
            <Card
              key={setting.route}
              withBorder
              onClick={() => navigate(setting.route)}
              className="!p-6 !rounded-xl !space-y-2 justify-items-start cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-md">
                <HiDocumentArrowDown className="!text-xl !text-primary-red" />
              </div>
              <div>
                <Text className="!text-lg !font-bold !text-primary-text">
                  {setting.title}
                </Text>
                <Text className="!text-sm !text-secondary-text">
                  {setting.description}
                </Text>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default SettingsTab;
