import { Card, Flex, List, Stack, Text, TextInput } from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";
import CustomButton from "../../../../components/Buttons/CustomButton";

type NewPasswordProps = {
  onComplete: () => void;
};

function NewPassword({ onComplete }: NewPasswordProps) {

  return (
    <Card withBorder className="!rounded-lg" p={25}>
      <header className="flex gap-3 items-center mb-7">
        <HiDocumentArrowDown className="p-2 rounded-md bg-secondary-red text-primary-red text-5xl" />
        <div className="capitalize">
          <Text className="!font-semibold !text-xl">Password</Text>
          <Text className="!text-secondary-text">
            Enter new pass word below
          </Text>
        </div>
      </header>
      <form>
        <Stack className="!capitalize" gap="xl">
          <TextInput
            label="create new password"
            placeholder="Enter your password"
            withAsterisk
            rightSection={<FiEye />}
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
          />
          <List className="!text-secondary-text !list-disc">
            <List.Item>8–12 characters</List.Item>
            <List.Item>
              Use both Uppercase letters (A-Z) and Lowercase letter (a-z).
            </List.Item>
            <List.Item>Include Numbers (0–9)</List.Item>
            <List.Item>Special characters (e.g. !@ # $ % ^ & *)</List.Item>
          </List>
          <TextInput
            label="confirm your new password"
            placeholder="Confirm new password"
            withAsterisk
            rightSection={<FiEye />}
            classNames={{
              label: "!text-sm !text-[#030303] font-normal",
              input: "!text-[#030303]",
            }}
          />
        </Stack>
        <Flex justify="flex-end" className="!mt-7">
          <CustomButton onClick={onComplete}>Create Password</CustomButton>
        </Flex>
      </form>
    </Card>
  );
}

export default NewPassword;
