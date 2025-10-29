/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { FaAngleDown } from "react-icons/fa";
import ticketVector from "../../../assets/ticket-vector.png";
import GameTicket from "../../Profile/GameTicket";

type Props = { form: UseFormReturnType<any>; categories: any };

const game = {
  uuid: "0353ca45-04d6-4309-a436-7d105f63061d",
  name: "Biggie Instant Win 1",
  instant_game: true,
  card_image: null,
  description: "An exciting game with wonderful prizes!",
  supporting_text: "Additional info for players",
  start_date: "2025-10-02",
  end_date: "2025-10-30",
  status: "live",
  total_tickets: 15,
  available_tickets: 9
};

const ticket = {
  uuid: "13fb5f53-56ae-4b2c-b5bd-9d30ffed52f0",
  ticket_number: "GNWoJE9BJRZH6D5",
  validation_number: "ClZKjEIXD4FVWbyMcVgz",
  issued_at: "2025-10-14 11:27:58",
  status: "won",
  prize: null,
  owned_by_user: true
};



function CustomerForm({ form, categories }: Props) {
  return (
    <Box>
      {/* Raffle Name */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Box>
          <Text tt="capitalize" fw={700}>
            Customer Name
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Customer details
          </Text>
        </Box>
        <Select
          placeholder="Select category"
          data={categories}
          rightSection={<FaAngleDown />}
          classNames={{
            input: "placeholder:text-xs",
            options: "text-primary-text",
          }}
          {...form.getInputProps("category_id")}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Description */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Game Details
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Select game for prize claim
          </Text>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Select
            placeholder="Select category"
            label="Game Category"
            required
            data={categories}
            rightSection={<FaAngleDown />}
            classNames={{
              input: "placeholder:text-xs",
              options: "text-primary-text",
            }}
            {...form.getInputProps("category_id")}
          />
          <Select
            placeholder="Select Game"
            label="Game"
            required
            data={categories}
            rightSection={<FaAngleDown />}
            classNames={{
              input: "placeholder:text-xs",
              options: "text-primary-text",
            }}
            {...form.getInputProps("category_id")}
          />
        </SimpleGrid>
      </SimpleGrid>

      <Divider my="md" />

      {/* Category */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Raffle Ticket
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Raffle Ticket by Customer
          </Text>
        </Box>
        <Select
          placeholder="Enter Ticket ID"
          data={categories}
          rightSection={<FaAngleDown />}
          classNames={{
            input: "placeholder:text-xs",
            options: "text-primary-text",
          }}
          {...form.getInputProps("category_id")}
        />
      </SimpleGrid>

      <Divider my="md" />

      <Box
        className="border-y border-dashed border-primary-red bg-secondary-red"
        py={"sm"}
        px={"md"}
        my={"md"}
      >
        <Text tt="capitalize" fw={700}>
          Ticket preview
        </Text>
        <Text tt="capitalize" fz={"xs"} c="var(--secondary-text)">
          A preview of the winning ticket.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1 }} mt="md">
        <Flex direction={"column"} justify={"center"} align={"center"} px={15}>
          <div className="rounded-full p-3 bg-secondary-red mb-3">
            <Avatar src={ticketVector} alt="Ticket Icon" />
          </div>
          <Text tt="capitalize" fw={700}>
            No Preview
          </Text>
          <Text tt="capitalize" mb={5} fz={"xs"} c="var(--secondary-text)">
            Enter ticket ID / Number to preview status of winning and authenticity
          </Text>
        </Flex>
          <GameTicket game={game as any} item={ticket as any} containerBgColor='bg-white' />
      </SimpleGrid>
    </Box>
  );
}

export default CustomerForm;
