import { Avatar, Badge, ActionIcon, Group, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";

export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between w-full py-3 px-4 bg-white">
      {/* Left: Profile */}
      <Group gap="sm">
        <Avatar
          src="/assets/profile.jpg"
          alt="Profile"
          radius="md"
          size={40}
          className="border-2 border-red-400 rounded-lg"
        />
        <div>
          <Text className="!text-gray-700 !font-medium !text-sm">
            Adekunle, I.O
          </Text>
          <Badge
            radius="sm"
            size="md"
            className="!bg-light-red !text-[#C01048] !capitalize !font-medium !rounded-2xl"
          >
            Raffle Manager
          </Badge>
        </div>
      </Group>

      {/* Right: Icons */}
      <Group gap="xs">
        <ActionIcon
          variant="light"
          radius="md"
          size="lg"
          className="!bg-red-50 hover:!bg-red-100 !w-[40px] !h-[40px] !border-[#FFD5D6]"
        >
          <IconBell className="text-red-400" size={22} />
        </ActionIcon>

        <ActionIcon
          variant="light"
          radius="md"
          size="lg"
          className="!bg-red-50 hover:!bg-red-100 !w-[40px] !h-[40px] !border !border-[#FFD5D6]"
        >
          <IconLogout className="text-red-400" size={22} />
        </ActionIcon>
      </Group>
    </div>
  );
}
