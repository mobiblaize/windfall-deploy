/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Divider,
  SimpleGrid,
  TextInput,
  Text,
  Button,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import DocUploadCard from "./DocUploadCard";
import EmptySection from "../../../components/EmptySection";
import DocumentModal from "./DocumentModal";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";
import { notifications } from "@mantine/notifications";

interface DocumentChecklistItem {
  name: string;
  description?: string;
  document: string;
}

type Props = { form: UseFormReturnType<any>; isClaimed: boolean };

function DocumentUploadInner({ form, isClaimed }: Props) {
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const documentChecklist: DocumentChecklistItem[] =
    form.values.document_checklist || [];

  const handleAddDocument = (name: string, description: string) => {
    const newItem: DocumentChecklistItem = {
      name,
      description,
      document: "",
    };
    const updated = [...documentChecklist, newItem];
    form.setFieldValue("document_checklist", updated);
    form.clearFieldError("document_checklist");
  };

  const handleEditDocument = (index?: number) => {
    if (index === undefined) return;
    setEditingIndex(index);
    setDocumentModalOpen(true);
  };

  const handleUpdateDocument = (name: string, description: string) => {
    if (editingIndex === null) return;

    const updated = [...documentChecklist];
    updated[editingIndex] = {
      ...updated[editingIndex],
      name,
      description,
    };
    form.setFieldValue("document_checklist", updated);
    form.clearFieldError("document_checklist");
    setEditingIndex(null);
  };

  const handleDeleteDocument = (index?: number) => {
    if (index === undefined) return;
    const updated = documentChecklist.filter((_, i) => i !== index);
    form.setFieldValue("document_checklist", updated);
    form.clearFieldError("document_checklist");
  };

  const handleUploadDocument = async (file: File, index?: number) => {
    if (index === undefined) return;
    try {
      const base64 = await fileToBase64(file);
      const updated = [...documentChecklist];
      updated[index] = {
        ...updated[index],
        document: base64,
      };
      form.setFieldValue("document_checklist", updated);
      form.clearFieldError("document_checklist");
    } catch (error) {
      notifications.show({
        title: "Upload Failed",
        message: (error as Error).message || "Error uploading document",
        color: "red",
      });
    }
  };

  const handleModalSubmit = (name: string, description: string) => {
    if (editingIndex !== null) {
      handleUpdateDocument(name, description);
    } else {
      handleAddDocument(name, description);
    }
  };

  const handleCloseModal = () => {
    setDocumentModalOpen(false);
    setEditingIndex(null);
  };

  return (
    <Box>

      {documentChecklist.length > 0 ? (
        documentChecklist.map((item, idx) => (
          <DocUploadCard
            key={idx}
            item={item}
            document={item.document}
            index={idx}
            onUpload={handleUploadDocument}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
            isClaimed={isClaimed}
          />
        ))
      ) : (
        !isClaimed && (
          <EmptySection
            title={"No Documents"}
            format="secondary"
            description={
              "No documents added yet. Click 'Add Document' to add one."
            }
          />
        )
      )}

      {form.errors.document_checklist && (
        <Text fz="xs" c="red" mt={4} mb="md">
          {form.errors.document_checklist}
        </Text>
      )}
      
      {!isClaimed && (
        <Box className="mb-4">
          <Button
            variant="outline"
            onClick={() => setDocumentModalOpen(true)}
            size="sm"
          >
            Add Document
          </Button>
        </Box>
      )}

      {isClaimed && (
        <>
          <Divider my="md" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
            <Box>
              <Text tt="capitalize" fw={700}>
                Claim Officer
              </Text>
              <Text
                tt="capitalize"
                fw={100}
                fz={"xs"}
                c={"var(--secondary-text)"}
              >
                The officer processing this claim
              </Text>
            </Box>
            <TextInput
              placeholder="Claim Officer"
              value={form.values.claim_officer || ""}
              readOnly
              classNames={{
                input:
                  "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
              }}
            />
          </SimpleGrid>
        </>
      )}

      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Description <span className="text-red-500">*</span>
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enter short description
          </Text>
        </Box>
        <Box>
          <TextInput
            readOnly={isClaimed}
            placeholder="Enter short description"
            {...form.getInputProps("short_description")}
            error={form.errors.short_description}
          />
        </Box>
      </SimpleGrid>

      <DocumentModal
        opened={documentModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialName={
          editingIndex !== null ? documentChecklist[editingIndex]?.name : ""
        }
        initialDescription={
          editingIndex !== null
            ? documentChecklist[editingIndex]?.description || ""
            : ""
        }
        isEdit={editingIndex !== null}
      />

      <Divider my="md" />
    </Box>
  );
}

export default React.memo(DocumentUploadInner);
