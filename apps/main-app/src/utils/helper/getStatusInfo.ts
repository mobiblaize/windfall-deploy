import type { StatusType } from "../../components/CustomBadge";
import type { ApprovalStatus } from "../models/approval";

export default function getApprovalStatusInfo(status?: ApprovalStatus): {
    status: StatusType;
    label: string;
  } {
    if (!status) return { status: "pending" as const, label: "Loading" };

    if (status==='pending')
      return { status: "pending" as const, label: "Pending Approval" };

    return {
      status:
        status === "approved"
          ? "successful"
          : ("failed" as const),
      label: status,
    };
  };