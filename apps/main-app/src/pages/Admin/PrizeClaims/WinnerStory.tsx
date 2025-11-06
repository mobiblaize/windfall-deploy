import React from "react";
import { Box, TextInput, Divider, SimpleGrid, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import TextEditor from "../CreateRaffle/TextEditor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { form: UseFormReturnType<any> };

function WinnerStory({ form }: Props) {
  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Testimonial Summary <span className="text-red-500">*</span>
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enter short summary of the winner's story
          </Text>
        </Box>
        <Box>
          <TextInput 
            placeholder="Enter short summary"
            {...form.getInputProps("testimonial_short_description")}
            error={form.errors.testimonial_short_description}
          />
        </Box>
      </SimpleGrid>
      <Divider my="md" />
    <Box
      className="border-y border-dashed border-primary-red bg-secondary-red"
      py={"sm"}
      px={"md"}
      my={"md"}
    >
      <Text tt="capitalize" fw={700}>
        Winner's Story
      </Text>
      <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
        Customize full details of the winner's story here
      </Text>
    </Box>
      <Box>
        <TextEditor form={form} name="testimonial" />
      </Box>
    </>
  );
}

// memoize to prevent unnecessary re-renders when parent updates unrelated fields
export default React.memo(WinnerStory);
