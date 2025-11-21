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
import SectionHeader from "../../components/SectionHeader";
import loginLeft from "../../assets/login-img-l.png";
import loginRight from "../../assets/login-img-r.png";
import { NavLink } from "react-router-dom";

import { isNotEmpty, useForm } from "@mantine/form";
import CustomButton from "../../components/Buttons/CustomButton";
import { usePostData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useSessionStorage } from "../../utils/hooks/useStorage";
import AlertModal from "../../components/Modals/AlertModal";
import { useState } from "react";
import { useAuth } from "../../utils/hooks/useAuth";
import { useCart } from "../../utils/hooks/useCart";

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginPage() {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { updateUser } = useSessionStorage();
  const loginMutation = usePostData("customer/auth/login");
  const { handleLoginRedirect } = useAuth();
  const { transferCart } = useCart();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => isNotEmpty("Email / Phone Number is required")(value),
      password: isNotEmpty("Password is required"),
    },
  });

  function closeModal() {
    setSuccessModalOpen(false);
    handleLoginRedirect("/dashboard");
  }

  const handleSubmit = async (values: LoginFormValues) => {
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
      setSuccessModalOpen(true);
      transferCart();
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
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
              <Alert
                color="var(--color-primary-red)"
                title="Login Failed"
                className="!mb-5"
              >
                <Text>{loginMutation.error.message}</Text>
              </Alert>
            )}

            <Stack className="!capitalize" gap="xl">
              <TextInput
                label="Your Email / Phone number"
                placeholder="Enter your Email / Phone Number"
                withAsterisk
                classNames={{ input: "!h-10 !rounded-lg" }}
                key="email"
                {...form.getInputProps("email")}
                error={form.getInputProps("email").error}
              />
              <PasswordInput
                className="!text-primary-text"
                label="Enter Password"
                placeholder="Confirm your password"
                withAsterisk
                classNames={{ input: "!h-10 !rounded-lg" }}
                key="password"
                {...form.getInputProps("password")}
                error={form.getInputProps("password").error}
              />
              <Flex justify="flex-end">
                <Text>
                  Forgot password ?{" "}
                  <Text
                    component="span"
                    className="!text-primary-red !underline"
                  >
                    <NavLink to={"/reset-password"}>Reset Today</NavLink>
                  </Text>{" "}
                </Text>
              </Flex>
            </Stack>
            <Flex justify="space-between" direction={"row-reverse"} align={"flex-end"} className="!mt-7 !mb-3" gap={10} wrap={"wrap"}>
              <CustomButton
                buttonType="submit"
                disabled={loginMutation.isPending}
                loading={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </CustomButton>
              <Text className="!text-secondary-text !tracking-wide">
                Don't have an account ?{" "}
                <NavLink to="/register">
                  <span className="text-primary-red underline font-medium">
                    Sign Up
                  </span>
                </NavLink>
              </Text>
            </Flex>
          </form>
        </Card>
      </Container>
      <AlertModal
        opened={successModalOpen}
        onClose={closeModal}
        status="success"
        title="Login Successful"
        description="Congratulation, you have successfully logged in to your WindFall raffle Account. Now start playing"
        primaryButton={{
          label: "Continue",
          onClick: closeModal,
        }}
      />
    </div>
  );
}

export default LoginPage;
