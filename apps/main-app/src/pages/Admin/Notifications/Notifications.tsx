import {
  Tabs,
  Text,
  Title,
  Flex,
  Card,
  Box,
  Select,
  Group,
  Menu,
  Button,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetchData } from "../../../utils/hooks/useApis";
import { format } from "date-fns";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import { notifications as mantineNotifications } from "@mantine/notifications";
import Paginator from "../../../components/Paginator";
import type { Permission } from "../RoleMgt/CreateRole";
import CustomBadge from "../../../components/CustomBadge";
import { FaAngleDown } from "react-icons/fa";
import { useGetNotifications } from "../../../utils/api/Admin/notifications";
import { IoCheckmark } from "react-icons/io5";
import { useGetData } from "../../../utils/hooks/useApis";
import { DateRangePicker } from "../../../components/DateRangePicker";

export interface Role {
  uuid: string;
  name: string;
  display_name: string;
  guard_name?: string;
  description: string;
  is_active: "true" | "false";
  created_at: string;
  user_count: number;
  updated_by: UpdatedBy;
  permissions: Permission[];
}

export interface Notification {
  id: string;
  title: string;
  type: string;
  message: string;
  draw_id: string;
  read_at: string;
  created_at: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface UpdatedBy {
  uuid: string;
  name: string;
  uniqueID: string;
  avatar: string;
  enforce_password_change: boolean;
}

type NotificationCardProps = {
  notification: Notification;
  onRead?: (notificationId: string) => void;
};

const statusOptions = [
  {
    label: "Status: All",
    value: "",
  },
  {
    label: "Read",
    value: "read",
  },
  {
    label: "Unread",
    value: "unread",
  },
];

function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const isRead = !!notification.read_at;
  const targetId =
    (notification as unknown as { uuid?: string }).uuid || notification.id;
  const { mutateAsync: markAsRead, isPending: isMarking } = useGetData(
    `admin/notifications/${targetId}/read`
  );

  const handleMarkAsRead = async () => {
    try {
      const resp = await markAsRead();
      if (resp) {
        onRead?.(targetId);
      }
    } catch (e) {
      mantineNotifications.show({
        title: "Failed to mark as read",
        message: (e as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  };

  return (
    <Card
      radius="lg"
      padding="lg"
      withBorder
      className={`rounded-2xl transition bg-white `}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="!text-secondary-text">
          <Text className="!font-medium !text-lg !text-primary-text">
            {/* {notification.type}{" "} */}
            <span className="text-wrap break-all">{notification.title}</span>
          </Text>
          <Text className="!text-base">
            {notification?.created_at
              ? format(
                  new Date(notification.created_at),
                  "MMMM d, yyyy | h:mm a"
                )
              : "-"}
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <CustomBadge
            status={isRead ? "successful" : "pending"}
            label={isRead ? "Read" : "Unread"}
          />
          {!isRead && (
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <Button
                  loading={isMarking}
                  disabled={isMarking}
                  size="xs"
                  variant="subtle"
                  className="!px-2 !py-1"
                >
                  •••
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleMarkAsRead} disabled={isMarking}>
                  {isMarking ? "Marking..." : "Mark as read"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>

      {/* Description */}
      <Text className="!text-sm !text-gray-600 !mt-3 !leading-snug">
        {notification.message}
      </Text>
    </Card>
  );
}

export default function Notifications() {
  const { section } = useParams<{ section: string }>();
  const [activeTab, setActiveTab] = useState<string>(section || "all");
  const {
    data: modulesResponse,
    isError: isModuleError,
    error: modulesError,
  } = useFetchData(`guest/dropdown/get-all-modules`);

  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [status, setStatus] = useState<string | null>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);  
  const prevFiltersRef = useRef({ status, startDate, endDate, activeTab });

  const effectivePage = useMemo(() => {
    const prevFilters = prevFiltersRef.current;
    const filtersChanged = 
      prevFilters.status !== status ||
      prevFilters.startDate !== startDate ||
      prevFilters.endDate !== endDate ||
      prevFilters.activeTab !== activeTab;
    
    if (filtersChanged) {
      prevFiltersRef.current = { status, startDate, endDate, activeTab };
      return 1;
    }
    
    return filterPage;
  }, [status, startDate, endDate, activeTab, filterPage]);

  
  useEffect(() => {
    if (effectivePage === 1 && filterPage !== 1) {
      setFilterPage(1);
    }
  }, [effectivePage, filterPage]);

  const params = {
    paginate: 1,
    page: effectivePage,
    limit: "10",
    status: status,
    modules: activeTab === "all" ? "" : activeTab,
    start_date: startDate,
    end_date: endDate,
  };

  const {
    mutate: notificationsMutate,
    data: notificationsResponse,
    isPending,
    isError,
    error,
  } = useGetNotifications(params);

  // Fetch notifications on mount and on filter changes
  useEffect(() => {
    notificationsMutate();
  }, [notificationsMutate, effectivePage, activeTab, status, startDate, endDate]);

  useEffect(() => {
    if (isError) {
      mantineNotifications.show({
        title: "Failed to fetch notifications",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (notificationsResponse) {
      setCurrentPage(notificationsResponse.data?.current_page || 1);
      setTotal(notificationsResponse.data?.total || 0);
      setPageSize(notificationsResponse.data?.per_page || 10);
      // Initialize/refresh local notifications list
      setNotifications(notificationsResponse.data?.data ?? []);
    }
  }, [isError, error, notificationsResponse]);

  useEffect(() => {
    if (isModuleError) {
      mantineNotifications.show({
        title: "Failed to fetch Modules",
        message:
          (modulesError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [modulesError, isModuleError]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    setActiveTab(value);
  };

  const modules = (() => {
    const modulesData: { name: string }[] = modulesResponse?.data ?? [];
    return [
      ...modulesData.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    ];
  })();

  // New: split modules into visible (first 3) and extras
  const VISIBLE_LIMIT = 4;
  const firstModules = modules.slice(0, VISIBLE_LIMIT);
  const extraModules = modules.slice(VISIBLE_LIMIT);
  const extraCount = extraModules.length;

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        classNames={{
          tab: "!text-secondary-text hover:!text-primary-red !transition !bg-white hover:!bg-light-red !text-[14px] !border-transparent !font-medium data-[active=true]:!text-primary-red hover:!border-primary-red  data-[active=true]:!border-primary-red !pb-4",
          list: "!gap-y-2 !gap-x-2 before:!hidden",
        }}
      >
        <div className="bg-white border-b-2 border-[#d0d5dd] sticky top-[69px] z-10">
          <div className="px-6 md:px-10 pt-5 pb-2">
            <Flex
              mb="lg"
              wrap={"wrap"}
              rowGap={15}
              columnGap={10}
              justify="space-between"
            >
              <div>
                <Title
                  className="!text-primary-text text-2xl !capitalize"
                  order={2}
                >
                  {activeTab} Notifications
                </Title>
                <Text className="!text-secondary-text">
                  Stay informed about the latest updates
                  {activeTab === "all" ? "" : ` in ${activeTab}`}.
                </Text>
              </div>
              <Group gap={10}>
                <Select
                  value={status}
                  onChange={setStatus}
                  rightSection={<FaAngleDown />}
                  placeholder="Status: "
                  data={statusOptions}
                  className="!rounded-xl !shadow-sm"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />

                <DateRangePicker
                  onDateRangeChange={handleDateRangeChange}
                  maxDate={new Date()}
                  placeholder="Select date range"
                />
              </Group>
            </Flex>
          </div>

          <Flex
            className="px-6 md:px-10 !mb-2"
            gap={15}
            justify="space-between"
          >
            <Tabs.List className="mr-5 !tracking-wide flex items-center gap-2 flex-nowrap">
              <Tabs.Tab value="all">All</Tabs.Tab>

              {/* show first 4 modules */}
              {firstModules.map((module) => (
                <Tabs.Tab value={module.value} key={module.value}>
                  {module.label}
                </Tabs.Tab>
              ))}

              {/* if there are extras, show "+ N more" as a Menu */}
              {extraCount > 0 && (
                <Menu
                  offset={8}
                  withinPortal
                  shadow="sm"
                  withArrow
                  // optional: give the menu a stable key so it re-renders when activeTab changes
                  key={`more-modules-${extraCount}-${activeTab}`}
                >
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      size="md"
                      className={`!px-3 !py-1 !rounded-t-lg !rounded-b-none !border-0 hover:!text-primary-red hover:!border-b hover:!border-primary-red !text-base !font-medium ${
                        extraModules.some((m) => m.value === activeTab)
                          ? "!text-primary-red !border-b !border-primary-red"
                          : "!text-secondary-text"
                      }`}
                    >
                      + {extraCount} more
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {extraModules.map((mod) => {
                      const isActive = mod.value === activeTab;
                      return (
                        <Menu.Item
                          key={mod.value}
                          onClick={() => {
                            setActiveTab(mod.value);
                          }}
                          rightSection={
                            isActive ? (
                              <IoCheckmark className="text-primary-red" />
                            ) : undefined
                          }
                          className={
                            isActive
                              ? "!text-primary-red font-medium"
                              : undefined
                          }
                        >
                          {mod.label}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Tabs.List>
          </Flex>
        </div>

        <div className="px-6 md:px-10">
          <Box pt="md" pb={30}>
            {isPending && (
              <LoadingState description="Fetching notifications data from the system." />
            )}
            {!isPending && (
              <>
                {notifications.length ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {notifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onRead={(id) => {
                            setNotifications((prev) =>
                              prev.map((n) => {
                                const candidateId =
                                  (n as unknown as { uuid?: string }).uuid ||
                                  n.id;
                                return candidateId === id
                                  ? { ...n, read_at: new Date().toISOString() }
                                  : n;
                              })
                            );
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState
                    description="No notifications found"
                    format="secondary"
                    fullWidth={true}
                    title="No Notifications found"
                  />
                )}
              </>
            )}
            <div className="mt-10">
              <Paginator
                currentPage={currentPage}
                isLoading={isPending}
                total={total}
                pageSize={pageSize}
                onPageChange={onPageChange}
              />
            </div>
          </Box>
        </div>
      </Tabs>
    </div>
  );
}
