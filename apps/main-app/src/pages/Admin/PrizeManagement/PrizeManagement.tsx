import {
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
  Button,
  TextInput,
  Group,
  Select,
  ActionIcon,
  Switch,
  Modal,
} from "@mantine/core";
import {
  useDeleteData,
  useFetchData,
  useGetData,
  usePostData,
  usePutData,
} from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import {
  IoClose,
  IoFilterOutline,
  IoTrashOutline,
  IoTrophySharp,
} from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import TablePaginator from "../../../components/TablePaginator";
import TabSwitcher, {
  type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import { HiSearch } from "react-icons/hi";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { format } from "date-fns";
import CustomBadge from "../../../components/CustomBadge";
import CustomButton from "../../../components/Buttons/CustomButton";
import { BsPlus } from "react-icons/bs";
import { HiPencil } from "react-icons/hi";
import { useForm } from "@mantine/form";
import { fileToBase64 } from "../../../utils/helper/fileToBase64";
import ImageCard from "../CreateRaffle/ImageCard";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";

interface PrizeStats {
  total: number
  total_active: number
  total_inactive: number
  added_last_3_days: number
  active_last_3_days: number
  inactive_last_3_days: number
}

function isActive(is_active?: string) {
  return is_active === "true";
}


type StatsCard = {
  title: string;
  value: number;
  slug: "total_active" | "total_inactive";
  added: "active_last_3_days" | "inactive_last_3_days";
  className: string;
  color: string;
  period: number;
};

export interface Prize {
  uuid: string;
  uniqueID: string;
  name: string;
  prize_cost: string;
  description: string;
  image: string;
  is_active: string;
  updated_by: string;
  created_at: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const cards: StatsCard[] = [
  {
    title: "Active Prize",
    value: 0,
    slug: "total_active",
    added: "active_last_3_days",
    className:
      "!bg-secondary-green !text-primary-green/50 !border-primary-green/50",
    color: "!text-primary-green",
    period: 3,
  },
  {
    title: "Inactive Prize",
    value: 0,
    slug: "total_inactive",
    added: "inactive_last_3_days",
    className: "!bg-[#f63d68]/10 !text-[#f63d68]/50 !border-[#f63d68]/50 ",
    color: "!text-[#f63d68]",
    period: 3,
  },
];

const tabs: TabSwitcherTab[] = [
  {
    label: "Show All",
    value: "",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

function PrizeManagement() {
  const [createPrizeModalOpen, setCreatePrizeModalOpen] = useState(false);
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
    refetch: refetchStats,
  } = useFetchData(
    `admin/prize-configuration/stats?start_date=${startDate}&end_date=${endDate}`
  );

  const {
    data: prizesResponse,
    isLoading: isLoadingPrizes,
    isError: isErrorPrizes,
    error: prizesError,
    refetch: refetchPrizes,
  } = useFetchData(
    `admin/prize-configuration/all?paginate=1&search=${debouncedSearch}&page=${filterPage}&sort_by=${sortBy || ""}&filter_by=${filterBy || ""}`
  );

  const createPrizeMutation = usePostData("admin/prize-configuration/create");
  const editPrizeMutation = usePutData(
    `admin/prize-configuration/update/${selectedPrize?.uuid}`
  );
  const deactivatePrizeMutation = useGetData(
    `admin/prize-configuration/toggle-status/${selectedPrize?.uuid}`
  );
  const deletePrizeMutation = useDeleteData(`admin/prize-configuration/delete`);

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to fetch prize stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  useEffect(() => {
    if (isErrorPrizes) {
      notifications.show({
        title: "Failed to fetch prizes",
        message:
          (prizesError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }

    if (prizesResponse) {
      setPrizes(prizesResponse.data?.records?.data);
      setCurrentPage(prizesResponse.data?.records?.current_page || 1);
      setTotal(prizesResponse.data?.records?.total || 0);
      setPageSize(prizesResponse.data?.records?.per_page || 10);
    }
  }, [prizesError, isErrorPrizes, prizesResponse]);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      description: "",
      image: "",
    },
    validate: {
      name: (val) => (val.trim().length > 0 ? null : "Prize name is required"),
      description: (val) =>
        val.trim().length > 0 ? null : "Prize description is required",
      image: (val) =>
        val.trim().length > 0 ? null : "Prize image is required",
    },
  });

  const setImage = (base64: string) => {
    form.setFieldValue("image", base64);
  };

  function onPageChange(page: number) {
    setFilterPage(page);
  }
  
  const editPrize = (prize: Prize) => {
    setSelectedPrize(prize);
    form.setValues({
      name: prize.name,
      description: prize.description,
      image: prize.image,
    });
    setCreatePrizeModalOpen(true);
  };

  function togglePrize(prize: Prize) {
    setSelectedPrize(prize);
    setDeactivateAlertModalOpen(true);
  }

  function deletePrize(prize: Prize) {
    setSelectedPrize(prize);
    setDeleteAlertModalOpen(true);
  }

  const handleCreatePrize = async () => {
    if (form.validate().hasErrors) return;

    const payload = form.values;
    try {
      const response = await createPrizeMutation.mutateAsync(payload);
      notifications.show({
        title: "Prize Creation Successful",
        message: response?.message || "Prize created successfully",
        color: "green",
      });

      setAlertModalOpen(false);
      setSuccessModalOpen(true)
      refetchPrizes();
      refetchStats();
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Prize Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const handleEditPrice = async () => {
    if (form.validate().hasErrors) return;

    const payload = form.values;
    try {
      const response = await editPrizeMutation.mutateAsync(payload);
      notifications.show({
        title: "Prize Creation Successful",
        message: response?.message || "Prize created successfully",
        color: "green",
      });

      setAlertModalOpen(false);
      setSuccessModalOpen(true);
      refetchPrizes();
      refetchStats();
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Prize Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await deactivatePrizeMutation.mutateAsync();
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Prize status updated",
        color: "green",
      });
      setSelectedPrize((prev) =>
        prev
          ? {
              ...prev,
              is_active: response.data.is_active,
            }
          : prev
      );
      setDeactivateAlertModalOpen(false);
      setDeactivateSuccessModalOpen(true);
      refetchPrizes();
      refetchStats();
    } catch (error) {
      notifications.show({
        title: "Action Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deletePrizeMutation.mutateAsync(
        selectedPrize?.uuid
      );
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Prize deleted successfully",
        color: "green",
      });
      setDeleteAlertModalOpen(false);
      setDeleteSuccessModalOpen(true);
      refetchPrizes();
      refetchStats();
    } catch (error) {
      notifications.show({
        title: "Action Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const initCreatePrize = () => {
    setSelectedPrize(null);
    form.reset();
    setCreatePrizeModalOpen(true);
  };

  const createPrize = () => {
    setCreatePrizeModalOpen(false);
    setAlertModalOpen(true);
  };

  const prizeActive: boolean = isActive(selectedPrize?.is_active);

  useEffect(() => {
    if (isErrorStats) {
      notifications.show({
        title: "Failed to Load Prize Stats",
        message:
          (statsError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [statsError, isErrorStats]);

  const prizeStats: PrizeStats = statsResponse?.data;

  function closeSuccessModal() {
    setSuccessModalOpen(false);
  }

  function closeFormModal() {
    form.reset();
    setSelectedPrize(null);
    setCreatePrizeModalOpen(false);
  }

  function closeAlertModal() {
    setAlertModalOpen(false);
    setCreatePrizeModalOpen(true);
  }

  return (
    <>
      <div className="text-primary-text px-6 md:px-10 pb-10">
        <Card withBorder mt={"xl"} radius={"md"} py={24}>
          <Flex
            justify={{ base: "start", xs: "space-between" }}
            align={{ base: "start", xs: "center" }}
            direction={{ base: "column", xs: "row" }}
            gap={"md"}
          >
            <div>
              <Text tt={"capitalize"} fz={"lg"} fw={600}>
                Prize Overview
              </Text>
              <Text className="!text-secondary-text !text-sm">
                An snapshot of support issues raised by customer
              </Text>
            </div>
            <Flex
              justify="flex-end"
              px="md"
              mb="lg"
              wrap="wrap"
              gap={8}
              align="center"
            >
              <DateInput
                placeholder="Start Date"
                withAsterisk
                valueFormat="DD/MM/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e)}
                classNames={{
                  label: "!capitalize",
                }}
                popoverProps={{
                  classNames: {
                    dropdown: "!text-primary-text",
                  },
                }}
                rightSection={
                  startDate ? (
                    <IoClose
                      className="cursor-pointer text-gray-500 hover:text-red-500"
                      onClick={() => setStartDate("")}
                    />
                  ) : (
                    <CiCalendar />
                  )
                }
              />

              <DateInput
                placeholder="End Date"
                withAsterisk
                rightSection={
                  endDate ? (
                    <IoClose
                      className="cursor-pointer text-gray-500 hover:text-red-500"
                      onClick={() => setEndDate("")}
                    />
                  ) : (
                    <CiCalendar />
                  )
                }
                valueFormat="DD/MM/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e)}
                classNames={{
                  label: "!capitalize",
                }}
                popoverProps={{
                  classNames: {
                    dropdown: "!text-primary-text",
                  },
                }}
              />
            </Flex>
          </Flex>
          <Divider my="md" />

          {/* === Skeleton for total prizes === */}
          <section>
            <div>
              <Text tt={"capitalize"} className="!text-secondary-text !text-sm">
                Total Number of Prize
              </Text>
              {isLoadingStats ? (
                <Skeleton height={36} width={50} radius="sm" my={7} />
              ) : (
                <Text
                  fw={500}
                  fz={32}
                  className="!text-primary-red !font-semibold"
                >
                  {prizeStats?.total ?? 0}
                </Text>
              )}
            </div>

            {/* === Skeletons for Cards === */}
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
            >
              {isLoadingStats
                ? Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} radius="md" withBorder>
                      <Stack gap="xs">
                        <Skeleton height={20} width="60%" radius="sm" />
                        <Skeleton height={30} width="40%" my={13} radius="sm" />
                        <Skeleton height={14} width="80%" radius="sm" />
                      </Stack>
                    </Card>
                  ))
                : cards.map((item) => (
                    <GridCard
                      key={item.slug}
                      {...{
                        ...item,
                        value: prizeStats?.[item.slug],
                        period: prizeStats?.added_last_3_days,
                        added: prizeStats?.[item.added],
                      }}
                    />
                  ))}
            </SimpleGrid>
          </section>
        </Card>

        {/* === Prize list table === */}

        <section className="text-primary-text my-10">
          <Card withBorder mt={"xl"} radius={"md"} p={0}>
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-text">
                  Prize List
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage prizes on the system
                </Text>
              </div>
              <CustomButton
                border={false}
                className="!rounded-lg !h-12"
                size="sm"
                onClick={initCreatePrize}
                rightSection={
                  <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                    <BsPlus className=" !text-white" />
                  </div>
                }
              >
                Add New
              </CustomButton>
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
              <Flex justify="space-between" align="center">
                <TabSwitcher
                  tabs={tabs}
                  activeTab={filterBy}
                  onChange={setFilterBy}
                />
              </Flex>
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!w-72 !rounded-xl"
              />
              <Select
                value={sortBy}
                onChange={setSortBy}
                rightSection={<IoFilterOutline />}
                placeholder="Sort By: Show All"
                data={[
                  { value: "asc", label: "Oldest to Newest" },
                  { value: "desc", label: "Newest to Oldest" },
                ]}
                classNames={{
                  label: "!capitalize ",
                  options: "text-primary-text",
                }}
              />
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Prize Name", key: "name" },
                { label: "Last Updated", key: "updated" },
                { label: "Status", key: "status" },
                { label: "Action", key: "action" },
              ]}
              data={prizes}
              loading={isLoadingPrizes}
              emptyMessage="No prizes found"
              renderItems={(prize) => {
                const active = isActive(prize.is_active);
                return [
                  <>
                    <Text className="!text-base !text-primary-text !font-medium">
                      {prize.name}
                    </Text>
                    <Text className="!text-secondary-text !text-sm">
                      ID: {prize.uniqueID}
                    </Text>
                  </>,
                  prize?.created_at
                    ? format(new Date(prize.created_at), "MMMM d, yyyy h:mm a")
                    : "-",
                  <CustomBadge
                    status={active ? "successful" : "failed"}
                    label={active ? "Active" : "Inactive"}
                  />,
                  <Group gap="xs">
                    <Switch
                      size="sm"
                      checked={active}
                      onChange={() => togglePrize(prize)}
                      className="!cursor-pointer"
                      color="#12b76a"
                      thumbIcon={<></>}
                    />
                    <ActionIcon
                      onClick={() => editPrize(prize)}
                      size={35}
                      className="!bg-transparent !text-secondary-text !text-xl"
                    >
                      <HiPencil />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => deletePrize(prize)}
                      size={35}
                      className="!bg-transparent !text-primary-red !text-xl"
                    >
                      <IoTrashOutline />
                    </ActionIcon>
                  </Group>,
                ];
              }}
            />

            {/* Pagination */}
            <TablePaginator
              currentPage={currentPage}
              isLoading={isLoadingPrizes}
              total={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </Card>
        </section>
      </div>

      <Modal
        opened={createPrizeModalOpen}
        onClose={closeFormModal}
        centered={true}
        withCloseButton={false}
        radius="lg"
        padding="xl"
        title={
          <div>
            <Text fz={20} fw="bold" className="!text-primary-red">
              {selectedPrize ? "Edit Prize" : "Create New Prize"}
            </Text>
            <Text className="!text-secondary-text">
              {selectedPrize
                ? "Edit and save changes on a prize Details"
                : "Create a new prize to give away to players."}
            </Text>
          </div>
        }
        size="lg"
      >
        <form
          onSubmit={form.onSubmit(createPrize)}
          className="!space-y-4 !text-primary-text"
        >
          <TextInput
            label="Prize Name"
            placeholder="Enter Prize Name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Prize Description"
            placeholder="Enter Prize Description"
            required
            {...form.getInputProps("description")}
          />

          <div>
            <Text fz={14} fw={500} className="!text-primary-text !mb-1">
              Prize Image<span className="!text-red-500"> *</span>
            </Text>
            <ImageCard
              width={360}
              src={form.values.image || undefined}
              height={240}
              onDelete={() => setImage("")}
              onUpload={async (file: File) => {
                try {
                  const base64 = await fileToBase64(file, 1);
                  setImage(base64);
                } catch (error) {
                  notifications.show({
                    title: "Upload failed",
                    message: (error as Error).message,
                    color: "red",
                  });
                }
              }}
            />
            {form.errors.image && (
              <Text fz="xs" c="red" mt={4}>
                {form.errors.image}
              </Text>
            )}
          </div>

          <CustomButton
            fullWidth
            size="lg"
            border={false}
            buttonType="submit"
            className="flex-1 !font-medium"
          >
            {selectedPrize ? "Save Changes" : "Create Prize"}
          </CustomButton>

          <Button
            fullWidth
            size="lg"
            onClick={closeFormModal}
            variant="default"
            className="flex-1 !font-medium"
          >
            No, Close
          </Button>
        </form>
      </Modal>

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${prizeActive ? "Deactivate" : "Reactivate"} Prize ?`}
        description={`${prizeActive ? "Are you sure you want to deactivate this prize ? Kindly note that prize would not be available to view by customers on the website" : "Are you sure you want to reactivate this prize ? Kindly note that prize would now be available to view by customers on the website."}`}
        primaryButton={{
          label: `${prizeActive ? "Deactivate" : "Reactivate"} Prize`,
          onClick: handleToggleStatus,
          disabled: deactivatePrizeMutation?.isPending,
          loading: deactivatePrizeMutation?.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeactivateAlertModalOpen(false),
        }}
      />

      {/* Deactivate Success Modal */}
      <AdminAlertModal
        opened={deactivateSuccessModalOpen}
        onClose={() => setDeactivateSuccessModalOpen(false)}
        status="success"
        title={`Prize ${prizeActive ? "Reactivated" : "Deactivated"}`}
        description={`Congratulations, Prize has been successfully ${prizeActive ? "reactivated" : "deactivated"}`}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />

      {/* Delete Alert Modal */}
      <AdminAlertModal
        opened={deleteAlertModalOpen}
        onClose={() => setDeleteAlertModalOpen(false)}
        status="delete"
        title={<span className="!text-primary-red">Delete Prize ?</span>}
        description="Are you sure you want to delete this prize? Kindly note that action is irreversible and therefore, this prize would be removed / permanently deleted and it associated data."
        primaryButton={{
          label: "Delete Prize",
          onClick: handleDelete,
          disabled: deletePrizeMutation?.isPending,
          loading: deletePrizeMutation?.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeleteAlertModalOpen(false),
        }}
      />

      {/* Delete Success Modal */}
      <AdminAlertModal
        opened={deleteSuccessModalOpen}
        onClose={() => setDeleteSuccessModalOpen(false)}
        status="success"
        title="Prize Deleted"
        description="Congratulations, prize has been successfully deleted"
        primaryButton={{
          label: "Close",
          onClick: () => setDeleteSuccessModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={alertModalOpen}
        onClose={closeAlertModal}
        status="error"
        title={
          <span className="!text-primary-red">
            {selectedPrize ? "Save Changes ?" : "Create Prize ?"}
          </span>
        }
        description={`Are you sure you want save this changes ?  Kindly note that action is irreversible${selectedPrize ? " as this new changes would override the existing data." : " and the new prize would be added to the system."}`}
        primaryButton={{
          disabled:
            createPrizeMutation.isPending || editPrizeMutation.isPending,
          loading: createPrizeMutation.isPending || editPrizeMutation.isPending,
          label: `Yes, Save and ${selectedPrize ? "Update Changes" : "Create Prize"}`,
          onClick: selectedPrize ? handleEditPrice : handleCreatePrize,
        }}
        secondaryButton={{
          label: "Close",
          onClick: closeAlertModal,
        }}
      />

      <AdminAlertModal
        opened={successModalOpen}
        onClose={closeSuccessModal}
        status="success"
        title={
          selectedPrize ? "New Changes Saved" : "Prize Created successfully"
        }
        description={
          selectedPrize
            ? "Congratulation, new changed saved and updated successfully"
            : "Congratulations, new prize has been successfully created"
        }
        primaryButton={{
          label: "Close",
          onClick: closeSuccessModal,
        }}
      />
    </>
  );
}

export default PrizeManagement;

type GridCardProps = Omit<StatsCard, "added"> & {
  added?: number;
};

function GridCard({
  title,
  value,
  added,
  className,
  color,
  period,
}: GridCardProps) {
  return (
    <Card radius={"md"} className={`border ${className}`}>
      <Stack gap={"xs"}>
        <Flex gap="sm" align="center">
          <IoTrophySharp />
          <Text tt="capitalize" fz="sm" className="!text-primary-text">
            {title}
          </Text>
        </Flex>
        <Text fw={500} fz={32} className={`!font-semibold ${color}`}>
          {value ?? 0}
        </Text>
        <Text
          tt="capitalize"
          className="!text-primary-text !capitalize !text-sm"
        >
          <span className={` ${color}`}>
            {Number(added || 0) > 0 ? "+" + added : 0}
          </span>{" "}
          Added in last {period ?? 0} days
        </Text>
      </Stack>
    </Card>
  );
}
