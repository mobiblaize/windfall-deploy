import { useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconGiftFilled,
} from "@tabler/icons-react";
import { Avatar, Flex, Group, Text, TextInput } from "@mantine/core";
import { HiSearch } from "react-icons/hi";

type Ticket = {
  id: string;
  status: "won" | "notyet";
};

type Prices = {
  prize: string;
  sold: number;
  total: number;
  tickets: Ticket[];
};

const prizes: Prices[] = [
  {
    prize: "₦ 50,000 Cash Prize",
    sold: 20,
    total: 40,
    tickets: Array.from({ length: 24 }).map((_, i) => ({
      id: i % 2 === 0 ? "#WF100423X8" : "#WF300523X8",
      status: i % 2 === 0 ? "won" : "notyet",
    })),
  },
  {
    prize: "₦ 50,000 Cash Prize",
    sold: 20,
    total: 40,
    tickets: Array.from({ length: 24 }).map((_, i) => ({
      id: i % 2 === 0 ? "#WF100423X8" : "#WF300523X8",
      status: i % 2 === 0 ? "won" : "notyet",
    })),
  },
];

export default function InstantPrizes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 text-lg">

      <TextInput
        leftSection={<HiSearch />}
        placeholder="Search"
        radius="md"
        className="!w-72 max-w-[100%]"
      />

      {prizes.map((prize, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow border border-gray-200"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left"
              onClick={() => toggleItem(index)}
            >
              <Group gap="sm">
                <Avatar
                  src="/assets/profile.jpg"
                  alt="Profile"
                  radius="md"
                  size={48}
                  className="border-2 border-red-400 rounded-lg"
                />
                <div>
                  <Text className="!text-primary-text !font-bold !text-lg">
                    {prize.prize}
                  </Text>
                  <Flex gap={6}>
                    <IconGiftFilled className="!text-[#ff2f31]" />
                    <span>
                      <span className="text-[#039855] font-bold">
                        {prize.sold}/{prize.total}
                      </span>{" "}
                      <span className="text-[#575757]">Units to be Won</span>
                    </span>
                  </Flex>
                  <div className="flex"></div>
                </div>
              </Group>
              <span>
                {isOpen ? (
                  <IconChevronUp size={20} className="text-primary-red" />
                ) : (
                  <IconChevronDown size={20} className="text-primary-red" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 pb-6 pt-2">
                {prize.tickets.map((ticket, idx) => (
                  <div
                    key={idx}
                    className="border border-[#9A999D] border-dashed rounded-lg p-3 flex flex-col items-start"
                  >
                    <span
                      className={`px-2 py-[2px] rounded-full text-xs font-medium mb-2 ${
                        ticket.status === "won"
                          ? "!bg-[#D1FADF] !text-[#027A48]"
                          : "!bg-[#F2F4F7] !text-[#344054]"
                      }`}
                    >
                      {ticket.status === "won" ? "Already Won" : "Not Yet Won"}
                    </span>
                    <Text
                      className={`!font-medium ${
                        ticket.status === "notyet"
                          ? "!text-primary-red"
                          : "!text-gray-800"
                      }`}
                    >
                      {ticket.id}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
