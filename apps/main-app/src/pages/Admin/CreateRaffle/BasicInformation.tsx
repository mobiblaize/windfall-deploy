/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
import { DateInput, TimePicker } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import { FaAngleDown } from "react-icons/fa";
import "@mantine/dates/styles.css";
import { CiCalendar } from "react-icons/ci";

type Props = { form: UseFormReturnType<any>; categories: any[] };

function BasicInformationInner({ form, categories }: Props) {
  // Initialize local state from form values once on mount to avoid reading
  // form.values every render (which can cause extra renders/upstream effects).
  const [isScheduled, setIsScheduled] = useState<boolean>(
    !!form.values?.is_scheduled
  );
  const [allowReferral, setAllowReferral] = useState<boolean>(
    !!form.values?.allow_referral_balance_usage
  );

  useEffect(() => {
    setIsScheduled(!!form.values?.is_scheduled);
  }, [form.values?.is_scheduled]);

  useEffect(() => {
    setAllowReferral(!!form.values?.allow_referral_balance_usage);
  }, [form.values?.allow_referral_balance_usage]);

  const handleScheduleChange = (value: boolean) => {
    setIsScheduled(value);
    form.setFieldValue("is_scheduled", value);
  };

  const handleReferralChange = (checked: boolean) => {
    setAllowReferral(checked);
    form.setFieldValue("allow_referral_balance_usage", checked);
  };

  // Grab input props only for fields used in this component
  const nameProps = form.getInputProps("name");
  const descriptionProps = form.getInputProps("description");
  const categoryProps = form.getInputProps("category_id");
  const startDateProps = form.getInputProps("start_date");
  const endDateProps = form.getInputProps("end_date");
  const startTimeProps = form.getInputProps("start_time");
  const endTimeProps = form.getInputProps("end_time");
  const promoProps = form.getInputProps("allow_promo_code_usage", {
    type: "checkbox",
  });
  const minReferralProps = form.getInputProps("minimum_referral_balance_amount");
  const maxReferralProps = form.getInputProps("maximum_referral_balance_amount");
  const ctaProps = form.getInputProps("cta_text");

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
          {...nameProps}
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
          {...descriptionProps}
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
          {...categoryProps}
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
                minDate={new Date()}
                classNames={{ input: "placeholder:text-xs" }}
                {...startDateProps}
                error={form.errors.start_date}
                rightSection={<CiCalendar />}
              />
              <DateInput
                label="End date"
                placeholder="Pick end date"
                required
                minDate={new Date()}
                classNames={{ input: "placeholder:text-xs" }}
                {...endDateProps}
                error={form.errors.end_date}
                rightSection={<CiCalendar />}
              />
            </SimpleGrid>

            <Divider my="md" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TimePicker
                label="Start time"
                withSeconds
                withDropdown
                required
                classNames={{ input: "placeholder:text-xs", dropdown: "text-primary-text" }}
                {...startTimeProps}
              />
              <TimePicker
                label="End time"
                withSeconds
                withDropdown
                required
                classNames={{ input: "placeholder:text-xs" }}
                {...endTimeProps}
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
          {...promoProps}
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
          {/* Don't spread getInputProps here to avoid tethering render cycles to form.values */}
          <Checkbox
            label="Allow referral balance for payment"
            checked={allowReferral}
            onChange={(e) => handleReferralChange(e.currentTarget.checked)}
          />

          {allowReferral && (
            <Card withBorder mt="md" radius="md" className="p-4">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Minimum referral balance amount"
                  type="number"
                  placeholder="Enter minimum amount"
                  classNames={{ input: "placeholder:text-xs" }}
                  {...minReferralProps}
                />
                <TextInput
                  label="Maximum referral balance amount"
                  type="number"
                  placeholder="Enter maximum amount"
                  classNames={{ input: "placeholder:text-xs" }}
                  {...maxReferralProps}
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
            {...ctaProps}
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

// memoize to prevent unnecessary re-renders when parent updates other fields
export default React.memo(BasicInformationInner);
