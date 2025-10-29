import { Text, Box, Flex, Button } from "@mantine/core";
import { useRef } from "react";
import { HiDocumentArrowUp } from "react-icons/hi2";

type Props = {
  index?: number;
  src?: string;
  onUpload: (file: File, index?: number) => void;
  item: DocumentItem;
};

export interface DocumentItem {
  name: string;
  description: string;
}

function DocUploadCard({ item, src, index, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, index);
      e.target.value = ""; // reset input
    }
  };

  const isActive = !!src;
  const activeBoxClass = isActive
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
          className={`!inline-flex ${isActive ? "bg-[#a6f4c5]" : "bg-[#ffe3e4]"} p-2 w-fit rounded-full`}
        >
          <HiDocumentArrowUp
            className={`!text-xl ${isActive ? "!text-primary-green" : "!text-primary-red"}`}
          />
        </div>
        <Flex justify="space-between" align={"center"} className="!grow">
          <div>
            <Text tt="capitalize" fw={700} mb={2}>
              {item.name}
            </Text>
            <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
              {item.description}
            </Text>
          </div>

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
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Document
          </Button>
        </Flex>
      </Flex>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
}

export default DocUploadCard;
