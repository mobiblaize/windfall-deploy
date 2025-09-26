import {
  Menu,
  Input,
  ActionIcon,
  Container,
  createTheme,
  MantineProvider,
  Burger,
  Drawer,
  ScrollArea,
} from "@mantine/core";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  IconZoomFilled,
  IconChevronDown,
  IconHome,
  IconInfoCircle,
  IconGift,
  IconTrophy,
  IconCalendarStats,
  IconPhoneCall,
  IconAward,
  IconStar,
} from "@tabler/icons-react";
import { IoCartSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import SideMenu from "./SideMenu";
import { useCart } from "../utils/hooks/useCart";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "How it Works", path: "/game-rules" },
  { name: "Raffles", path: "/raffles" },
  { name: "Game Result", path: "/profile/result" },
  { name: "Live Draw", path: "/draws" },
  {
    name: "Winners",
    dropdown: [
      { name: "Recent Winners", path: "/winners/recent" },
      { name: "All Time Winners", path: "/winners/all-time" },
    ],
  },
  { name: "About Us", path: "/about" },
  { name: "Prize", path: "/prize" },
  { name: "Contact Us", path: "/contact-us" },
];

const sideMenuItems = [
  {
    title: "Main Menu",
    items: [
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
    ],
  },
];

const theme = createTheme({
  components: {
    Input: Input.extend({
      classNames: {
        input:
          "!bg-[#1f1f1f] !text-[#cdcdcd] text-[14px] !h-[48px] placeholder:text-[14px] placeholder:text-[#cdcdcd] focus:ring-0 !border-none focus:border-green-500 !rounded-r-none",
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: "bg-primary-red hover:bg-primary-red text-white !h-[48px] !border-none !w-[56px] !rounded-none !rounded-r cursor-pointer",
      },
    }),
  },
});

export default function Header() {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 1095px)");
  const { totalItemsQuantity } = useCart();

  return (
    <div className="bg-[#010101] text-white max-w-[100%]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-6 gap-5">
        <div className="flex items-center gap-5">
          {isMobile && (
            <Burger color="white" opened={opened} onClick={toggle} size="sm" />
          )}
          <div className="font-bold">
            <span className="text-white text-2xl leading-[1.1] sm:text-[40px] md:leading-[40px]">
              Windfall
            </span>
            <span className="text-primary-red text-2xl leading-[1.1] sm:text-[40px] md:leading-[40px]">
              Raffle
            </span>
            <p className="text-xs sm:text-[14px] text-white text-right">
              Live in - Rent out - Sell up
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[29px] overflow-x-auto  !overflow-visible">
          {!isMobile && (
            <span className="font-normal text-[#cdcdcd] text-nowrap">
              <NavLink to={"/download-app"}>
                Play On the Go 🚀. Download App
              </NavLink>
            </span>
          )}

          <div className="flex justify-end items-center gap-5 sm:gap-[36px]">
            {!isMobile && (
              <div className="flex items-center w-80">
                <MantineProvider theme={theme}>
                  <div className="flex w-full max-w-md">
                    <Input
                      className="!rounded-r-none flex-grow-1 text-[14px]"
                      radius="md"
                      size="md"
                      placeholder="Enter keyword to search..."
                    />
                    <ActionIcon size={"input-md"}>
                      <IconZoomFilled />
                    </ActionIcon>
                  </div>
                </MantineProvider>
              </div>
            )}

            <Link to="/cart" className="relative inline-block">
              <IoCartSharp className="rounded-full p-2 text-4xl hover:bg-primary-text" />

              {!!totalItemsQuantity && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsQuantity}
                </span>
              )}
            </Link>

            <Link to="/profile">
              <span>
                <FaUser className="rounded-full p-2 text-4xl hover:bg-primary-text" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {!isMobile && (
        <div className="bg-white text-black">
          <Container size="xl">
            <nav className="flex justify-between overflow-x-auto h-[88px] items-center">
              {menuItems.map((item, index) =>
                item.dropdown ? (
                  <Menu key={item.name} withinPortal>
                    <Menu.Target>
                      <a
                        className={`cursor-pointer flex items-center justify-center font-medium text-[18px] leading-[24px] px-4 py-3 h-full border-r border-r-[#f3f2f5] ${
                          location.pathname.startsWith("/winners")
                            ? "text-primary-red"
                            : "text-gray-700"
                        } ${index === menuItems.length - 1 ? "!border-r-0" : ""}`}
                      >
                        {item.name}
                        <IconChevronDown className="ml-1" size={16} />
                      </a>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {item.dropdown.map((sub) => (
                        <Menu.Item
                          className="font-medium !text-[18px] !leading-[24px]"
                          key={sub.path}
                          component={NavLink}
                          to={sub.path}
                        >
                          {sub.name}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-center font-medium text-[18px] leading-[24px] px-4 py-3 h-full whitespace-nowrap border-r border-r-[#f3f2f5] ${
                        isActive ? "text-primary-red" : "text-gray-700"
                      } ${index === menuItems.length - 1 ? "!border-r-0" : ""}`
                    }
                    style={{ display: "flex", flex: 1 }}
                  >
                    {item.name}
                  </NavLink>
                )
              )}
            </nav>
          </Container>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          opened={opened}
          onClose={close}
          title={null}
          padding={0}
          size="250px"
          zIndex={1001}
          withCloseButton={false}
        >
          <ScrollArea>
            <SideMenu menus={sideMenuItems} onClose={close} />
          </ScrollArea>
        </Drawer>
      )}
    </div>
  );
}
