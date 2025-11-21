import {
  Text,
  Flex,
  Divider,
  ActionIcon,
  Group,
  Button,
  Box,
  TextInput,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
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
import UserAction from "../UserMgt/UserAction";
import type { Role } from "../RoleMgt/RoleMgt";

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
  uniqueID: string;
  approvalStatus: string;
  roles: Role[];
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export default function AuditTrail() {
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

  const {
    data: modulesResponse,
    isError,
    error,
  } = useFetchData(`guest/dropdown/get-all-modules`);

  const userActivitiesMutation = useGetData(
    `admin/audit-trail-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const exportActivitiesMutation = useGetExportData(
    `admin/audit-trail-management/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}&export=1`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Modules",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [error, isError, modulesResponse]);

  const modules = (() => {
    const modulesData: { name: string }[] = modulesResponse?.data ?? [];
    if (!modulesData?.length) return [{ value: "", label: "Filter By: All" }];

    return [
      { value: "", label: "Filter By: All" },
      ...modulesData.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    ];
  })();

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
      <div className="px-6 md:px-10 pt-10 pb-10 ">
        <section className="text-secondary-text">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  User activities
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage user activity within platform
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
                className="!w-72 !rounded-xl"
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
                  data={modules}
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
              </Group>
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "User Details", key: "user" },
                { label: "Date", key: "date" },
                { label: "Role", key: "role" },
                { label: "Action Type", key: "type" },
                { label: "Affected Module", key: "module" },
                { label: "", key: "action" },
              ]}
              data={userActivities}
              loading={userActivitiesMutation.isPending}
              renderItems={(activity) => [
                <>
                  <Text className="!text-base !font-medium">
                    {activity.causer.name}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {activity.causer.uniqueID}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !font-medium">
                    {activity.created_at
                      ? format(new Date(activity.created_at), "MMMM d, yyyy")
                      : ""}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {activity.created_at
                      ? format(new Date(activity.created_at), "h:mm a")
                      : ""}
                  </Text>
                </>,
                activity.causer?.roles?.[0]?.name,
                activity.action_type,
                activity.action_module,

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
