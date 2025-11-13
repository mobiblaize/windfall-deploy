import {
  Alert,
  Button,
  Card,
  Flex,
  List,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import CustomButton from "../../../../components/Buttons/CustomButton";
import { useForm } from "@mantine/form";

export type PasswordFormValues = {
  password: string;
  password_confirmation: string;
};

type NewPasswordProps = {
  resendEmail?: () => void;
  onComplete: (formValues: PasswordFormValues) => void;
  isLoading?: boolean;
  error?: string;
};

function NewPassword({ onComplete, isLoading, error, resendEmail }: NewPasswordProps) {
  const form = useForm({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validate: {
      password: (value) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
          return "Use both uppercase and lowercase letters";
        }
        if (!/[0-9]/.test(value)) {
          return "Include at least one number";
        }
        if (!/[!@#$%^&*]/.test(value)) {
          return "Include at least one special character (!@#$%^&*)";
        }
        return null;
      },
      password_confirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  return (
    <Card withBorder className="!rounded-lg" p={25}>
      <header className="flex gap-3 items-center mb-7">
        <HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
        <div className="capitalize">
          <Text className="!font-semibold !text-xl">Password</Text>
          <Text className="!text-secondary-text">Enter new password below</Text>
        </div>
      </header>

      <form onSubmit={form.onSubmit((values) => onComplete(values))}>
        {error && (
          <Alert
            color="var(--color-primary-red)"
            title="Update Failed"
            className="!mb-5"
          >
            <Text>{error}</Text>
          </Alert>
        )}
        <Stack className="!capitalize" gap="xl">
          <PasswordInput
            label="Create new password"
            placeholder="Enter your password"
            withAsterisk
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
            type="password"
            {...form.getInputProps("password")}
          />

          <List className="!text-secondary-text !list-disc">
            <List.Item>8–12 characters</List.Item>
            <List.Item>
              Use both Uppercase letters (A-Z) and Lowercase letters (a-z).
            </List.Item>
            <List.Item>Include Numbers (0–9)</List.Item>
            <List.Item>Special characters (e.g. !@ # $ % ^ & *)</List.Item>
          </List>

          <PasswordInput
            label="Confirm your new password"
            placeholder="Confirm new password"
            withAsterisk
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
            type="password"
            {...form.getInputProps("password_confirmation")}
          />
        </Stack>

        <Flex justify="flex-end" gap={"md"} className="!mt-7">
          {resendEmail && <Button
            fullWidth={false}
            size="lg"
            variant="default"
            className="!font-medium"
            onClick={resendEmail}
          >
            Resend Email
          </Button>}
          <CustomButton
            disabled={isLoading}
            loading={isLoading}
            buttonType="submit"
          >
            Create Password
          </CustomButton>
        </Flex>
      </form>
    </Card>
  );
}

export default NewPassword;
