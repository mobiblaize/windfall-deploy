import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Collapse, ActionIcon, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import clsx from "clsx";

type MenuItem = {
  name: string;
  path?: string;
  icon?: React.ElementType;
  dropdown?: { name: string; path: string }[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type SideMenuProps = {
  menus: MenuSection[];
  hideLink?: boolean;
  onClose?: () => void;
};

function MenuSection({ section, onClose }: { section: MenuSection; onClose?: () => void }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="mb-6">
      <div className="text-xs text-[#EBEAEF] uppercase mb-2">{section.title}</div>

      <div className="flex flex-col gap-2">
        {section.items.map((item) => {
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
                    {Icon && <Icon size={16} className="text-[#FF9798]" />}
                    {item.name}
                  </div>
                  {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </div>
                <Collapse in={isOpen}>
                  <div className="pl-6 flex flex-col gap-1 mt-1">
                    {item.dropdown.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center gap-2 text-sm px-3 py-2 rounded",
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
              to={item.path!}
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
              {({ isActive }) => (
                <>
                  {Icon && (
                    <Icon
                      size={16}
                      className={isActive ? "text-white" : "text-[#FF9798]"}
                    />
                  )}
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default function SideMenu({ menus, onClose, hideLink = false }: SideMenuProps) {
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

        {/* Render all sections - only show sections with items */}
        {menus
          .filter((section) => section.items && section.items.length > 0)
          .map((section) => (
            <MenuSection key={section.title} section={section} onClose={onClose} />
          ))}
        
        {/* Empty state if no sections available */}
        {menus.filter((section) => section.items && section.items.length > 0).length === 0 && (
          <div className="text-center py-8">
            <Text className="text-[#EBEAEF] text-sm">
              No menu items available. Please contact your administrator for access.
            </Text>
          </div>
        )}
      </div>

      {/* Bottom Link */}
      {!hideLink && <div className="mt-6 text-sm text-center">
        <NavLink
          to="/download-app"
          className="text-[#cdcdcd] hover:text-white transition"
          onClick={onClose}
        >
          🚀 Play on the Go. Download App
        </NavLink>
      </div>}
    </Box>
  );
}
