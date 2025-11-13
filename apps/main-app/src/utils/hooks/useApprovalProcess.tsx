/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications";
import type { ApprovalStatus } from "../models/approval";
import { usePostData } from "./useApis";

interface ApprovalPayload {
  process_id: string | undefined;
  reason: string;
  status: ApprovalStatus;
}

interface UseApprovalProcessOptions {
  onSuccess?: (response: any, status: ApprovalStatus) => void;
  onError?: (error: any, status: ApprovalStatus) => void;
  showNotifications?: boolean;
}

export const useApprovalProcess = (options?: UseApprovalProcessOptions) => {
  const {
    onSuccess,
    onError,
    showNotifications = true,
  } = options || {};

  const approveProcessMutation = usePostData(
    "admin/workflow-management/approvals/action"
  );

  const approveProcess = async (payload: ApprovalPayload) => {
    const isApprove = payload.status === "approved";

    try {
      const response = await approveProcessMutation.mutateAsync({
        payload,
      });

      if (showNotifications) {
        notifications.show({
          title: "Action Successful",
          message: response?.message || `Game ${payload.status} successfully`,
          color: "green",
        });
      }

      onSuccess?.(response, payload.status);
      return response;
    } catch (error) {
      if (showNotifications) {
        notifications.show({
          title: `Failed to ${isApprove ? "Approve" : "Reject"} Game`,
          message:
            (error as { message?: string })?.message || "An error occurred",
          color: "red",
        });
      }

      onError?.(error, payload.status);
      throw error;
    }
  };

  return {
    approveProcess,
    isPending: approveProcessMutation.isPending,
    isSuccess: approveProcessMutation.isSuccess,
    isError: approveProcessMutation.isError,
    error: approveProcessMutation.error,
    reset: approveProcessMutation.reset,
  };
};