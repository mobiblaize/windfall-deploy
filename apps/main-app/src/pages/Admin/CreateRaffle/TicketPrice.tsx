/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Radio,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { formatCurrency } from "../../../utils/helper/formatCurrency";

type Props = { form: UseFormReturnType<any>; readOnly?: boolean };

function TicketPriceInner({ form, readOnly }: Props) {
  // Local UI state initialized from form once
  const [discountType, setDiscountType] = useState<string>(
    form.values?.discount_type || "straight_line"
  );
  const isReadOnly = !!readOnly;

  // Only update local + form value when user changes discount type
  const handleDiscountTypeChange = useCallback(
    (value: string) => {
      if (isReadOnly) return;
      setDiscountType(value);
      form.setFieldValue("discount_type", value);
      form.setFieldValue("tiers", []);
    },
    [form, isReadOnly]
  );

  // Add & remove tier handlers (stable via useCallback)
  const addTier = useCallback(() => {
    if (isReadOnly) return;
    const newTier = {
      name: "",
      number_of_entry_start: 0,
      number_of_entry_end: 0,
      discount_percentage: 0,
    };
    form.insertListItem("tiers", newTier);
  }, [form, isReadOnly]);

  const removeTier = useCallback(
    (index: number) => {
      if (isReadOnly) return;
      form.removeListItem("tiers", index);
    },
    [form, isReadOnly]
  );

  // Derived values: only depend on the three form fields used
  const prizeCost = Number(form.values?.prize_cost) || 0;
  const markup = Number(form.values?.percentage_markup) || 0;
  const ticketPrice = Number(form.values?.ticket_price) || 0;

  // expectedSales & totalTickets are used for display; keep them in local state
  const [expectedSales, setExpectedSales] = useState<number>(0);
  const [totalTickets, setTotalTickets] = useState<number>(0);

  useEffect(() => {
    const sales = (markup * prizeCost) / 100 + prizeCost;
    const tickets = ticketPrice > 0 ? Math.floor(sales / ticketPrice) : 0;

    setExpectedSales(sales);
    setTotalTickets(tickets);

    // keep total_tickets in form values in sync
    form.setFieldValue("total_tickets", tickets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeCost, markup, ticketPrice]); // only re-run when these specific values change

  // Memoize tiers array to avoid re-computing if unrelated parts of form change
  const tiers = useMemo(() => form.values?.tiers || [], [form.values?.tiers]);

  // Input props for fields used by this component (grab them once)
  const prizeCostProps = form.getInputProps("prize_cost");
  const percentageProps = form.getInputProps("percentage_markup");
  const ticketPriceProps = form.getInputProps("ticket_price");
  const minTicketProps = form.getInputProps("minimum_ticket_number_purchase");
  const maxTicketProps = form.getInputProps("maximum_ticket_number_purchase");

  const isStraightLine = discountType === "straight_line";

  return (
    <Box>
      <Text tt="capitalize" fz={"md"} fw={500}>
        cost breakdown
      </Text>

      {/* === PRIZE COST === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            cost of prize
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Set the cost of prize for this raffle game / draw
          </Text>
        </Box>
        <TextInput
          placeholder="Enter cost of prize"
          type="number"
          classNames={{ input: "placeholder:text-xs" }}
          {...prizeCostProps}
          error={form.errors.prize_cost}
        readOnly={isReadOnly}
        disabled={isReadOnly}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* === MARKUP === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            percentage markup
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            the percentage of the revenue markup
          </Text>
        </Box>
        <TextInput
          placeholder="Enter value in percentage"
          classNames={{ input: "placeholder:text-xs" }}
          type="number"
          {...percentageProps}
          error={form.errors.percentage_markup}
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </SimpleGrid>

      <Box
        className="border-y border-dashed border-primary-red bg-secondary-red"
        py={"sm"}
        px={"md"}
        my={"md"}
      >
        <Center>
          <Box className="text-center">
            <Text tt="capitalize" c="var(--secondary-text)" fz={"sm"}>
              expected sales (cost and profit markup)
            </Text>
            <Text tt="capitalize" fw={500} fz={"lg"}>
              {expectedSales ? formatCurrency(expectedSales) : "---"} ({markup}
              %)
            </Text>
          </Box>
        </Center>
      </Box>

      {/* === TICKET PRICE === */}
      <Text tt="capitalize" fz={"md"} fw={500}>
        ticket pricing breakdown
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            ticket cost
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Ticket cost value of a single game ticket.
          </Text>
        </Box>
        <TextInput
          placeholder="Enter value"
          classNames={{ input: "placeholder:text-xs" }}
          type="number"
          {...ticketPriceProps}
          error={form.errors.ticket_price}
        readOnly={isReadOnly}
        disabled={isReadOnly}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* === TOTAL TICKETS === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            recommend ticket quantity
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Ticket quantity recommended base on cost breakdown.
          </Text>
        </Box>
        <TextInput
          value={`${totalTickets} Tickets`}
          readOnly
        disabled={isReadOnly}
          classNames={{
            input:
              "placeholder:text-xs bg-gray-50 text-gray-700 cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            Minimum Ticket to a Customer
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Minimum number of tickets a customer can purchase
          </Text>
        </Box>
        <div>
          <TextInput
            placeholder="Enter value"
            classNames={{ input: "placeholder:text-xs" }}
            type="number"
            {...minTicketProps}
            error={form.errors.minimum_ticket_number_purchase}
          readOnly={isReadOnly}
          disabled={isReadOnly}
          />

          <Text fz="xs" mt={4} c="dimmed">
            Therefore the minimum x-quantity of tickets that a customer can buy
            in a single checkout for this game
          </Text>
        </div>
      </SimpleGrid>

      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            Maximum Ticket to a Customer
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Maximum number of tickets a customer can purchase
          </Text>
        </Box>
        <div>
          <TextInput
            placeholder="Enter value"
            classNames={{ input: "placeholder:text-xs" }}
            type="number"
            {...maxTicketProps}
            error={form.errors.maximum_ticket_number_purchase}
          readOnly={isReadOnly}
          disabled={isReadOnly}
          />

          <Text fz="xs" mt={4} c="dimmed">
            Therefore the maximum x-quantity of tickets that a customer can buy
            in a single checkout for this game
          </Text>
        </div>
      </SimpleGrid>

      <Divider my="md" />

      {/* === DISCOUNT STRUCTURE === */}
      <Box
        className="border-y border-dashed border-primary-red bg-secondary-red"
        py={"sm"}
        px={"md"}
        my={"md"}
      >
        <Text tt="capitalize" fw={500} fz={"sm"}>
          Raffle Ticketing Discounting Structure
        </Text>
        <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
          Define what percentage of discount is applicable at a certain number
          of ticket purchases.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            Discount Type
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Select a discount type that best applies to this game
          </Text>
        </Box>
        <Box>
          <Radio
            checked={discountType === "straight_line"}
            onChange={() => handleDiscountTypeChange("straight_line")}
            label="Uniform Discount"
            description="Apply the same discount percentage to all ticket purchases regardless of quantity. For example: 10% discount means each ticket costs 10% less, whether buying 1 or 100 tickets."
            disabled={isReadOnly}
          />
          <Radio
            mt={"md"}
            checked={discountType === "band"}
            onChange={() => handleDiscountTypeChange("band")}
            label="Tiered Discount (Volume-based)"
            description="Apply different discount percentages based on ticket quantity purchased. For example: 5% off for 5-10 tickets, 10% off for 11-20 tickets, 15% off for 21+ tickets."
            disabled={isReadOnly}
          />
          {isStraightLine && (
            <Card withBorder mt="md" radius="md" className="!px-8 !py-5">
              <TextInput
                label={`% Discount Applicable`}
                type="number"
                placeholder={`Enter Discount %`}
                classNames={{ input: "placeholder:text-xs" }}
                {...form.getInputProps("discount_percentage")}
                error={form.errors.discount_percentage}
              readOnly={isReadOnly}
              disabled={isReadOnly}
              />
            </Card>
          )}
        </Box>
      </SimpleGrid>
      <Divider my="md" />

      {/* === TIERS SECTION === */}
      {!isStraightLine && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
            <Box>
              <Text tt="capitalize" fz={"md"} fw={500}>
                Discount Tiers
              </Text>
              <Text
                tt="capitalize"
                fw={100}
                fz={"xs"}
                c={"var(--secondary-text)"}
              >
                Define discount ranges based on ticket quantity purchased
              </Text>
            </Box>

            <Box className="space-y-3">
              {tiers.map((tier: any, index: number) => (
                <Card
                  key={index}
                  withBorder
                  p={"sm"}
                  radius="md"
                  bg={"#F7F7F9"}
                >
                  <Accordion chevronIconSize={17}>
                    <Accordion.Item value={`tier-${index}`}>
                      <Accordion.Control>
                        {tier.name || `Tier ${index + 1}`}
                      </Accordion.Control>
                      <Accordion.Panel>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={"md"}>
                          <TextInput
                            label="Tier name"
                            placeholder="e.g. Basic Tier"
                            required
                            classNames={{
                              label: "text-xs font-medium capitalize",
                            }}
                            {...form.getInputProps(`tiers.${index}.name`)}
                            readOnly={isReadOnly}
                            disabled={isReadOnly}
                          />
                          <TextInput
                            label="% discount applicable"
                            placeholder="Enter discount %"
                            required
                            type="number"
                            classNames={{
                              label: "text-xs font-medium capitalize",
                            }}
                            {...form.getInputProps(
                              `tiers.${index}.discount_percentage`
                            )}
                            readOnly={isReadOnly}
                            disabled={isReadOnly}
                          />
                        </SimpleGrid>

                        <SimpleGrid
                          cols={{ base: 1, sm: 2 }}
                          spacing={"md"}
                          mt="md"
                        >
                          <TextInput
                            label="Minimum ticket quantity"
                            placeholder="e.g. 5"
                            type="number"
                            required
                            classNames={{
                              label: "text-xs font-medium capitalize",
                            }}
                            {...form.getInputProps(
                              `tiers.${index}.number_of_entry_start`
                            )}
                            readOnly={isReadOnly}
                            disabled={isReadOnly}
                          />
                          <TextInput
                            label="Maximum ticket quantity"
                            placeholder="e.g. 10"
                            type="number"
                            required
                            classNames={{
                              label: "text-xs font-medium capitalize",
                            }}
                            {...form.getInputProps(
                              `tiers.${index}.number_of_entry_end`
                            )}
                            readOnly={isReadOnly}
                            disabled={isReadOnly}
                          />
                        </SimpleGrid>

                        {!isReadOnly && (
                          <Group justify="flex-end" mt="md">
                            <Button
                              leftSection={<FaTrash size={12} />}
                              className="!text-primary-red"
                              size="xs"
                              variant="light"
                              onClick={() => removeTier(index)}
                            >
                              Remove Tier
                            </Button>
                          </Group>
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card>
              ))}

              {!isReadOnly && (
                <Flex justify={"end"}>
                  <Button
                    rightSection={
                      <div className="!inline-flex !bg-[#ffacad] p-1 w-fit rounded-md">
                        <BsPlus className="!text-xl !text-primary-red" />
                      </div>
                    }
                    size="md"
                    variant="outline"
                    radius="md"
                    className="!border-[#D0D5DD]"
                    onClick={addTier}
                  >
                    Add New
                  </Button>
                </Flex>
              )}
              {form.errors.tiers && (
                <Text c="red" size="sm" mt="xs">
                  {form.errors.tiers}
                </Text>
              )}
            </Box>
          </SimpleGrid>

          <Divider my="lg" />
        </>
      )}
    </Box>
  );
}

// Memoize the component to prevent unnecessary re-renders when parent changes unrelated fields
export default React.memo(TicketPriceInner);
