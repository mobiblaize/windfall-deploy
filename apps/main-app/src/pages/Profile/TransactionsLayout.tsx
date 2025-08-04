import {
  Select,
  Divider,
  Group,
  Box,
  Flex,
  Text,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Image,
} from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import ProfileHeader from "./ProfileHeader";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import TableContainer from "../../components/TableContainer";
import visaIcon from "../../assets/visa-icon.png";
import { useNavigate } from "react-router-dom";

function TransactionsLayout() {
  const navigate = useNavigate();
  return (
    <div className="text-primary-text mb-32 pt-5">
      {/* <Breadcrumbs>{items}</Breadcrumbs> */}

      <ProfileHeader />
      <MyGameHeader
        title="My Transaction"
        description="Manage your transaction with ease today."
      >
        <Select
          data={[""]}
          placeholder="Date: all time"
          rightSection={<FaAngleDown />}
          className="w-[180px]"
        />
      </MyGameHeader>
      <Divider />
      <section className="mx-10 my-10">
        <Box className=" border !border-secondary-text/50  rounded-xl bg-white">
          <>
            <Flex justify="space-between" px="md" pt="lg">
              <div>
                <Text fz={20} fw="bold">
                  Game Transaction List
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage transaction with ease.{" "}
                </Text>
              </div>
              <Button
                variant="outline"
                className=" !border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
              >
                Export
              </Button>
            </Flex>
            <Divider mt="md" mb="lg" />
            <Flex justify="space-between" px="md" mb="lg">
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

          <TableContainer
            headers={[
              "Transaction ID",
              "Transaction date & time",
              "paid via",
              "Transaction value",
              "payment chanel",
              "transaction status",
              "receipt",
            ]}
          >
            {[1, 2, 3, 4, 5, 6].map((x) => {
              const active = x % 2;
              return (
                <Table.Tr key={x}>
                  <Table.Td className="text-secondary-text !text-base">
                    4HYE74793FS
                  </Table.Td>
                  <Table.Td>
                    <Text className="!text-base !font-medium">
                      April 11, 2005
                    </Text>
                    <Text className="!text-secondary-text !text-sm">
                      11:00am
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Flex align={"center"} gap={10}>
                      <Image src={visaIcon} h={32} w={36} />
                      <Text className="!text-secondary-text !text-base">
                        ** 3904
                      </Text>
                    </Flex>
                  </Table.Td>
                  <Table.Td>₦ 10,000</Table.Td>
                  <Table.Td>
                    <Text className="!text-base">Paystack</Text>
                  </Table.Td>
                  <Table.Td>
                    <p
                      className={`py-[2px] px-2 rounded-xl inline-block font-medium ${active ? "bg-[#CCFBEF] text-[#06B280]" : "bg-[#FEF3F2] text-[#B42318]"}`}
                    >
                      {active ? 'Successful': 'Failed'}
                    </p>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                    onClick={()=>navigate('1')}
                      size={35}
                      className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                    >
                      <LuDownload />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </TableContainer>
          <Flex my="md" justify="space-between" px="lg" align="center">
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
      </section>
    </div>
  );
}

export default TransactionsLayout;
