import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Avatar,
  Divider,
  ActionIcon,
  Group,
  Button,
  Box,
  TextInput,
  Select,
  Skeleton,
  SimpleGrid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { GoArrowUpRight } from "react-icons/go";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import {
  useFetchData,
  useGetData,
  useGetExportData,
} from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import TablePaginator from "../../../components/TablePaginator";
import { format } from "date-fns";
import DynamicTableSection from "../../../components/DynamicTableSection";
import type { User } from "../UserMgt/UserMgt";
import UserAction from "../UserMgt/UserAction";
import { PiQuestionThin } from "react-icons/pi";
import { AiFillExclamationCircle } from "react-icons/ai";

const breadCrumbs: Crumb[] = [
  { label: "Customer Management", to: "/admin/customers" },
  { label: "View Customer Details" },
];

export interface UserActivity {
  uuid: string;
  uniqueID: string;
  name: string;
  action: string;
  action_type: string;
  action_module: string;
  causer_id: string;
  description: string;
  created_at: string;
  causer: Causer;
}

export interface Causer {
  uuid: string;
  name: string;
  approvalStatus: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userActionModalOpen, setUserActionModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string | null>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(
    null
  );

  function showUserAction(activity: UserActivity) {
    setSelectedActivity(activity);
    setUserActionModalOpen(true);
  }

  const userActivitiesMutation = useGetData(
    `admin/user-management/users/show/activities/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportActivitiesMutation = useGetExportData(
    `admin/user-management/users/show/activities/${id}?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`admin/user-management/users/show/${id}`);

  useEffect(() => {
    setFilterPage(1);
    getUserActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sortBy, filterBy]);

  function onPageChange(page: number) {
    setFilterPage(page);
    getUserActivities();
  }

  async function getUserActivities() {
    setUserActivities([]);
    try {
      const response = await userActivitiesMutation.mutateAsync();
      setUserActivities(response.data?.records?.data || []);
      setCurrentPage(response.data?.records?.current_page || 1);
      setTotal(response.data?.records?.total || 0);
      setPageSize(response.data?.records?.per_page || 10);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch users",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  // react to fetch result
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setUser(response.data?.record);
    }
  }, [error, isError, response]);

  const handleExport = () => {
    exportActivitiesMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `activities_export_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`; // adjust extension if CSV/PDF
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Export Successful",
          message: "Your file has been downloaded",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Export Failed",
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2 mb-7">
          <Flex justify="space-between" align="center">
            <div>
              {isLoading ? (
                <Skeleton height={35} width="100%" />
              ) : (
                <Title className="!text-primary-text text-2xl" order={2}>
                  {user?.name}
                </Title>
              )}

              <Text className="!text-secondary-text">
                View and manage customer details
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-10 pt-10 pb-10 ">
        <Card
          shadow="sm"
          radius="lg"
          p="lg"
          className="w-full rounded-2xl border !mb-10 border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <Avatar
              src={user?.avatar}
              alt="Profile"
              radius="md"
              size={40}
              className="!border-3 border-primary-red rounded-lg"
            />
            <Text className="!font-semibold !text-base !text-primary-text">
              Basic Details
            </Text>
          </div>

          <Divider c="#EFEEF2" className="mb-6" />

          {/* Details Grid */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">Username</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.name}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Role</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.roles?.map((role) => role.display_name).join(", ")}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="mantine-md:border-l mantine-md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Email</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.email}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">
                Phone Number
              </Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.phone_number}
                </Text>
              )}
            </Grid.Col>
          </Grid>

          <Grid
            gutter="xl"
            className="md:mt-8 mb-4 pt-8 md:!border-t md:!border-gray-200"
          >
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">
                Date Created
              </Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.created_at
                    ? format(new Date(user.created_at), "MMMM d, yyyy")
                    : "-"}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Created by</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.updated_by}
                </Text>
              )}
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 6 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Last Active</Text>
              {isLoading ? (
                <Skeleton height={16} width="80%" />
              ) : (
                <Text className="!font-medium break-words !text-[#575757]">
                  {user?.created_at
                    ? format(new Date(user.last_login), "MMMM d, yyyy h:mm a")
                    : "-"}
                </Text>
              )}
            </Grid.Col>
          </Grid>
        </Card>

        <Card
          shadow="sm"
          radius="lg"
          p="lg"
          className="w-full rounded-2xl border !mb-10 border-gray-200">
          <Box>
            <Text tt="capitalize" fz={"lg"} fw={600}>
              Game History Overview
            </Text>
            <Text className="!text-secondary-text !text-xs !capitalize">
              An insight into the customers for this draw.
            </Text>
          </Box>
          <Divider my="md" />
          <Box mb={"lg"}>
            <Text
              tt={"capitalize"}
              fz={"sm"}
              className="!text-secondary-text !flex !items-center !gap-x-2"
            >
              Total Number of Game Played{" "}
              <span>
                <PiQuestionThin />
              </span>
            </Text>
            <Text className="!text-primary-red" fz={32} fw={600} mb="xs">
              {(32).toLocaleString()}
            </Text>
            <Text
              tt="capitalize"
              fz="sm"
              fw={600}
              className="!text-secondary-text !item-center !flex !gap-2"
              mb={5}
            >
              <AiFillExclamationCircle />
              <span className="!text-primary-green">22.4%</span> increase over
              the last 30 days
            </Text>
          </Box>
          <Divider my="sm" />
          <SimpleGrid
            className="text-secondary-text"
            my="lg"
            cols={{ base: 1, xs: 2, sm: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "lg", sm: "xl" }}
            mt="md"
          >
            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Historical Ticket Purchased
              </Text>
              <Text fw={700} className="!text-primary-text" fz={28}>
                5,000
              </Text>
              <Text tt="capitalize" fz="sm">
                <span className="!text-primary-green">22.4%</span> increase in the last 3 days
              </Text>
            </Box>
            <Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Average Number of Ticket
              </Text>
              <Text
                fw={700}
                className="!text-primary-text"
                fz={22}
                tt="capitalize"
              >
                22
              </Text>
              <Text tt="capitalize" fz="sm">
                <span className="!text-primary-green">22.4%</span> increase in the last 3 days
              </Text>
            </Box>
            <Box className="sm:!border-b-0  !border-secondary-text/40 py-3 sm:py-0">
              <Text
                tt={"capitalize"}
                fz={"sm"}
                className=" !flex !items-center !gap-x-2"
              >
                Number of Win
              </Text>
              <Text fw={700} className="!text-primary-text" fz={22}>
                30
              </Text>
            </Box>
          </SimpleGrid>
        </Card>

        <section className="text-secondary-text">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  Customer Game History
                </Text>
                <Text className="!text-secondary-text">
                    Track and manage the game history of customer on WinIt platform
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExport}
                loading={exportActivitiesMutation?.isPending}
                disabled={exportActivitiesMutation?.isPending}
              >
                Export
              </Button>
            </Flex>
            <Divider mt="md" mb="lg" />
            <Flex
              justify="space-between"
              px="md"
              mb="lg"
              wrap="wrap"
              gap={8}
              align="center"
            >
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!w-72 !rounded-xl shadow-md"
              />
              <Group>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  rightSection={<IoFilterOutline />}
                  placeholder="Sort by: Show all"
                  data={[
                    { value: "asc", label: "Oldest to Newest" },
                    { value: "desc", label: "Newest to Oldest" },
                  ]}
                  className="!shadow-md"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
                <Select
                  value={filterBy}
                  onChange={setFilterBy}
                  rightSection={<IoFilterOutline />}
                  placeholder="Filter by: Show all"
                  data={[
                    { value: "approved", label: "Approved" },
                    { value: "pending", label: "Pending" },
                    { value: "declined", label: "Declined" },
                  ]}
                  className="!shadow-md"
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Group>
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Date", key: "date" },
                { label: "Time", key: "time" },
                { label: "Affected Module", key: "module" },
                { label: "Action Type", key: "type" },
                { label: "", key: "action" },
              ]}
              data={userActivities}
              loading={userActivitiesMutation.isPending}
              renderItems={(activity) => [
                activity?.created_at
                  ? format(new Date(activity.created_at), "MMMM d, yyyy")
                  : "-",
                activity?.created_at
                  ? format(new Date(activity.created_at), "h:mm a")
                  : "-",
                activity.action_module,
                activity.action_type,

                <ActionIcon
                  onClick={() => showUserAction(activity)}
                  size={35}
                  className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                >
                  <GoArrowUpRight />
                </ActionIcon>,
              ]}
            />

            <TablePaginator
              currentPage={currentPage}
              isLoading={userActivitiesMutation.isPending}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        </section>
      </div>

      {/* Success Modal */}
      <UserAction
        opened={userActionModalOpen}
        onClose={() => setUserActionModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  );
}
