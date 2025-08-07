import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Collapse, ActionIcon } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import {
  IconHome,
  IconInfoCircle,
  IconGift,
  IconTrophy,
  IconCalendarStats,
  IconPhoneCall,
  IconAward,
  IconStar,
} from "@tabler/icons-react";

const menuItems = [
  { name: "Home", path: "/dashboard", icon: IconHome },
  { name: "How it Works", path: "/game-rules", icon: IconInfoCircle },
  { name: "Raffles", path: "/raffles", icon: IconGift },
  { name: "Game Result", path: "/profile/result", icon: IconTrophy },
  { name: "Live Draw", path: "/draws", icon: IconCalendarStats },
  {
    name: "Winners",
    icon: IconAward,
    dropdown: [
      { name: "Recent Winners", path: "/winners/recent" },
      { name: "All Time Winners", path: "/winners/all-time" },
    ],
  },
  { name: "About Us", path: "/about", icon: IconInfoCircle },
  { name: "Prize", path: "/prize", icon: IconStar },
  { name: "Contact Us", path: "/contact-us", icon: IconPhoneCall },
];

export default function SideMenu({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <Box className="w-[250px] bg-black min-h-screen text-white p-4 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Logo + Close */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-2xl font-bold text-white leading-[1.1]">
            <span className="text-white">Windfall</span>
            <span className="text-primary-red">Raffle</span>
            <p className="text-xs text-white text-right">
              Live in - Rent out - Sell up
            </p>
          </div>
          {onClose && (
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={onClose}
              className="text-white"
            >
              <IconX />
            </ActionIcon>
          )}
        </div>

        <div className="text-xs text-[#EBEAEF] uppercase mb-2">Main Menu</div>

        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.dropdown) {
              const isOpen = openDropdown === item.name;
              return (
                <div key={item.name}>
                  <div
                    onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                    className="flex justify-between items-center cursor-pointer px-3 py-2 rounded hover:bg-gray-800 transition"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      {Icon && <Icon size={16} />}
                      {item.name}
                    </div>
                    {isOpen ? (
                      <IconChevronUp size={16} />
                    ) : (
                      <IconChevronDown size={16} />
                    )}
                  </div>
                  <Collapse in={isOpen}>
                    <div className="pl-6 flex flex-col gap-1 mt-1">
                      {item.dropdown.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            clsx(
                              "text-sm px-3 py-2 rounded",
                              isActive || location.pathname === sub.path
                                ? "bg-primary-red text-white"
                                : "hover:bg-gray-700 text-[#EBEAEF]"
                            )
                          }
                          onClick={onClose}
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </Collapse>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded",
                    isActive || location.pathname === item.path
                      ? "bg-primary-red text-white"
                      : "hover:bg-gray-700 text-[#EBEAEF]"
                  )
                }
                onClick={onClose}
              >
                {Icon && <Icon size={16} />}
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="mt-6 text-sm text-center">
        <NavLink
          to="/download-app"
          className="text-[#cdcdcd] hover:text-white transition"
          onClick={onClose}
        >
          🚀 Play on the Go. Download App
        </NavLink>
      </div>
    </Box>
  );
}
