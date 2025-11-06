import { Modal, TextInput, Button, Text, Box, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useEffect } from "react";

interface DocumentModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  isEdit?: boolean;
}

export default function DocumentModal({
  opened,
  onClose,
  onSubmit,
  initialName = "",
  initialDescription = "",
  isEdit = false,
}: DocumentModalProps) {
  
  const form = useForm({
    initialValues: {
      name: initialName,
      description: initialDescription,
    },
    validate: {
      name: (value) => (!value?.trim() ? "Name is required" : null),
    },
  });

  useEffect(() => {
    form.setValues({
      name: initialName,
      description: initialDescription,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialName, initialDescription]);

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values.name.trim(), values.description.trim());
    form.reset();
    onClose();
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      size="lg"
      radius="lg"
      onClose={handleClose}
      withCloseButton={false}
      centered
      title={
        <>
          <Text
            fw={700}
            size="lg"
            className="!text-3xl !font-semibold !mb-4 !text-primary-text"
          >
            {isEdit ? "Edit Document" : "Add Document"}
          </Text>

          <div className="!text-base !text-[#818181] !mb-0 -mt-2">
            Add a document name and description
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <div className="!text-start">
            <TextInput
              label="Document Name"
              placeholder="Enter document name"
              required
              {...form.getInputProps("name")}
              classNames={{
                label: "text-xs font-medium capitalize !text-primary-text",
              }}
            />
          </div>

          <div className="!text-start">
            <Textarea
              label="Document Description (Optional)"
              placeholder="Enter document description"
              {...form.getInputProps("description")}
              autosize
              minRows={4}
              classNames={{
                label: "text-xs font-medium capitalize !text-primary-text",
              }}
            />
            <Text fz="xs" mt={4} c="dimmed">
              120 characters, including spaces & punctuation
            </Text>
          </div>
          <Box className="flex gap-5 justify-end mt-6">
            <Button fullWidth type="button" size="lg" className="!font-medium" variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <CustomButton fullWidth border={false} buttonType="submit" className="!bg-primary-red">
              {isEdit ? "Update" : "Add"}
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
