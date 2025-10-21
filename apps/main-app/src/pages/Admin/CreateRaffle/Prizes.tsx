/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  Box,
  Button,
  Card,
  FileButton,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";
import { notifications } from "@mantine/notifications";

type Props = { form: UseFormReturnType<any> };

function Prizes({ form }: Props) {
  const addPrize = () => {
    const newPrize = {
      name: "",
      quantity: 1,
      prize_cost: 0,
      image: "",
      description: "",
    };
    form.insertListItem("prizes", newPrize);
  };

  const isInstant = !form.values.is_scheduled;
  const prefix = isInstant ? "Instant " : "";

  const removePrize = (index: number) => {
    form.removeListItem("prizes", index);
  };

  const handleFileChange = async (file: File | null, index: number) => {
    if (file) {
      try {
        const base64 = await fileToBase64(file, 1);
        form.setFieldValue(`prizes.${index}.image`, base64);
      } catch (err: any) {
        notifications.show({
          title: "Upload failed",
          message: (err as Error).message,
          color: "red",
        });
      }
    }
  };

  const canAddPrize = isInstant || form.values.prizes.length < 1;

  return (
    <Box>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
        <Box>
          <Text tt="capitalize" fz="md" fw={500}>
            {prefix}Prize
          </Text>
          <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
            Add {isInstant ? "multiple instant" : "a single"} prize
            {isInstant ? "s" : ""} to this raffle game.
          </Text>
        </Box>

        <Box className="space-y-3">
          {form.values.prizes.map((prize: any, index: number) => (
            <Card key={index} withBorder p="sm" radius="md" bg={"#F7F7F9"}>
              <Accordion chevronIconSize={17} defaultValue={`prize-${index}`}>
                <Accordion.Item value={`prize-${index}`}>
                  <Accordion.Control>
                    {prize.name
                      ? `${prefix}Prize ${index + 1}: ${prize.name}`
                      : `${prefix}Prize ${index + 1}`}
                  </Accordion.Control>

                  <Accordion.Panel>
                    <SimpleGrid cols={1} spacing="md" mt="md">
                      {/* Prize Name */}
                      <TextInput
                        label={`${prefix}Prize name`}
                        placeholder="e.g. ₦5,000 Gift Prize"
                        required
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        error={form.errors[`prizes.${index}.name`]}
                        {...form.getInputProps(`prizes.${index}.name`)}
                      />

                      <TextInput
                        label={`${prefix}Prize unit`}
                        placeholder="e.g. 5"
                        type="number"
                        required
                        description="The number of units available to be awarded to players."
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        error={form.errors[`prizes.${index}.quantity`]}
                        {...form.getInputProps(`prizes.${index}.quantity`)}
                      />

                      <TextInput
                        label={`${prefix}Prize cost`}
                        placeholder="e.g. 5000"
                        type="number"
                        required
                        description="The total cost or value of a single prize unit."
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        error={form.errors[`prizes.${index}.prize_cost`]}
                        {...form.getInputProps(`prizes.${index}.prize_cost`)}
                      />

                      {/* Description */}
                      <Textarea
                        label="Prize description"
                        placeholder="Optional description about this prize"
                        autosize
                        minRows={2}
                        classNames={{ label: "text-xs font-medium capitalize" }}
                        {...form.getInputProps(`prizes.${index}.description`)}
                      />

                      {/* Image Upload */}
                      <Box>
                        <Group justify="space-between" mb={4}>
                          <Text
                            tt="capitalize"
                            fz="xs"
                            fw={500}
                            c="var(--mantine-color-gray-8)"
                          >
                            {prefix}Prize image
                            <span className="text-red-500">*</span>
                          </Text>
                        </Group>

                        <Group justify="space-between" align="center" gap="sm">
                          <FileButton
                            onChange={(file) => handleFileChange(file, index)}
                            accept="image/*"
                          >
                            {(props) => (
                              <Button
                                {...props}
                                variant="outline"
                                size="sm"
                                radius="md"
                                className="!border-[#D0D5DD] !text-[#344054]"
                                fullWidth
                              >
                                Upload Image
                              </Button>
                            )}
                          </FileButton>

                          {form.values.prizes[index].image && (
                            <Box
                              w={55}
                              h={55}
                              style={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src={form.values.prizes[index].image}
                                alt={`Prize ${index + 1}`}
                                width="100%"
                                height="100%"
                                fit="cover"
                                radius={0}
                              />
                            </Box>
                          )}
                        </Group>

                        <Text fz="xs" c="var(--secondary-text)" mt={5}>
                          Not more than 1MB
                        </Text>
                      </Box>

                      {form.values.prizes.length > 1 && (
                        <Group justify="flex-end" mt="md">
                          <Button
                            className="!text-primary-red"
                            leftSection={<FaTrash size={12} />}
                            size="xs"
                            variant="light"
                            onClick={() => removePrize(index)}
                          >
                            Remove Prize
                          </Button>
                        </Group>
                      )}
                    </SimpleGrid>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          ))}

          {/* ✅ Add New Prize (conditionally shown) */}
          {canAddPrize && (
            <Flex justify="end">
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
                onClick={addPrize}
              >
                Add New
              </Button>
            </Flex>
          )}

          {typeof form.errors.prizes === "string" && (
            <Text c="red" size="sm" mt="xs">
              {form.errors.prizes}
            </Text>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default Prizes;
