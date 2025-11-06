import { Text, Box, Flex, Button, ActionIcon } from "@mantine/core";
import { useRef } from "react";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaTrash, FaEdit } from "react-icons/fa";

type Props = {
  index?: number;
  document?: string; // base64 or URL
  onUpload: (file: File, index?: number) => void;
  onEdit?: (index?: number) => void;
  onDelete?: (index?: number) => void;
  item: DocumentItem;
};

export interface DocumentItem {
  name: string;
  description?: string;
}

function DocUploadCard({ item, document, index, onUpload, onEdit, onDelete }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!validTypes.includes(file.type)) {
        alert("Please select an image (JPG, PNG, GIF, WEBP), PDF, or Word document");
        e.target.value = "";
        return;
      }
      
      onUpload(file, index);
      e.target.value = ""; // reset input
    }
  };

  const isUploaded = !!document;
  const activeBoxClass = isUploaded
    ? "border-primary-green bg-secondary-green"
    : "border-primary-red bg-secondary-red";

  return (
    <Box
      className={`border border-dashed !rounded-lg ${activeBoxClass}`}
      py={"lg"}
      px={"md"}
      my={"lg"}
      // onClick={handleCardClick}
    >
      <Flex justify="flex-start" align={"flex-start"} gap={10}>
        <div
          className={`!inline-flex ${isUploaded ? "bg-[#a6f4c5]" : "bg-[#ffe3e4]"} p-2 w-fit rounded-full`}
        >
          <HiDocumentArrowUp
            className={`!text-xl ${isUploaded ? "!text-primary-green" : "!text-primary-red"}`}
          />
        </div>
        <Flex justify="space-between" wrap="wrap" gap={5} align={"center"} className="!grow">
          <div className="flex-1">
            <Text tt="capitalize" fw={700} mb={2}>
              {item.name}
            </Text>
            {item.description && (
              <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
                {item.description}
              </Text>
            )}
          </div>

          <Flex gap={8} align="center" wrap="wrap">
            {onEdit && (
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(index);
                }}
              >
                <FaEdit size={16} />
              </ActionIcon>
            )}
            {onDelete && (
              <ActionIcon
                variant="subtle"
                color="var(--primary-red)"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              >
                <FaTrash size={16} />
              </ActionIcon>
            )}
            <Button
              variant="white"
              fw={500}
              className="!border !border-[#d0d5dd]"
              size="md"
              rightSection={
                <HiDocumentArrowUp
                  size={16}
                  className="text-primary-red rounded-sm"
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {isUploaded ? "Change Upload" : "Upload Document"}
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
}

export default DocUploadCard;
