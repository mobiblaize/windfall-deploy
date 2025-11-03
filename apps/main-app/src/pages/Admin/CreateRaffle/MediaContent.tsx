/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, SimpleGrid, Text, Divider, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { UseFormReturnType } from "@mantine/form";
import ImageCard from "./ImageCard";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";

type Props = { form: UseFormReturnType<any> };
type GalleryItem = { id: string; src: string };

const makeId = (prefix = "") =>
  `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function MediaContentInner({ form }: Props) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);

  // cache of last synced pipe-string between form <-> local
  const lastSyncedGalleryRef = useRef<string | null>(null);

  // initialize from form values — but only update if different from cache
  useEffect(() => {
    const galleryValue: string = form.values.gallery_images;
    const galleryValueNormalized = galleryValue ? galleryValue : "";

    // If this value equals last synced, nothing to do (prevents unnecessary setState)
    if (lastSyncedGalleryRef.current === galleryValueNormalized) {
      // still sync card image if necessary below
    } else {
      // parse into items
      if (galleryValueNormalized) {
        const list = galleryValueNormalized.split("|").filter(Boolean);
        const items = list.map((src, idx) => ({
          id: `${idx}-${src.slice(0, 8)}`,
          src,
        }));
        setGalleryItems(items);
      } else {
        setGalleryItems([]);
      }
      // update cache to reflect we accepted this form value
      lastSyncedGalleryRef.current = galleryValueNormalized;
    }

    // card image: update local preview if different
    const cardImageValue = form.values.card_image ?? "";
    if (cardImageValue !== (cardImagePreview ?? "")) {
      setCardImagePreview(cardImageValue || null);
    }
    // note: we deliberately do NOT set form here (we're only reading)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.gallery_images, form.values.card_image]); // safe deps

  // Sync local galleryItems -> form but only when the pipe-string differs from cache
  useEffect(() => {
    const newPipe = galleryItems.map((i) => i.src).join("|");
    // If identical to last synced string, do nothing
    if (lastSyncedGalleryRef.current === newPipe) return;

    // otherwise sync to form and update cache
    form.setFieldValue("gallery_images", newPipe);
    form.clearFieldError("gallery_images");
    lastSyncedGalleryRef.current = newPipe;
    // form is stable, it's fine in deps
  }, [galleryItems, form]);

  // Card image upload (single)
  const handleCardImageUpload = useCallback(
    async (file: File) => {
      try {
        const base64 = await fileToBase64(file, 1); // 1MB limit
        setCardImagePreview(base64);
        // directly update form for card_image (no two-way loop here)
        form.setFieldValue("card_image", base64);
        form.clearFieldError("card_image");
      } catch (error) {
        notifications.show({
          title: "Upload failed",
          message: (error as Error).message || "Error uploading card image",
          color: "red",
        });
      }
    },
    [form]
  );

  const removeCardImage = useCallback(() => {
    setCardImagePreview(null);
    form.setFieldValue("card_image", "");
  }, [form]);

  // Handle gallery upload — capture input before any await
  const handleGalleryUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const files = input.files;
      if (!files) return;

      const newItems: GalleryItem[] = [];

      for (const file of Array.from(files)) {
        try {
          const base64 = await fileToBase64(file, 1);
          newItems.push({ id: makeId("g-"), src: base64 });
        } catch (error) {
          notifications.show({
            title: "Image skipped",
            message: (error as Error).message || "Error processing image",
            color: "red",
          });
        }
      }

      // update local state only; syncing to form occurs inside the effect above
      setGalleryItems((prev) => [...prev, ...newItems]);

      // reset input safely (we captured 'input' earlier)
      input.value = "";
    },
    []
  );

  // Replace an existing gallery image (by index)
  const handleReplaceGalleryImage = useCallback(async (index: number, file: File) => {
    try {
      const base64 = await fileToBase64(file, 1);
      setGalleryItems((prev) => {
        const next = prev.slice();
        next[index] = { id: next[index]?.id ?? makeId("g-"), src: base64 };
        return next;
      });
    } catch (error) {
      notifications.show({
        title: "Upload failed",
        message: (error as Error).message || "Error uploading gallery image",
        color: "red",
      });
    }
  }, []);

  // Remove a specific gallery image (by index)
  const removeGalleryImage = useCallback((index: number) => {
    setGalleryItems((prev) => {
      const updated = prev.slice();
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const hasGallery = useMemo(() => galleryItems.length > 0, [galleryItems.length]);

  return (
    <Box>
      {/* CARD IMAGE */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
        <Box>
          <Text tt="capitalize" fz="md" fw={500}>
            Product card image <span style={{ color: "red" }}>*</span>
          </Text>
          <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
            For raffle list card and explore image
          </Text>
          {form.errors.card_image && (
            <Text fz="sm" c="red" mt="xs" fw={500}>
              {form.errors.card_image}
            </Text>
          )}
        </Box>

        <ImageCard
          src={cardImagePreview || undefined}
          width={490}
          height={500}
          onUpload={(file: File) => handleCardImageUpload(file)}
          onDelete={removeCardImage}
        />
      </SimpleGrid>

      <Divider my="lg" />

      {/* GALLERY */}
      <Box>
        <Text tt="capitalize" fz="md" fw={500}>
          Gallery images <span style={{ color: "red" }}>*</span>
        </Text>
        <Text tt="capitalize" fw={100} fz="xs" c="var(--secondary-text)">
          Upload multiple images to display in the raffle gallery.
        </Text>
        {form.errors.gallery_images && (
          <Text fz="sm" c="red" mt="xs" fw={500}>
            {form.errors.gallery_images}
          </Text>
        )}
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
        <Button size="xs" variant="outline" component="label" htmlFor="gallery-upload">
          Add Gallery Images
        </Button>
      </Box>

      {hasGallery ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
          {galleryItems.map((item, index) => (
            <ImageCard
              key={item.id}
              src={item.src}
              width={490}
              height={500}
              index={index}
              onUpload={async (file: File) => {
                await handleReplaceGalleryImage(index, file);
              }}
              onDelete={() => removeGalleryImage(index)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
          <ImageCard
            width={490}
            height={500}
            onUpload={async (file: File) => {
              try {
                const base64 = await fileToBase64(file, 1);
                const newItem = { id: makeId("g-"), src: base64 };
                setGalleryItems((prev) => {
                  const updated = [...prev, newItem];
                  return updated;
                });
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

      <Divider my="lg" />
    </Box>
  );
}

export default React.memo(MediaContentInner);
