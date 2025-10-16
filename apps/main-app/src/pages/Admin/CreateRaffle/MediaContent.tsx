import {
  Box,
  SimpleGrid,
  Text,
  Divider,
  Button
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import type { UseFormReturnType } from "@mantine/form";
import ImageCard from "./ImageCard";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { form: UseFormReturnType<any> };

function MediaContent({ form }: Props) {
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);

  // ✅ Sync existing form values (useful when editing)
  useEffect(() => {
    const galleryValue = form.values.gallery_images;
    if (galleryValue) {
      const list = galleryValue.split("|").filter(Boolean);
      setGalleryPreviews(list);
    }

    const cardImageValue = form.values.card_image;
    if (cardImageValue) setCardImagePreview(cardImageValue);
  }, [form.values.gallery_images, form.values.card_image]);

  // ✅ Handle card image upload (single)
  const handleCardImageUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file, 1); // limit 1MB
      setCardImagePreview(base64);
      form.setFieldValue("card_image", base64);
      form.clearFieldError("card_image");
    } catch (error) {
      notifications.show({
        title: "Upload failed",
        message: (error as Error).message || "Error uploading card image",
        color: "red",
      });
    }
  };

  // ✅ Handle gallery upload — append new files
  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newBase64List: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const base64 = await fileToBase64(file, 1); // limit 1MB
        newBase64List.push(base64);
      } catch (error) {
        notifications.show({
          title: "Image skipped",
          message: (error as Error).message,
          color: "red",
        });
      }
    }

    const existing = form.values.gallery_images
      ? form.values.gallery_images.split("|").filter(Boolean)
      : [];
    const combined = [...existing, ...newBase64List];

    form.setFieldValue("gallery_images", combined.join("|"));
    setGalleryPreviews(combined);
    form.clearFieldError("gallery_images");
    event.target.value = ""; // reset input
  };

  // ✅ Remove a specific gallery image
  const removeGalleryImage = (index: number) => {
    const updated = [...galleryPreviews];
    updated.splice(index, 1);
    setGalleryPreviews(updated);
    form.setFieldValue("gallery_images", updated.join("|"));
  };

  // ✅ Remove card image
  const removeCardImage = () => {
    setCardImagePreview(null);
    form.setFieldValue("card_image", "");
  };

  return (
    <Box>
      {/* === CARD IMAGE SECTION === */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
        <Box>
          <Text tt="capitalize" fz="md" fw={500}>
            Product card image
          </Text>
          <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
            For raffle list card and explore image
          </Text>
        </Box>

        <ImageCard
          src={cardImagePreview || undefined}
          width={490}
          height={500}
          onUpload={(file) => handleCardImageUpload(file)}
          onDelete={removeCardImage}
        />
      </SimpleGrid>

      {/* 🔴 Inline validation message for card_image */}
      {form.errors.card_image && (
        <Text fz="xs" c="red" mt={4}>
          {form.errors.card_image}
        </Text>
      )}

      <Divider my="lg" />

      {/* === GALLERY IMAGES SECTION === */}
      <Box>
        <Text tt="capitalize" fz="md" fw={500}>
          Gallery images
        </Text>
        <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
          Upload multiple images to display in the raffle gallery.
        </Text>
      </Box>

      <Box mt="md">
        <input
          type="file"
          accept="image/*"
          multiple
          id="gallery-upload"
          style={{ display: "none" }}
          onChange={handleGalleryUpload}
        />
        <Button
          size="xs"
          variant="outline"
          component="label"
          htmlFor="gallery-upload"
        >
          Add Gallery Images
        </Button>
      </Box>

      {galleryPreviews.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
          {galleryPreviews.map((src, index) => (
            <ImageCard
              key={index}
              src={src}
              width={490}
              height={500}
              index={index}
              onUpload={async (file) => {
                try {
                  const base64 = await fileToBase64(file, 1);
                  const updated = [...galleryPreviews];
                  updated[index] = base64;
                  setGalleryPreviews(updated);
                  form.setFieldValue("gallery_images", updated.join("|"));
                  form.clearFieldError("gallery_images");
                } catch (error) {
                  notifications.show({
                    title: "Upload failed",
                    message: (error as Error).message,
                    color: "red",
                  });
                }
              }}
              onDelete={(i) => removeGalleryImage(i as number)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={1} mt="md" spacing="md">
          <ImageCard
            width={490}
            height={500}
            onUpload={async (file) => {
              try {
                const base64 = await fileToBase64(file, 1);
                const updated = [...galleryPreviews, base64];
                setGalleryPreviews(updated);
                form.setFieldValue("gallery_images", updated.join("|"));
                form.clearFieldError("gallery_images");
              } catch (error) {
                notifications.show({
                  title: "Upload failed",
                  message: (error as Error).message,
                  color: "red",
                });
              }
            }}
          />
        </SimpleGrid>
      )}

      {/* 🔴 Inline validation message for gallery_images */}
      {form.errors.gallery_images && (
        <Text fz="xs" c="red" mt={4}>
          {form.errors.gallery_images}
        </Text>
      )}

      <Divider my="lg" />
    </Box>
  );
}

export default MediaContent;
