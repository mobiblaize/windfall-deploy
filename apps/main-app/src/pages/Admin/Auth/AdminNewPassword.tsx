import { List, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import CustomButton from "../../../components/Buttons/CustomButton";
import { IconLockFilled } from "@tabler/icons-react";

export type PasswordFormValues = {
  password: string;
  password_confirmation: string;
};

type NewPasswordProps = {
  onComplete: (formValues: PasswordFormValues) => void;
  isLoading?: boolean;
};

function AdminNewPassword({ onComplete, isLoading }: NewPasswordProps) {
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
    <>
      <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
        <IconLockFilled className="text-red-500" size={20} />
      </div>

      <h1 className="text-red-500 font-bold text-3xl mb-2">
        Create New Password
      </h1>
      <p className="text-[#818181] mb-5">
        Create a new password to login securely.
      </p>

      <form onSubmit={form.onSubmit((values) => onComplete(values))}>
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

        <CustomButton
          className="!mt-7"
          border={false}
          fullWidth
          disabled={isLoading}
          loading={isLoading}
          buttonType="submit"
        >
          Create Password
        </CustomButton>
      </form>
    </>
  );
}

export default AdminNewPassword;
