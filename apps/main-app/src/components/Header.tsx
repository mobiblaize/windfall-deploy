// components/Header.tsx
import { useState } from 'react';
import { Menu, Input, ActionIcon, Container, createTheme, MantineProvider } from '@mantine/core';
import { IconZoomFilled, IconChevronDown, IconUserFilled, IconShoppingCartFilled } from '@tabler/icons-react';

const menuItems = [
  'Home',
  'How it Works',
  'Raffles',
  'Game Result',
  'Live Draw',
  'Winners',
  'About Us',
  'Prize',
  'Contact Us',
];

const theme = createTheme({
  components: {
    Input: Input.extend({
      classNames: {
        input: '!bg-[#1f1f1f] !text-[#cdcdcd] text-[14px] !h-[48px] placeholder:text-[14px] placeholder:text-[#cdcdcd] focus:ring-0 !border-none focus:border-green-500 !pr-[4rem]',
        section: '!rounded-s-lg !h-[48px] !w-[56px] hover:bg-[#2c2c2c] !top-0',
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: 'bg-red-500 hover:bg-red-600 text-white !h-[48px] !border-none !w-[56px] !rounded-none !rounded-r cursor-pointer'
      },
    }),
  },
});

export default function Header() {
  const [active, setActive] = useState('Home');

  return (
        <div className="bg-[#010101] text-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-10 py-6">
            <div className="text-xl font-bold">
                <span className="text-white text-[40px] leading-[40px]">Windfall</span>
                <span className="text-red-500 text-[40px] leading-[40px]">Raffle</span>
                <p className="text-[14px] text-white text-right">Live in - Rent out - Sell up</p>
            </div>

            <div className="hidden md:flex items-center gap-[29px]">
            <span className="font-normal text-[#cdcdcd]">Play On the Go 🚀. Download App</span>

            <div className="flex items-center gap-[36px]">
                <MantineProvider theme={theme}>
                    <Input
                        className="w-72 text-[14px]"
                        radius="md"
                        size='md'
                        placeholder="Enter keyword to search..."
                        rightSection={
                            <ActionIcon size={'input-md'} >
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
                item === 'Winners' ? (
                    <Menu key={item} withinPortal>
                    <Menu.Target>
                        <button
                        className={`flex text-[20px] font-medium cursor-pointer items-center justify-center px-4 py-3 flex-1 h-[100%] border-r border-r-[#f3f2f5] ${
                            active === item ? 'text-red-500' : 'text-gray-700'
                        } ${index === menuItems.length - 1 ? '!border-r-0' : ''}`}
                        onClick={() => setActive(item)}
                        >
                        {item}
                        <IconChevronDown className="ml-1" size={16} />
                        </button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item>Recent Winners</Menu.Item>
                        <Menu.Item>All Time Winners</Menu.Item>
                    </Menu.Dropdown>
                    </Menu>
                ) : (
                    <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`text-[20px] font-medium cursor-pointer px-4 py-3 whitespace-nowrap flex-1 h-[100%] border-r border-r-[#f3f2f5] ${
                        active === item ? 'text-red-500' : 'text-gray-700'
                    } ${index === menuItems.length - 1 ? '!border-r-0' : ''}`}
                    >
                    {item}
                    </button>
                )
                )}
            </nav>
            </Container>
        </div>
    </div>
  );
}
