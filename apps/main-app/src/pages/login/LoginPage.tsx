import {
  Card,
  Container,
  Stack,
  Text,
  TextInput,
  Flex,
  PasswordInput,
  Alert,
} from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import LoggedinModal from "../../components/Modals/LoggedinModal";
import SectionHeader from "../../components/SectionHeader";
import loginLeft from "../../assets/login-img-l.png";
import loginRight from "../../assets/login-img-r.png";
import { NavLink, useNavigate } from "react-router-dom";

import { hasLength, isEmail, useForm } from "@mantine/form";
import CustomButton from "../../components/Buttons/CustomButton";
import { usePostData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useSessionStorage } from "../../utils/hooks/useStorage";

function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useSessionStorage();
  const loginMutation = usePostData("customer/auth/login");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 2, max: 8 },
        "Password must be 2-8 characters long"
      ),
    },
  });

  const handleSubmit = async (values: any) => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      username: values.email,
      remember_me: true,
      password: values.password,
    };

    try {
      const response = await loginMutation.mutateAsync(payload);
      updateUser(response?.data);
      notifications.show({
        title: "Login Successful",
        message: response?.message || "You are now logged in",
        color: "green",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error);
      notifications.show({
        title: "Login Failed",
        message: error?.message || "An error occurred",
        color: "red",
      });
    }
  };

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
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {/* error from api */}
            {loginMutation.isError && (
              <Alert color="red" title="Login Failed" className="!mb-5">
                <Text>{loginMutation.error.message}</Text>
              </Alert>
            )}

            <Stack className="!capitalize" gap="xl">
              <TextInput
                label="your email address"
                placeholder="Enter your email address"
                withAsterisk
                classNames={{ label: "!text-lg" }}
                key="email"
                {...form.getInputProps("email")}
                error={form.getInputProps("email").error}
              />
              <PasswordInput
                className="!text-primary-text"
                required
                label="Enter Password"
                placeholder="Confirm your password"
                key="password"
                {...form.getInputProps("password")}
                error={form.getInputProps("password").error}
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
              {/* <LoggedinModal /> */}
              <CustomButton
                buttonType="submit"
                disabled={loginMutation.isPending}
                loading={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </CustomButton>
            </Flex>
          </form>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;
