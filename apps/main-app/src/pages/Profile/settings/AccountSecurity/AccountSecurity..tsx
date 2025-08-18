import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  SimpleGrid,
  Text,
} from "@mantine/core";
import MyGameHeader from "../../MyGameHeader";
import ProfileHeader from "../../ProfileHeader";
import { useNavigate } from "react-router-dom";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { IconLockFilled } from "@tabler/icons-react";

function AccountSecurity() {
  const navigate = useNavigate();

  return (
    <div className="text-primary-text mb-32">
      <ProfileHeader />
      <div>
        <MyGameHeader
          title="Account Security"
          description="Manage your account security with ease."
        />
        <Divider />
        <Container fluid className="sm:!mx-5 !px-6 !md:px-16">
          <SimpleGrid my={54} cols={1}>
            <Card
              withBorder
              className="!p-6 !rounded-xl !space-y-2 justify-items-start transition-shadow"
            >
              <Flex
                columnGap="md"
                rowGap="md"
                justify="space-between"
                align="center"
                direction="row"
                className="!flex-wrap sm:!flex-nowrap"
              >
                <Flex
                  gap="md"
                  justify="flex-start"
                  align="center"
                  direction="row"
                  wrap="nowrap"
                >
                  <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-md">
                    <HiDocumentArrowDown className="!text-xl !text-primary-red" />
                  </div>
                  <div>
                    <Text className="!text-lg !font-bold !text-primary-text">
                      Account Security
                    </Text>
                    <Text className="!text-sm !text-secondary-text">
                      Keep your account safe by regularly updating your
                      password. Choose a strong, unique password to protect your
                      personal information and raffle activity
                    </Text>
                  </div>
                </Flex>
                <div className="w-fit">
                  <Button
                    onClick={() =>
                      navigate("/profile/settings/change-password")
                    }
                    className="!h-12 !bg-primary-text grow !border-2 !border-dashed !border-primary-red"
                    rightSection={<IconLockFilled size={20} />}
                    px={30}
                  >
                    Change Password
                  </Button>
                </div>
              </Flex>
            </Card>
          </SimpleGrid>
        </Container>
      </div>
    </div>
  );
}

export default AccountSecurity;
