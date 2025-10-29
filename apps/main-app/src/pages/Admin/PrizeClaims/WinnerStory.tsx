import React from "react";
import { Box } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import TextEditor from "../CreateRaffle/TextEditor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { form: UseFormReturnType<any> };

function WinnerStory({ form }: Props) {
  return (
    <Box>
      <TextEditor form={form} name="sponsorship_details" />
    </Box>
  );
}

// memoize to prevent unnecessary re-renders when parent updates unrelated fields
export default React.memo(WinnerStory);
