import {
  Menu,
  Input,
  ActionIcon,
  Container,
  createTheme,
  MantineProvider,
} from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IconZoomFilled,
  IconChevronDown,
  IconUserFilled,
  IconShoppingCartFilled,
} from '@tabler/icons-react';

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'How it Works', path: '/how-it-works' },
  { name: 'Raffles', path: '/raffles' },
  { name: 'Game Result', path: '/game-result' },
  { name: 'Live Draw', path: '/draws' },
  {
    name: 'Winners',
    dropdown: [
      { name: 'Recent Winners', path: '/winners/recent' },
      { name: 'All Time Winners', path: '/winners/all-time' },
    ],
  },
  { name: 'About Us', path: '/about' },
  { name: 'Prize', path: '/prize' },
  { name: 'Contact Us', path: '/contact' },
];

const theme = createTheme({
  components: {
    Input: Input.extend({
      classNames: {
        input:
          '!bg-[#1f1f1f] !text-[#cdcdcd] text-[14px] !h-[48px] placeholder:text-[14px] placeholder:text-[#cdcdcd] focus:ring-0 !border-none focus:border-green-500 !pr-[4rem]',
        section:
          '!rounded-s-lg !h-[48px] !w-[56px] hover:bg-[#2c2c2c] !top-0',
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: {
        root:
          'bg-red-500 hover:bg-red-600 text-white !h-[48px] !border-none !w-[56px] !rounded-none !rounded-r cursor-pointer',
      },
    }),
  },
});

export default function Header() {
  const location = useLocation();

  return (
    <div className="bg-[#010101] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-10 py-6">
        <div className="text-xl font-bold">
          <span className="text-white text-[40px] leading-[40px]">Windfall</span>
          <span className="text-red-500 text-[40px] leading-[40px]">Raffle</span>
          <p className="text-[14px] text-white text-right">
            Live in - Rent out - Sell up
          </p>
        </div>

        <div className="hidden md:flex items-center gap-[29px]">
          <span className="font-normal text-[#cdcdcd]">
            Play On the Go 🚀. Download App
          </span>

          <div className="flex items-center gap-[36px]">
            <MantineProvider theme={theme}>
              <Input
                className="w-72 text-[14px]"
                radius="md"
                size="md"
                placeholder="Enter keyword to search..."
                rightSection={
                  <ActionIcon size={'input-md'}>
                    <IconZoomFilled />
                  </ActionIcon>
                }
              />
            </MantineProvider>
            <ActionIcon variant="transparent" color="white">
              <IconShoppingCartFilled />
            </ActionIcon>
            <ActionIcon variant="transparent" color="white">
              <IconUserFilled />
            </ActionIcon>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white text-black">
        <Container size="xl">
          <nav className="flex justify-between overflow-x-auto h-[88px] items-center">
            {menuItems.map((item, index) =>
              item.dropdown ? (
                <Menu key={item.name} withinPortal>
                  <Menu.Target>
                    <a
                      className={`cursor-pointer flex items-center justify-center font-medium text-[18px] leading-[24px] px-4 py-3 h-full border-r border-r-[#f3f2f5] ${
                        location.pathname.startsWith('/winners')
                          ? 'text-red-500'
                          : 'text-gray-700'
                      } ${index === menuItems.length - 1 ? '!border-r-0' : ''}`}
                    >
                      {item.name}
                      <IconChevronDown className="ml-1" size={16} />
                    </a>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {item.dropdown.map((sub) => (
                      <Menu.Item className="font-medium !text-[18px] !leading-[24px]" key={sub.path} component={NavLink} to={sub.path}>
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
                        isActive ? 'text-red-500' : 'text-gray-700'
                    } ${index === menuItems.length - 1 ? '!border-r-0' : ''}`
                }
                  style={{ display: 'flex', flex: 1 }}
                >
                  {item.name}
                </NavLink>
              )
            )}
          </nav>
        </Container>
      </div>
    </div>
  );
}
