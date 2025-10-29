/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import type { DocumentItem } from "./DocUploadCard";
import DocUploadCard from "./DocUploadCard";
import EmptySection from "../../../components/EmptySection";

const documents: DocumentItem[] = [
  {
    name: "Valid Government-Issued ID",
    description:
      "International Passport, Driver's License, National ID, or Voter's Card",
  },
  {
    name: "Proof of Entry or Ticket Confirmation",
    description: "e-ticket, entry number, or official email/SMS confirmation",
  },
  {
    name: "Proof of Address",
    description:
      "Recent utility bill, tenancy agreement, or official bank statement",
  },
  {
    name: "Passport Photograph",
    description: "or public announcement, press, or internal records",
  },
];

type Props = { form: UseFormReturnType<any> };

function DocumentUploadInner({ form }: Props) {
  console.log(form.values);

  return (
    <Box>
      {documents.map((doc, idx) => (
        <DocUploadCard item={doc} index={idx} onUpload={() => {}} />
      ))}

      {!documents?.length && (
        <EmptySection
          title={"No Uploads"}
          format="secondary"
          description={"No documents upload required"}
        />
      )}
    </Box>
  );
}

export default React.memo(DocumentUploadInner);
