import { useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconGiftFilled,
} from "@tabler/icons-react";
import { Avatar, Flex, Group, Text, TextInput } from "@mantine/core";
import { HiSearch } from "react-icons/hi";
import type { Raffle } from "../../models/raffles";

interface RaffleProps {
  raffle: Raffle;
}

export default function InstantPrizes({ raffle }: RaffleProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]); // multiple open accordions
  const [searchTerm, setSearchTerm] = useState("");
  const prizes = raffle.prizes;

  const toggleItem = (index: number) => {
    setOpenIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // close it
          : [...prev, index] // open it
    );
  };

  return (
    <div className="space-y-8 text-lg">
      <TextInput
        leftSection={<HiSearch />}
        placeholder="Search by ticket number"
        radius="md"
        className="!w-72 max-w-[100%]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />

      {prizes.map((prize, index) => {
        const isOpen = openIndexes.includes(index);

        // filter tickets by ticket_number
        const filteredTickets = prize.tickets.filter((ticket) =>
          ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                  src={prize.image}
                  alt="Profile"
                  radius="md"
                  size={48}
                  className="border-2 border-red-400 rounded-lg"
                />
                <div>
                  <Text className="!text-primary-text !font-bold !text-lg">
                    {prize.name}
                  </Text>
                  <Flex gap={6}>
                    <IconGiftFilled className="!text-[#ff2f31]" />
                    <span>
                      <span className="text-[#039855] font-bold">
                        {prize.available_to_be_won}/{prize.total_quantity}
                      </span>{" "}
                      <span className="text-[#575757]">Units to be Won</span>
                    </span>
                  </Flex>
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
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket, idx) => {
                    const isWon = (ticket.flag === "won") || (ticket.flag === "already won") || (ticket.flag === "you won");
                    return (
                      <div
                        key={idx}
                        className="border border-[#9A999D] border-dashed rounded-lg p-3 flex flex-col items-start"
                      >
                        <span
                          className={`px-2 py-[2px] capitalize rounded-full text-xs font-medium mb-2 ${
                            isWon
                              ? "!bg-[#D1FADF] !text-[#027A48]"
                              : ticket.flag === "lost"
                                ? "!bg-light-red !text-primary-red"
                                : "!bg-[#F2F4F7] !text-[#344054]"
                          }`}
                        >
                          {ticket.flag}
                        </span>
                        <Text
                          className={`!font-medium ${
                            !isWon
                              ? "!text-primary-red"
                              : "!text-gray-800"
                          }`}
                        >
                          {ticket.ticket_number}
                        </Text>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-full text-sm text-gray-500">
                    No tickets found
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
