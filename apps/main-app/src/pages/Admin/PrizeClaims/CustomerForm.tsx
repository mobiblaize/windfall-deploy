/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Divider,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { HiMiniTicket } from "react-icons/hi2";
import CustomTickets from "../../../components/CustomTickets";

type Props = { form: UseFormReturnType<any>; categories?: any };


function CustomerForm({ form }: Props) {
  const customerName = `${form.values.customer_firstname || ""} ${form.values.customer_lastname || ""}`.trim() || "N/A";
  
  return (
    <Box>
      {/* Customer Name */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Box>
          <Text tt="capitalize" fw={700}>
            Customer Name
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Customer details
          </Text>
        </Box>
        <TextInput
          placeholder="Customer Name"
          value={customerName}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Customer Contact */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Email
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Customer email address
          </Text>
        </Box>
        <TextInput
          placeholder="Email"
          value={form.values.customer_email || ""}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Phone Number
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Customer phone number
          </Text>
        </Box>
        <TextInput
          placeholder="Phone Number"
          value={form.values.customer_phone || ""}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Game Details */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Game Details
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Game details for prize claim
          </Text>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            placeholder="Game Name"
            value={form.values.game_name || ""}
            readOnly
            classNames={{
              input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
            }}
          />
          
          <TextInput
            placeholder="Game Category"
            value={form.values.game_category || ""}
            readOnly
            classNames={{
              input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
            }}
          />
        </SimpleGrid>
      </SimpleGrid>

      <Divider my="md" />

      {/* Prize Won */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Prize Won
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Prize awarded to customer
          </Text>
        </Box>
        <TextInput
          placeholder="Prize Won"
          value={form.values.prize_won || ""}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      {/* Ticket */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Raffle Ticket
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Raffle Ticket by Customer
          </Text>
        </Box>
        <TextInput
          placeholder="Ticket ID"
          value={form.values.ticket_number || ""}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
        />
      </SimpleGrid>

      <Divider my="md" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <Box>
          <Text tt="capitalize" fw={700}>
            Draw Index
          </Text>
          <Text tt="capitalize" fw={100} fz={"xs"} c={"var(--secondary-text)"}>
            Draw information
          </Text>
        </Box>
        <TextInput
          placeholder="Draw Index"
          value={form.values.draw_index || ""}
          readOnly
          classNames={{
            input: "placeholder:text-xs bg-gray-50 text-gray-700 !cursor-not-allowed",
          }}
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
        <CustomTickets
          bgColor="bg-secondary-green"
          borderColor="border-primary-green"
          containerBgColor="bg-white"
        >
          <Text fw={700} fz={20}>
            {form.values.game_name || "Game Name"}
          </Text>

          <Text c="dimmed" fz={14} mb="md">
            Prize: {form.values.prize_won || "Prize"}
          </Text>

          <Box className="bg-white py-2 rounded-lg border-dashed border border-primary-green text-center">
            <Text fz={14} mb={2}>
              Ticket Number
            </Text>
            <Text fw={700} fz={24} className="!text-primary-red">
              {form.values.ticket_number || "N/A"}
            </Text>
          </Box>
          <Box mt={30} className={`flex items-center !justify-center`}>
            <Button
              rightSection={<HiMiniTicket />}
              className={`!tracking-wide !capitalize !rounded-2xl !border !border-dashed !border-primary-green !bg-secondary-green !text-primary-green !h-8`}
            >
              Won
            </Button>
          </Box>
        </CustomTickets>
      </SimpleGrid>
    </Box>
  );
}

export default CustomerForm;
