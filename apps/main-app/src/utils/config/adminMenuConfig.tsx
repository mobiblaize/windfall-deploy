import {
  IconTicket,
  IconBolt,
  IconCalendarStats,
  IconUsers,
  IconReceipt,
  IconGift,
  IconTrophy,
  IconBell,
  IconHeadset,
  IconShare,
  IconTicketOff,
  IconReportAnalytics,
  IconChartBar,
} from "@tabler/icons-react";

export interface AdminMenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  /**
   * Required module name from PermissionsByModule
   * Used to check if user has view permission for this menu item
   */
  requiredModule: string;
  /**
   * Required permission string (e.g., "game-management-view")
   * Used to check if user has access to this menu item
   */
  requiredPermission: string;
}

export interface AdminMenuSection {
  title: string;
  items: AdminMenuItem[];
}

/**
 * Base admin menu configuration with all available menu items
 * This will be filtered based on user permissions
 */
export const adminMenuConfig: AdminMenuSection[] = [
  {
    title: "Main Menu",
    items: [
      {
        name: "Raffle Management",
        path: "/admin/raffles",
        icon: IconTicket,
        requiredModule: "Game Management",
        requiredPermission: "game-management-view",
      },
      {
        name: "Instant Raffle Management",
        path: "/admin/instant-raffles",
        icon: IconBolt,
        requiredModule: "Game Management",
        requiredPermission: "game-management-view",
      },
      {
        name: "Draw Management",
        path: "/admin/draws",
        icon: IconCalendarStats,
        requiredModule: "Draw Management",
        requiredPermission: "draw-management-view",
      },
      {
        name: "Customer Management",
        path: "/admin/customers",
        icon: IconUsers,
        requiredModule: "Customer Management",
        requiredPermission: "customer-management-view",
      },
      {
        name: "Transaction Management",
        path: "/admin/transactions",
        icon: IconReceipt,
        requiredModule: "Transaction Management",
        requiredPermission: "transaction-management-view",
      },
      {
        name: "Prize Claim",
        path: "/admin/prize-claims",
        icon: IconGift,
        requiredModule: "Prize Management",
        requiredPermission: "prize-management-view",
      },
      {
        name: "Prize Management",
        path: "/admin/prizes",
        icon: IconTrophy,
        requiredModule: "Prize Management",
        requiredPermission: "prize-management-view",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        name: "Notification",
        path: "/admin/notifications",
        icon: IconBell,
        requiredModule: "Notification",
        requiredPermission: "notification-view",
      },
      {
        name: "Customer Support",
        path: "/admin/support",
        icon: IconHeadset,
        requiredModule: "Customer Support",
        requiredPermission: "customer-support-view",
      },
      {
        name: "Referral Program",
        path: "/admin/referrals",
        icon: IconShare,
        requiredModule: "Referral Management",
        requiredPermission: "referral-management-view",
      },
      {
        name: "Promo-Code",
        path: "/admin/promo-codes",
        icon: IconTicketOff,
        requiredModule: "Promo Code Management",
        requiredPermission: "promo-code-management-view",
      },
      {
        name: "User Management",
        path: "/admin/users",
        icon: IconUsers,
        requiredModule: "User Management",
        requiredPermission: "user-management-view",
      },
      {
        name: "Audit Trail",
        path: "/admin/audit",
        icon: IconReportAnalytics,
        requiredModule: "User Management",
        requiredPermission: "user-management-view",
      },
      {
        name: "Report",
        path: "/admin/reports",
        icon: IconChartBar,
        requiredModule: "Report Management",
        requiredPermission: "report-management-view",
      },
    ],
  },
];

