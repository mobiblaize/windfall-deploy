/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Radio,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import "@mantine/dates/styles.css";

type Props = { form: UseFormReturnType<any>; categories: any };

function BasicInformation({ form, categories }: Props) {
  const [isScheduled, setIsScheduled] = useState(form.values.is_scheduled);

  const handleScheduleChange = (value: boolean) => {
    setIsScheduled(value);
    form.setFieldValue("is_scheduled", value);
  };

  return (
    <Box>
      {/* Raffle Name */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Box>
          <Text tt="capitalize" fw={500}>
            Raffle name
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enter unique name for this raffle.
          </Text>
        </Box>
        <TextInput
          placeholder="Enter raffle name"
          classNames={{ input: "placeholder:text-xs" }}
          {...form.getInputProps("name")}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Description */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            Short description
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Briefly describe what this raffle is all about.
          </Text>
        </Box>
        <TextInput
          placeholder="Enter short description"
          classNames={{ input: "placeholder:text-xs" }}
          {...form.getInputProps("description")}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Category */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            Raffle category
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Put this raffle in a specific category.
          </Text>
        </Box>
        <Select
          placeholder="Select category"
          data={categories}
          rightSection={<FaAngleDown />}
          classNames={{
            input: "placeholder:text-xs",
            options: "text-primary-text",
          }}
          {...form.getInputProps("category_id")}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Raffle Date & Schedule */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            Raffle date
          </Text>
          <Text fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Define the start and end date for this raffle (when it goes live).
          </Text>
        </Box>
        <Box>
          <Radio
            checked={!isScheduled}
            onChange={() => handleScheduleChange(false)}
            label="Straight to live raffle game"
            description="Raffle goes live immediately upon publishing. Tickets available instantly."
          />

          <Radio
            mt="md"
            checked={isScheduled}
            onChange={() => handleScheduleChange(true)}
            label="Schedule raffle"
            description="Raffle will be published but tickets only become available after the scheduled date."
          />

          <Card withBorder mt="md" radius="md" className="p-4">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DateInput
                label="Start date"
                placeholder="Pick start date"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("start_date")}
                error={form.errors.start_date}
              />
              <DateInput
                label="End date"
                placeholder="Pick end date"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("end_date")}
                error={form.errors.end_date}
              />
            </SimpleGrid>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TimeInput
                label="Start time"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("start_time")}
              />
              <TimeInput
                label="End time"
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("end_time")}
              />
            </SimpleGrid>
          </Card>
        </Box>
      </SimpleGrid>

      <Divider my="md" />

      {/* Allow promo code usage */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            Allow use of promo code
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enable use of promo code for discounted tickets.
          </Text>
        </Box>
        <Checkbox
          label="Allow promo code for payment"
          {...form.getInputProps("allow_promo_code_usage", {
            type: "checkbox",
          })}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Referral payment */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            Referral payment
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enable referrals to boost user participation.
          </Text>
        </Box>
        <Box>
          <Checkbox
            label="Allow referral balance for payment"
            {...form.getInputProps("allow_referral_balance_usage", {
              type: "checkbox",
            })}
          />

          {form.values.allow_referral_balance_usage && (
            <Card withBorder mt="md" radius="md" className="p-4">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Minimum referral balance amount"
                  type="number"
                  placeholder="Enter minimum amount"
                  classNames={{ input: "placeholder:text-xs" }}
                  {...form.getInputProps("minimum_referral_balance_amount")}
                />
                <TextInput
                  label="Maximum referral balance amount"
                  type="number"
                  placeholder="Enter maximum amount"
                  classNames={{ input: "placeholder:text-xs" }}
                  {...form.getInputProps("maximum_referral_balance_amount")}
                />
              </SimpleGrid>
            </Card>
          )}
        </Box>
      </SimpleGrid>

      <Divider my="md" />

      {/* CTA Text */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={500}>
            CTA text
          </Text>
          <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
            Enter a catchy call to action.
          </Text>
        </Box>

        <div>
          <TextInput
            placeholder="Play with ₦ 1,000 Today!!"
            classNames={{ input: "placeholder:text-xs" }}
            {...form.getInputProps("cta_text")}
            maxLength={15}
          />

          <Text fz="xs" mt={4} c="dimmed">
            15 characters, including spaces & punctuation
          </Text>
        </div>
      </SimpleGrid>
    </Box>
  );
}

export default BasicInformation;
