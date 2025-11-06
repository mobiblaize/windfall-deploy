/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, SimpleGrid, Text, Divider, Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { UseFormReturnType } from "@mantine/form";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";
import ImageCard from "../CreateRaffle/ImageCard";

type Props = { form: UseFormReturnType<any> };
type GalleryItem = { id: string; src: string };

const makeId = (prefix = "") =>
  `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function MediaContentInner({ form }: Props) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // cache of last synced array between form <-> local
  const lastSyncedGalleryRef = useRef<string | null>(null);

  // initialize from form values — but only update if different from cache
  useEffect(() => {
    const mediaValue: string[] = Array.isArray(form.values.media) ? form.values.media : [];
    const mediaValueString = JSON.stringify(mediaValue);

    // If this value equals last synced, nothing to do
    if (lastSyncedGalleryRef.current === mediaValueString) {
      return;
    }

    // parse into items
    if (mediaValue.length > 0) {
      const items = mediaValue.map((src, idx) => ({
        id: `${idx}-${src.slice(0, 8)}`,
        src,
      }));
      setGalleryItems(items);
    } else {
      setGalleryItems([]);
    }
    // update cache to reflect we accepted this form value
    lastSyncedGalleryRef.current = mediaValueString;
  }, [form.values.media]);

  // Sync local galleryItems -> form but only when the array differs from cache
  useEffect(() => {
    const newMedia = galleryItems.map((i) => i.src);
    const newMediaString = JSON.stringify(newMedia);
    // If identical to last synced, do nothing
    if (lastSyncedGalleryRef.current === newMediaString) return;

    // otherwise sync to form and update cache
    form.setFieldValue("media", newMedia);
    form.clearFieldError("media");
    lastSyncedGalleryRef.current = newMediaString;
    // form is stable, it's fine in deps
  }, [galleryItems, form]);

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
  const handleReplaceGalleryImage = useCallback(
    async (index: number, file: File) => {
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
    },
    []
  );

  // Remove a specific gallery image (by index)
  const removeGalleryImage = useCallback((index: number) => {
    setGalleryItems((prev) => {
      const updated = prev.slice();
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // Memoized handlers for ImageCard callbacks
  const handleImageCardUpload = useCallback(
    async (index: number, file: File) => {
      await handleReplaceGalleryImage(index, file);
    },
    [handleReplaceGalleryImage]
  );

  const handleImageCardDelete = useCallback(
    (index: number) => {
      removeGalleryImage(index);
    },
    [removeGalleryImage]
  );

  const handleEmptyImageCardUpload = useCallback(
    async (file: File) => {
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
    },
    []
  );

  const hasGallery = useMemo(
    () => galleryItems.length > 0,
    [galleryItems.length]
  );

  return (
    <Box>

      <Box
        className="border-y border-dashed border-primary-red bg-secondary-red"
        py={"sm"}
        px={"md"}
        my={"md"}
      >
        <Text tt="capitalize" fw={700}>
          Winner's Story Media
        </Text>
        <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
          Upload media for raffle winner story
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
          Add Images
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
              onUpload={(file: File) => handleImageCardUpload(index, file)}
              onDelete={() => handleImageCardDelete(index)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
          <ImageCard
            width={490}
            height={500}
            onUpload={handleEmptyImageCardUpload}
          />
        </SimpleGrid>
      )}

      {form.errors.media && (
        <Text fz="xs" c="red" mt={4}>
          {form.errors.media}
        </Text>
      )}
      
      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Upload Video 
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Enter video url here.
          </Text>
        </Box>
        <Box>
          <TextInput
            placeholder="Enter video url"
            {...form.getInputProps("video_url")}
            classNames={{ input: "placeholder:text-xs" }}
          />
        </Box>
      </SimpleGrid>

      <Divider my="lg" />
    </Box>
  );
}

export default React.memo(MediaContentInner);
