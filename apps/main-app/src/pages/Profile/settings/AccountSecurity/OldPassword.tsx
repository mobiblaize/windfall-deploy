import { Card, Flex, Stack, Text, PasswordInput, Alert } from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import CustomButton from "../../../../components/Buttons/CustomButton";
import { useForm } from "@mantine/form";

type OldPasswordProps = {
  onComplete: ({ password }: { password: string }) => void;
  loading?: boolean;
  error?: string;
};

function OldPassword({ onComplete, loading, error }: OldPasswordProps) {
  const form = useForm({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validate: {
      password: (val) => (val ? null : "Old Password is required"),
      password_confirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (form.validate().hasErrors) {
      return;
    }
    onComplete({ password: values.password });
  };

  return (
    <Card withBorder className="!rounded-lg">
      <header className="flex gap-3 items-center mb-7">
        <HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
        <div className="capitalize">
          <Text className="!font-semibold !text-xl">
            Enter your Old Password
          </Text>
          <Text className="!text-secondary-text">
            Enter your Old password below
          </Text>
        </div>
      </header>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
            label="Enter your Old Password"
            placeholder="Enter your Old Password"
            withAsterisk
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
            {...form.getInputProps("password")}
            error={form.getInputProps("password").error}
          />
          <PasswordInput
            label="Confirm your Old Password"
            placeholder="Confirm your Old Password"
            withAsterisk
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
            {...form.getInputProps("password_confirmation")}
            error={form.getInputProps("password_confirmation").error}
          />
        </Stack>
        <Flex justify="flex-end" className="!mt-7">
          <CustomButton
            disabled={loading}
            loading={loading}
            buttonType="submit"
          >
            Validate Password
          </CustomButton>
        </Flex>
      </form>
    </Card>
  );
}

export default OldPassword;
