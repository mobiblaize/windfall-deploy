import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "../MyGameHeader";
import CustomButton from "../../../components/Buttons/CustomButton";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import ReferralBonusUsed from "./ReferralBonusUsed";
import ReferralBonusEarned from "./ReferralBonusEarned";

type Tab = "earned" | "used";

const allTabs: {
  label: string;
  value: Tab;
}[] = [
  {
    label: "Referral Bonus Earned",
    value: "earned",
  },
  {
    label: "Referral Bonus Used",
    value: "used",
  },
];

function RewardTab() {
  const [activeTab, setActiveTab] = useState<Tab>("earned");

  return (
    <div>
      <MyGameHeader
        title="My Reward"
        description="Manage your rewards with ease."
      >
        <Select
          data={[""]}
          placeholder="My Games: Show All"
          rightSection={<FaAngleDown />}
          className="w-[180px]"
        />
      </MyGameHeader>

      <Divider />
      <Container size="xl">
        {
          <SimpleGrid
            my={54}
            py="lg"
            cols={{ base: 1, sm: 2, lg: 2 }}
            spacing={{ base: 10, sm: "md" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            <Card
              withBorder
              className="!p-6 !rounded-xl !space-y-5 !border-primary-red !bg-[#FFF7F7]"
            >
              <Text className="!text-sm !mb-1">My Referral balance</Text>
              <Text className="!text-4xl !text-primary-red !font-bold !mb-2">
                ₦ 101,040.00
              </Text>
              <Text className="!text-secondary-text !mb-8">
                + ₦ 1,030 added in the last 3 days.
              </Text>
              <Text className="!text-secondary-text !text-center !mb-3">
                Copy and share your referral code
              </Text>
              <CustomButton className="!mb-3">
                <span className="mr-2">AdeKUnleAlo</span>
                <FaRegCopy />
              </CustomButton>
              <Text className="!text-secondary-text !text-center">
                Your referral balance can only be used to buy a ticket.{" "}
              </Text>
            </Card>
          </SimpleGrid>
        }

        <Box className=" border !border-secondary-text/50  rounded-xl bg-white">
          <>
            <Flex
              fz="lg"
              px="md"
              pt="lg"
              pb={"lg"}
              gap={"md"}
              className="!flex !flex-wrap !mb-1"
            >
              {allTabs.map(({ label, value }) => {
                const isActive = activeTab === value;
                return (
                  <Text key={value}
                    onClick={() => setActiveTab(value)}
                    className={`
                            !py-2 !px-5
                              relative 
                              !capitalize !text-lg
                              cursor-pointer 
                              after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                              after:w-full after:h-[1px]
                              after:bg-primary-red
                              !font-medium
                              after:origin-center after:scale-x-0
                              after:transition-transform after:duration-300 after:ease-in-out
                              hover:after:scale-x-100
                              ${isActive ? "after:scale-x-100 !text-primary-red" : "!text-secondary-text"}
                            `}
                  >
                    {label}
                  </Text>
                );
              })}
            </Flex>

            <Flex justify="space-between" align="flex-start" px="md" mb="lg">
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                className="!w-72 !rounded-xl shadow-md"
              />
              <Group>
                <Select
                  rightSection={<IoFilterOutline />}
                  placeholder="sort by: show all"
                  className=" !shadow-md"
                />
                <Select
                  rightSection={<IoFilterOutline />}
                  placeholder="filter by: show all"
                  className=" !shadow-md"
                />
              </Group>
            </Flex>
          </>
          {activeTab === "earned" && <ReferralBonusEarned />}
          {activeTab === "used" && <ReferralBonusUsed />}
          <Flex my="md" justify="space-between" gap={2} wrap="wrap" px="lg" align="center">
            <Text className="">Page 1 of 10</Text>
            <Group>
              <Button
                variant="outline"
                className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
              >
                Next
              </Button>
            </Group>
          </Flex>
        </Box>
      </Container>
    </div>
  );
}

export default RewardTab;
