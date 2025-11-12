import React, { useState, useRef, useEffect } from "react";
import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { ApprovalProcess } from "../utils/models/approval";

// Types

interface StatusConfig {
  color: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

interface OfficerCardProps {
  officer: ApprovalProcess;
}

interface ApprovalOfficersTooltipProps {
  officers: ApprovalProcess[];
  children: React.ReactNode;
}

// Status badge configuration
const getStatusConfig = (status: ApprovalProcess["status"]): StatusConfig => {
  const configs: Record<ApprovalProcess["status"], StatusConfig> = {
    approved: {
      color: "green",
      label: "Approved",
      icon: IconCircleCheck,
      bgClass: "bg-green-100",
      textClass: "text-green-700",
      borderClass: "border-green-200",
    },
    rejected: {
      color: "red",
      label: "Rejected",
      icon: IconCircleX,
      bgClass: "bg-red-100",
      textClass: "text-red-700",
      borderClass: "border-red-200",
    },
    pending: {
      color: "yellow",
      label: "Pending",
      icon: IconClock,
      bgClass: "bg-yellow-100",
      textClass: "text-yellow-700",
      borderClass: "border-yellow-200",
    },
    awaiting: {
      color: "gray",
      label: "Awaiting",
      icon: IconAlertCircle,
      bgClass: "bg-gray-100",
      textClass: "text-gray-700",
      borderClass: "border-gray-200",
    },
  };
  return configs[status] || configs.pending;
};

// Individual officer card
const OfficerCard: React.FC<OfficerCardProps> = ({ officer }) => {
  const statusConfig = getStatusConfig(officer.status);
  const StatusIcon = statusConfig.icon;

  // Format date if available
  const formatDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex gap-3 items-start">
        <img
          src={officer.avatar}
          alt={officer.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {officer.name}
            </div>
            <div className="text-xs text-gray-500">{officer.level_name}</div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${statusConfig.bgClass} border ${statusConfig.borderClass}`}
          >
            <StatusIcon size={14} className={statusConfig.textClass} />
            <span className={`text-xs font-medium ${statusConfig.textClass}`}>
              {statusConfig.label}
            </span>
          </div>

          {officer.reason && (
            <div className="bg-gray-50 px-2 py-1.5 rounded border-l-2 border-gray-300">
              <div className="text-xs text-gray-600 italic">
                "{officer.reason}"
              </div>
            </div>
          )}

          {officer.updated_at && (
            <div className="text-xs text-gray-500">
              {formatDate(officer.updated_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main tooltip component
const ApprovalOfficersTooltip: React.FC<ApprovalOfficersTooltipProps> = ({
  officers,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowOffset, setArrowOffset] = useState<number>(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const trigger = triggerRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      const tooltipWidth = 320; // 80 * 4 = 320px (w-80)
      const padding = 8; // Minimum padding from viewport edges
      
      // Calculate the ideal centered position
      const idealLeft = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
      
      // Calculate the maximum left position that keeps tooltip in viewport
      const maxLeft = viewportWidth - tooltipWidth - padding;
      
      // Calculate the final left position
      const finalLeft = Math.max(padding, Math.min(idealLeft, maxLeft));
      
      // Calculate arrow offset from center
      const triggerCenter = triggerRect.left + (triggerRect.width / 2);
      const tooltipLeftEdge = finalLeft;
      const arrowPos = triggerCenter - tooltipLeftEdge;
      
      setTooltipStyle({
        left: `${finalLeft}px`,
        transform: 'none'
      });
      
      setArrowOffset(arrowPos);
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          className="fixed z-50 w-80 max-w-[calc(100vw-16px)] mt-2"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Arrow */}
            <div 
              className="absolute -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"
              style={{ left: `${arrowOffset}px`, marginLeft: '-8px' }}
            ></div>

            <div className="max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
                <div className="text-sm font-semibold text-gray-900">
                  Approval Process
                </div>
                <div className="text-xs text-gray-500">
                  {officers.length}{" "}
                  {officers.length === 1 ? "approver" : "approvers"}
                </div>
              </div>

              <div className="p-2 space-y-1">
                {officers.length === 0 ? (
                  <div className="p-8 text-center">
                    <IconAlertCircle
                      size={32}
                      className="text-gray-400 mx-auto mb-2"
                    />
                    <div className="text-sm text-gray-600 font-medium">
                      No approvers assigned
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      This request is yet to be approved.
                    </div>
                  </div>
                ) : (
                  officers.map((officer, index) => (
                    <React.Fragment key={officer.approval_request_id}>
                      <OfficerCard officer={officer} />
                      {index < officers.length - 1 && (
                        <div className="border-b border-gray-100 mx-2"></div>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalOfficersTooltip;
export type { ApprovalProcess, ApprovalOfficersTooltipProps };