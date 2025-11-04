import { NavLink, useLocation } from "react-router-dom";
import { Box, Text } from "@mantine/core";
import clsx from "clsx";
import { useAdminMenu } from "../utils/hooks/useAdminMenu";

export default function AdminSidebar() {
  const location = useLocation();
  const menuSections = useAdminMenu();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Handle empty state - if no menu sections available
  if (menuSections.length === 0) {
    return (
      <Box className="w-full bg-black overflow-y-auto h-full text-white p-5 flex flex-col justify-center items-center">
        <Text className="text-[#EBEAEF] text-center px-4">
          No menu items available. Please contact your administrator for access.
        </Text>
      </Box>
    );
  }

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
          </div>
        </div>

        {/* Render menu sections */}
        {menuSections.map((section) => (
          <div key={section.title}>
            {/* Section Title */}
            <div className="text-sm lg:text-[14px] text-[#EBEAEF] uppercase tracking-wider mb-3">
              {section.title}
            </div>

            {/* Scrollable menu list */}
            <div className="flex flex-col gap-2">
              {section.items.map((item) => {
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

            {/* Add spacing between sections */}
            {section !== menuSections[menuSections.length - 1] && (
              <div className="mt-6" />
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}
