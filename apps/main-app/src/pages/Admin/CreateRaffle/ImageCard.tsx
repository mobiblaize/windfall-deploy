import { Card, Button, Image, Group, Text } from "@mantine/core";
import { IoIosAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { useRef } from "react";

type Props = {
  src?: string; // base64 or URL
  width?: number; // used only for aspect ratio
  height?: number; // used only for aspect ratio
  index?: number;
  onUpload: (file: File, index?: number) => void;
  onDelete?: (index?: number) => void;
};

function ImageCard({
  src,
  width = 490,
  height = 500,
  index,
  onUpload,
  onDelete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, index);
      e.target.value = ""; // reset input
    }
  };

  // Maintain aspect ratio using padding-bottom trick
  const aspectRatio = (height / width) * 100;

  return (
    <Card
      withBorder
      radius="md"
      style={{
        position: "relative",
        width: "100%", // always fit grid cell width
        overflow: "hidden",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${aspectRatio}%`, // maintain aspect ratio
          backgroundColor: "var(--mantine-color-gray-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {src ? (
          <>
            {/* Uploaded Image */}
            <Image
              src={src}
              alt="Uploaded"
              fit="cover"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
              <Text fw={600} c="white">
                Image Uploaded
              </Text>
              <Text fw={100} fz="xs" c="gray.2" mt={4}>
                Select an Image. Not more than 1MB.
                <br />
                Recommended Size: {width}p × {height}p
              </Text>
              <Button
                variant="white"
                size="xs"
                mt="md"
                rightSection={
                  <IoIosAdd
                    size={18}
                    className="bg-[#f8c6c6] text-primary-red rounded-sm"
                  />
                }
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </Button>
            </div>

            {/* Delete Icon */}
            <Group
              pos="absolute"
              top={8}
              right={8}
              bg="rgba(0,0,0,0.6)"
              p={4}
              style={{ borderRadius: "8px", cursor: "pointer" }}
              onClick={() => onDelete?.(index)}
            >
              <FaTrash size={12} color="white" />
            </Group>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
              style={{ backgroundColor: "var(--mantine-color-gray-0)" }}
            >
              <Text fw={500} c="var(--primary-text)">
                Upload Image
              </Text>
              <Text fw={100} fz="xs" c="var(--secondary-text)" mt={4}>
                Select an Image. Not more than 1MB.
                <br />
                Recommended Size: {width}p × {height}p
              </Text>
              <Button
                variant="outline"
                mt="md"
                rightSection={
                  <IoIosAdd
                    size={20}
                    className="bg-[#f8c6c6] text-primary-red rounded-sm"
                  />
                }
                onClick={() => fileInputRef.current?.click()}
              >
                Select Image
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default ImageCard;
