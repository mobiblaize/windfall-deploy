import {
  Card,
  Container,
  Divider,
  Flex,
  SimpleGrid,
  Text,
} from "@mantine/core";
import MyGameHeader from "./MyGameHeader";
// import { NavLink } from "react-router-dom";
// import { GoArrowUpRight } from "react-icons/go";
import { IconBellFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useFetchData } from "../../utils/hooks/useApis";
import { notifications as mantineNotifications } from "@mantine/notifications";
import Paginator from "../../components/Paginator";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { DateRangePicker } from "../../components/DateRangePicker";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  order_id: string;
  read_at: string;
  created_at: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

function AllNotifications() {
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/notifications?paginate=1&page=${filterPage}&start_date=${startDate}&end_date=${endDate}&limit=${10}`
  );

  useEffect(() => {
    if (isError) {
      mantineNotifications.show({
        title: "Failed to fetch notifications",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });

      setNotifications([]);
      setTotal(0);
    }
    if (response) {
      setNotifications(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setFilterPage(1);
  }, []);

  return (
    <div>
      <MyGameHeader
        title="Notification"
        description="See what's going on, manage your notification, all in one place"
      >
        <DateRangePicker
          onDateRangeChange={handleDateRangeChange}
          maxDate={new Date()}
          placeholder="Select date range"
        />
      </MyGameHeader>
      <Divider />
      <Container fluid className="!px-6 sm:!mx-5 md:!mx-20 lg:!mx-30">
        {isLoading && (
          <LoadingState
            title="Loading Notifications..."
            description="Fetching notifications"
          />
        )}
        {!isLoading && (
          <>
            {!notifications.length && (
              <EmptyState
                description="No notifications found"
                title="No Notifications"
              />
            )}
            {!!notifications.length && (
              <SimpleGrid mt={40} mb={54} cols={1} className="!gap-7">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    withBorder
                    className="!p-6 !rounded-xl !space-y-2 justify-items-start transition-shadow"
                  >
                    <Flex
                      columnGap="md"
                      rowGap="md"
                      justify="space-between"
                      align="center"
                      direction="row"
                      className="!flex-nowrap sm:!flex-nowrap"
                    >
                      <Flex
                        gap="md"
                        justify="flex-start"
                        align="flex-start"
                        direction="row"
                        wrap="nowrap"
                      >
                        <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-md">
                          <IconBellFilled className="!text-xl !text-primary-red" />
                        </div>
                        <div>
                          <Text className="!text-lg !font-bold !text-primary-text">
                            {notification.title}
                          </Text>
                          <Text className="!text-sm !text-secondary-text">
                            {notification.message}
                          </Text>
                        </div>
                      </Flex>
                      {/* <div className="w-fit">
                        <NavLink to={"/raffles"}>
                          <Flex className="!text-lg" align="center" gap={14}>
                            <p className="text-red-500 text-lg font-normal hover:underline">
                              View
                            </p>
                            <GoArrowUpRight
                              size={18}
                              className="rounded-full !p-0 bg-black text-white"
                            />
                          </Flex>
                        </NavLink>
                      </div> */}
                    </Flex>
                  </Card>
                ))}

                <div className="py-5">
                  <Paginator
                    currentPage={currentPage}
                    isLoading={isLoading}
                    total={total}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                  />
                </div>
              </SimpleGrid>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default AllNotifications;
