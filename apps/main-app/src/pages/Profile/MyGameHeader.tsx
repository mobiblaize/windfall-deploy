import { Flex, Text } from "@mantine/core";

type Props = {
  children?: React.ReactNode;
  title: React.ReactNode; // changed from string to React.ReactNode
  description: string;
  count?: string | number;
};

function MyGameHeader({ children, title, description, count }: Props) {
  return (
    <Flex className="flex flex-col md:flex-row gap-3 !items-start justify-between  !bg-white/60 !py-7 !px-6 md:!px-16 shadow-md">
      <div className="capitalize">
        <Text className="!text-2xl !font-semibold">
          {title} <span className="text-primary-red">{count && count}</span>
        </Text>
        <Text className="!text-secondary-text">{description}</Text>
      </div>
      {children}
    </Flex>
  );
}

export default MyGameHeader;
