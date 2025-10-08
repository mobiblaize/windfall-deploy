import {
  Box,
  Card,
  Container,
  Divider,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
import CustomButton from "../../../components/Buttons/CustomButton";
import { HiSearch } from "react-icons/hi";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import ReferralBonusUsed from "./ReferralBonusUsed";
import ReferralBonusEarned from "./ReferralBonusEarned";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import { useAtom } from "jotai";
import { userAtom } from "../../../utils/hooks/useStorage";
import TablePaginator from "../../../components/TablePaginator";
import EmptySection from "../../../components/EmptySection";
import LoadingState from "../../../components/LoadingState";
import { useDebounce } from "../../../utils/hooks/useDebounce";

type Tab = "awarded" | "redeemed";

const allTabs: {
  label: string;
  value: Tab;
}[] = [
  {
    label: "Referral Bonus Earned",
    value: "awarded",
  },
  {
    label: "Referral Bonus Used",
    value: "redeemed",
  },
];

export interface RewardData {
  total_balance: string;
  total_received: string;
  total_spent: number;
  transactions: Transactions;
}

export interface Transactions {
  current_page: number;
  data: ReferralTransaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface ReferralTransaction {
  status: string;
  reason: string;
  amount: string;
  date: string;
  order: Order;
  referred_user: ReferredUser;
}

export interface Order {
  uuid: string;
  uniqueID: string;
  amount: string;
}

export interface ReferredUser {
  uuid: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

function RewardTab() {
  const [user] = useAtom(userAtom);
  const [activeTab, setActiveTab] = useState<Tab>("awarded");
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<ReferralTransaction[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/referral/transactions?paginate=1&filter_by=${activeTab}&page=${filterPage}&limit=${12}&search=${debouncedSearch}`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch referral details",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });

      setTransactions([]);
      setTotal(0);
    }
    if (response) {
      setBalance(response.data?.total_balance);
      setTransactions(response.data?.transactions?.data || []);
      setCurrentPage(response.data?.transactions?.current_page || 1);
      setTotal(response.data?.transactions?.total || 0);
      setPageSize(response.data?.transactions?.per_page || 10);
    }
  }, [error, isError, response]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  const handleCopy = async () => {
    if (!user?.referral_code) return;

    try {
      await navigator.clipboard.writeText(user.referral_code);
      notifications.show({
        title: "Copied!",
        message: "Referral code copied to clipboard",
        color: "green",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Failed to copy referral code",
        color: "red",
      });
    }
  };

  return (
    <div>
      <MyGameHeader
        title="My Reward"
        description="Manage your rewards with ease."
      />

      <Divider />
      <Container size="xl" fluid className="!px-6 md:!px-16">
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
              {isLoading ? (
                <Skeleton className="!mb-8" height={40} width="80%" />
              ) : (
                <Text className="!text-4xl !text-primary-red !font-bold !mb-8">
                  {formatCurrency(balance)}
                </Text>
              )}
              {/* <Text className="!text-secondary-text !mb-8">
                + ₦ 1,030 added in the last 3 days.
              </Text> */}
              <Text className="!text-secondary-text !text-center !mb-3">
                Copy and share your referral code
              </Text>
              <CustomButton className="!mb-3" onClick={handleCopy}>
                <span className="mr-2">{user?.referral_code}</span>
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
                  <Text
                    key={value}
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
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!w-72 !rounded-xl shadow-md"
              />
            </Flex>
          </>

          {isLoading && (
            <LoadingState
              title="Loading referral transactions..."
              description="Fetching referral transactions"
            />
          )}
          {!isLoading && (
            <>
              {activeTab === "awarded" && (
                <ReferralBonusEarned transactions={transactions} />
              )}
              {activeTab === "redeemed" && (
                <ReferralBonusUsed transactions={transactions} />
              )}
              {!transactions.length && (
                <EmptySection
                  description="No transactions found"
                  title="No records found"
                />
              )}
            </>
          )}
          <TablePaginator
            currentPage={currentPage}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </Box>
      </Container>
    </div>
  );
}

export default RewardTab;
