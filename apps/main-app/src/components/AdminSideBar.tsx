import { NavLink, useLocation } from "react-router-dom";
import { Box } from "@mantine/core";
import clsx from "clsx";
import {
  IconHome,
  IconTicket,
  IconBolt,
  IconCalendarStats,
  IconUsers,
  IconReceipt,
  IconGift,
  // IconTrophy,
  IconBell,
  IconHeadset,
  IconShare,
  IconTicketOff,
  IconReportAnalytics,
  IconChartBar,
} from "@tabler/icons-react";

const mainMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: IconHome },
  { name: "Raffle Management", path: "/admin/raffles", icon: IconTicket },
  { name: "Instant Raffle", path: "/admin/instant-raffles", icon: IconBolt },
  { name: "Draw Management", path: "/admin/draws", icon: IconCalendarStats },
  { name: "Customer Management", path: "/admin/customers", icon: IconUsers },
  {
    name: "Transaction Management",
    path: "/admin/transactions",
    icon: IconReceipt,
  },
  { name: "Prize Claim", path: "/admin/prize-claims", icon: IconGift },
  // { name: "Prize Management", path: "/admin/prizes", icon: IconTrophy },
];

const otherMenu = [
  { name: "Notification", path: "/admin/notifications", icon: IconBell },
  // { name: "Dashboard", path: "/admin/dashboard", icon: IconHome },
  { name: "Customer Support", path: "/admin/support", icon: IconHeadset },
  { name: "Referral Program", path: "/admin/referrals", icon: IconShare },
  { name: "Promo-Code", path: "/admin/promo-codes", icon: IconTicketOff },
  { name: "User Management", path: "/admin/users", icon: IconUsers },
  { name: "Audit Trail", path: "/admin/audit", icon: IconReportAnalytics },
  { name: "Report", path: "/admin/reports", icon: IconChartBar },
];

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Box className="w-full bg-black overflow-y-auto h-full text-white p-5 flex flex-col justify-between">
      {/* Top */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="font-bold text-white text-[35px] leading-[1.1] lg:text-[40px] md:leading-[40px]">
              <span className="text-white">Windfall</span>
              <span className="text-primary-red">Raffle</span>
              <p className="text-xs lg:text-sm text-white text-right">
                Live in - Rent out - Sell up
              </p>
            </div>
            {/* <div className="text-xs text-[#EBEAEF] mt-1">Live in - Rent out - Sell up</div> */}
          </div>
        </div>

        {/* Main Menu Title */}
        <div className="text-sm lg:text-[14px] text-[#EBEAEF] uppercase tracking-wider mb-3">
          Main Menu
        </div>

        {/* Scrollable menu list */}
        <div className="flex flex-col gap-2">
          {mainMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navIsActive }) =>
                  clsx(
                    "flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition",
                    navIsActive || isActive(item.path)
                      ? "bg-primary-red text-white"
                      : "hover:bg-gray-800 text-[#EBEAEF]"
                  )
                }
              >
                <span
                  className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    isActive(item.path) ? "text-white" : "text-[#FF9798]"
                  )}
                >
                  {Icon && <Icon size={20} />}
                </span>
                <span className="flex-1 lg:text-base">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Others section */}
        <div className="text-sm lg:text-[14px] text-[#EBEAEF] uppercase tracking-wider mt-6 mb-3">
          Others
        </div>

        <div className="flex flex-col gap-2">
          {otherMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navIsActive }) =>
                  clsx(
                    "flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition",
                    navIsActive || isActive(item.path)
                      ? "bg-primary-red text-white"
                      : "hover:bg-gray-800 text-[#EBEAEF]"
                  )
                }
              >
                <span
                  className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    isActive(item.path) ? "text-white" : "text-[#FF9798]"
                  )}
                >
                  {Icon && <Icon size={20} />}
                </span>
                <span className="flex-1 lg:text-base">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </Box>
  );
}
