import { Text, Textarea } from "@mantine/core";
import AdminAlertModal from "./Modals/AdminAlertModal";
import { useEffect, useState } from "react";

type CommentsModalProps = {
  title: string;
  description: string;
  label?: string;
  modalOpen: boolean;
  closeModal: () => void;
  initialValue?: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  isLoading?: boolean;
  submitComment: (comment: string) => void;
};

export default function CommentsModal({
  modalOpen,
  isLoading,
  closeModal,
  initialValue = "",
  submitComment,
  primaryButtonLabel = "Submit Comment",
  secondaryButtonLabel = "Close",
  title = "Why Approve ?",
  description = "Enter comments here",
  label = "Comment here",
}: CommentsModalProps) {
  const [comment, setComment] = useState(initialValue);

  useEffect(() => {
    setComment(initialValue);
  }, [initialValue, modalOpen]);

  return (
    <AdminAlertModal
      opened={modalOpen}
      onClose={closeModal}
      size="lg"
      title={<div className="!text-start">{title}</div>}
      description={
        <div className="!text-start -mt-3">
          <Text className="!text-base !text-start !text-[#818181] !mb-5">
            {description}
            <br />
          </Text>

          <Textarea
            label={label}
            required
            placeholder="Provide more context as to why this resolution"
            autosize
            minRows={4}
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            classNames={{ label: "text-xs font-medium capitalize" }}
          />
          <Text fz="xs" mt={4} c="dimmed">
            120 characters, including spaces & punctuation
          </Text>
        </div>
      }
      primaryButton={{
        disabled: !comment || isLoading,
        loading: isLoading,
        label: primaryButtonLabel,
        onClick: () => submitComment(comment),
      }}
      secondaryButton={{
        label: secondaryButtonLabel,
        onClick: closeModal,
      }}
    />
  );
}
