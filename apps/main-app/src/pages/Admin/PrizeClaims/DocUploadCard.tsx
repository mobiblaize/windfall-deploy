import { Text, Box, Flex, Button, ActionIcon } from "@mantine/core";
import { useRef } from "react";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

type Props = {
  index?: number;
  document?: string; // base64 or URL
  onUpload: (file: File, index?: number) => void;
  onEdit?: (index?: number) => void;
  onDelete?: (index?: number) => void;
  item: DocumentItem;
  isClaimed?: boolean;
};

export interface DocumentItem {
  name: string;
  description?: string;
}

function DocUploadCard({ item, document, index, onUpload, onEdit, onDelete, isClaimed = false }: Props) {
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

  const handleViewDocument = () => {
    if (!document) return;
    
    // If it's already a full URL or data URI, open directly
    if (document.startsWith('http://') || document.startsWith('https://') || document.startsWith('data:')) {
      window.open(document, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // If it's a base64 string (starts with base64-like characters), treat as base64
    // Check if it looks like base64 (alphanumeric, +, /, =)
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (base64Pattern.test(document) && document.length > 100) {
      // Try to determine file type from document name or default to image
      const fileName = item.name?.toLowerCase() || '';
      if (fileName.includes('pdf') || fileName.endsWith('.pdf')) {
        window.open(`data:application/pdf;base64,${document}`, '_blank', 'noopener,noreferrer');
      } else if (fileName.includes('doc') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        // Word documents can't be opened directly in browser, show message
        alert('Word documents cannot be previewed in the browser. Please download the file.');
        return;
      } else {
        // Default to image
        window.open(`data:image/jpeg;base64,${document}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Treat as URL/path and try to open
      window.open(document, '_blank', 'noopener,noreferrer');
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

          {isClaimed ? (
            // Read-only mode: only show eye icon to view document
            document ? (
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDocument();
                }}
                title="View Document"
              >
                <FaEye size={16} />
              </ActionIcon>
            ) : null
          ) : (
            // Edit mode: show edit, delete, and upload buttons
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
          )}
        </Flex>
      </Flex>

      {/* Hidden file input - only show when not claimed */}
      {!isClaimed && (
        <input
          type="file"
          accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}
    </Box>
  );
}

export default DocUploadCard;
