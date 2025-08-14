import {
  Card,
  Container,
  Stack,
  Text,
  TextInput,
  Flex,
  PasswordInput,
} from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import LoggedinModal from "../../components/Modals/LoggedinModal";
import SectionHeader from "../../components/SectionHeader";
import loginLeft from "../../assets/login-img-l.png";
import loginRight from "../../assets/login-img-r.png";
import { NavLink } from "react-router-dom";

function LoginPage() {
  return (
    <div className="mb-10 flex flex-col h-full">
      <SectionHeader
        heading="Secured Login"
        subHeading="Login to your Account today. Start Winning"
        imageLeft={loginLeft}
        imageRight={loginRight}
      />

      <Container className="w-full sm:w-4/5 md:!w-5/9 lg:!w-5/10 !mb-32 !mt-20">
        <Card withBorder className="!rounded-lg">
          <header className="flex gap-3 items-center mb-7">
            <HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
            <div>
              <Text className="!font-semibold !text-2xl">Login</Text>
              <Text fz="lg" className="!text-secondary-text">
                Enter Correct Details
              </Text>
            </div>
          </header>
          <form>
            <Stack className="!capitalize" gap="xl">
              <TextInput
                label="your email address"
                placeholder="Enter your email address"
                withAsterisk
                classNames={{ label: "!text-lg" }}
              />
              <PasswordInput
                className="!text-primary-text"
                required
                label="Enter Password"
                placeholder="Confirm your password"
              />
              <Flex justify="flex-end">
                <Text>
                  Forget password ?{" "}
                  <Text
                    component="span"
                    className="!text-primary-red !underline"
                  >
                    <NavLink to={"/reset-password"}>Reset Today</NavLink>
                  </Text>{" "}
                </Text>
              </Flex>
            </Stack>
            <Flex justify="flex-end" className="!mt-7 !mb-3">
              <LoggedinModal />
            </Flex>
          </form>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;
