import {
  Divider,
  Button,
  Container,
  Card,
  Box,
  Text,
  Flex,
} from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import MyGameHeader from "./MyGameHeader";
import { HiDocumentArrowDown } from "react-icons/hi2";

function TransactionReceipt() {
  return (
    <div>
      <MyGameHeader
        title="My Transaction receipt"
        description="View and download transaction receipt."
      >
        <Button
          variant="outline"
          fw={500}
          className="!border-secondary-text/50 !text-secondary-text !tracking-wide hover:!bg-secondary-text/10 !transition-all !duration-300 !ease-in-out"
          rightSection={<RiArrowRightUpLine />}
        >
          Download Transaction Receipt
        </Button>
      </MyGameHeader>
      <Divider />
      <Container size="xl" my="xl" className="mx-auto md:w-2/5 text-center">
        <Card withBorder py="lg" px="md" radius="md">
          <Box className="capitalize !text-lg">
            <div className="text-center mb-4">
              <div className="text-xl font-bold inline-block">
                <span className="text-dark text-[40px] leading-[40px]">
                  Windfall
                </span>
                <span className="text-red-500 text-[40px] leading-[40px]">
                  Raffle
                </span>
                <p className="text-[14px] text-dark text-right">
                  Live in - Rent out - Sell up
                </p>
              </div>
            </div>
            <Flex justify="space-between" className="!py-6">
              <Text>transaction date</Text>
              <Text>April 11,2025</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="capitalize !text-lg">
            <Flex justify="space-between" className="!py-6">
              <Text>transaction time</Text>
              <Text>11:00 am W.A.T</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="capitalize !text-lg">
            <Flex justify="space-between" className="!py-6">
              <Text>paid via</Text>
              <Text>visa *948#</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="capitalize !text-lg">
            <Flex justify="space-between" className="!py-6">
              <Text>payment proccessor</Text>
              <Text>payStack</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="capitalize !text-lg">
            <Flex justify="space-between" className="!py-6">
              <Text>transacion id</Text>
              <Text>AS#78979087</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="capitalize !text-lg">
            <Flex justify="space-between" className="!py-6">
              <Text>payment status</Text>
              <Text className={"!text-[#06B280] !font-medium"}>Successful</Text>
            </Flex>
            <Divider />
          </Box>
          <Box className="border border-dashed rounded-md text-center border-[#FD6F8E] bg-secondary-red p-5">
            <div>
              <Text className="!text-sm">Transaction Amount</Text>
              <Text className="!text-[#FF2F31] !text-3xl !font-extrabold">
                ₦ 10,000
              </Text>
            </div>
          </Box>
        </Card>

        <Button
          rightSection={
            <HiDocumentArrowDown className="text-secondary-red/90" />
          }
          className="!border-2 !border-dashed !border-secondary-red !h-12 !mt-10 !text-base !tracking-wide !px-15 !rounded-lg"
        >
          Download Ticket
        </Button>
      </Container>
    </div>
  );
}

export default TransactionReceipt;
