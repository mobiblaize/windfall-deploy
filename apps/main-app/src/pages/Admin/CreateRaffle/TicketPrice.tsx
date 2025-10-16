/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = { form: UseFormReturnType<any> };

function TicketPrice({ form }: Props) {
  const addTier = () => {
    const newTier = {
      name: "",
      number_of_entry_start: 0,
      number_of_entry_end: 0,
      discount_percentage: 0,
    };
    form.insertListItem("tiers", newTier);
  };

  const removeTier = (index: number) => {
    form.removeListItem("tiers", index);
  };

  const expectedSales =
    (Number(form.values?.percentage_markup) * Number(form.values?.prize_cost)) /
      100 +
    Number(form.values?.prize_cost);

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
          {...form.getInputProps("prize_cost")}
          error={form.errors.prize_cost}
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
          {...form.getInputProps("percentage_markup")}
          error={form.errors.percentage_markup}
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
              {(expectedSales || "---").toLocaleString()} (
              {form.values?.percentage_markup}%)
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
          {...form.getInputProps("ticket_price")}
          error={form.errors.ticket_price}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* === TOTAL TICKETS === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            Total ticket quantity
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Total available ticket quantity for this game.
          </Text>
        </Box>
        <TextInput
          placeholder="Enter total ticket quantity"
          classNames={{ input: "placeholder:text-xs" }}
          type="number"
          {...form.getInputProps("total_tickets")}
          error={form.errors.total_tickets}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* === MIN/MAX TICKET PURCHASE LIMITS === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <TextInput
          label="Minimum Ticket Number Purchase"
          placeholder="e.g. 1"
          type="number"
          classNames={{ label: "text-xs font-medium capitalize" }}
          {...form.getInputProps("minimum_ticket_number_purchase")}
          error={form.errors.minimum_ticket_number_purchase}
        />
        <TextInput
          label="Maximum Ticket Number Purchase"
          placeholder="e.g. 10"
          type="number"
          classNames={{ label: "text-xs font-medium capitalize" }}
          {...form.getInputProps("maximum_ticket_number_purchase")}
          error={form.errors.maximum_ticket_number_purchase}
        />
      </SimpleGrid>

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

      {/* === TIERS SECTION === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing={"md"}>
        <Box>
          <Text tt="capitalize" fz={"md"} fw={500}>
            Discount hierarchy
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Create discount structure tiers.
          </Text>
        </Box>

        <Box className="space-y-3">
          {form.values.tiers.map((tier: any, index: number) => (
            <Card key={index} withBorder p={"sm"} radius="md">
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
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        {...form.getInputProps(`tiers.${index}.name`)}
                      />
                      <TextInput
                        label="% discount applicable"
                        placeholder="Enter discount %"
                        required
                        type="number"
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        {...form.getInputProps(
                          `tiers.${index}.discount_percentage`
                        )}
                      />
                    </SimpleGrid>

                    <SimpleGrid
                      cols={{ base: 1, sm: 2 }}
                      spacing={"md"}
                      mt="md"
                    >
                      <TextInput
                        label="Minimum ticket range"
                        placeholder="e.g. 5"
                        type="number"
                        required
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        {...form.getInputProps(
                          `tiers.${index}.number_of_entry_start`
                        )}
                      />
                      <TextInput
                        label="Maximum ticket range"
                        placeholder="e.g. 10"
                        type="number"
                        required
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        {...form.getInputProps(
                          `tiers.${index}.number_of_entry_end`
                        )}
                      />
                    </SimpleGrid>

                    <Group justify="flex-end" mt="md">
                      <Button
                        leftSection={<FaTrash size={12} />}
                        color="red"
                        size="xs"
                        variant="light"
                        onClick={() => removeTier(index)}
                      >
                        Remove Tier
                      </Button>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          ))}

          <Button
            leftSection={<FaPlus size={12} />}
            size="xs"
            variant="outline"
            onClick={addTier}
          >
            Add Discount Tier
          </Button>
          {form.errors.tiers && (
            <Text c="red" size="sm" mt="xs">
              {form.errors.tiers}
            </Text>
          )}
        </Box>
      </SimpleGrid>

      <Divider my="lg" />
    </Box>
  );
}

export default TicketPrice;
