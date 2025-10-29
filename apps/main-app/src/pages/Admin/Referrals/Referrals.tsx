import {
  Card,
  Divider,
  Flex,
  Text,
  Button,
  TextInput,
  Group,
  Select,
  Box,
  ActionIcon,
  Grid,
} from "@mantine/core";
import {
  useFetchData,
  useGetExportData,
  usePutData,
} from "../../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IoFilterOutline } from "react-icons/io5";
import "@mantine/dates/styles.css";
import TablePaginator from "../../../components/TablePaginator";
import { HiDocumentArrowDown } from "react-icons/hi2";
import TabSwitcher, {
  type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import { HiSearch } from "react-icons/hi";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { format } from "date-fns";
import CustomBadge from "../../../components/CustomBadge";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { FaEdit } from "react-icons/fa";
import { useForm } from "@mantine/form";
import RenderSkeletonText from "../../../components/RenderSkeletonText";

// Models renamed to align with referral context
export interface ReferralSummary {
  total_received: number;
  total_spent: number;
  transactions: ReferralTransactionPagination;
}

export interface ReferralTransactionPagination {
  current_page: number;
  data: ReferralTransaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
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
  type: string;
  order: ReferralOrder;
  referred_user: ReferralUser;
}

export interface ReferralConfig {
  purchase_reward: number;
  registration_reward: number;
  updated_at: string;
}

export interface ReferralOrder {
  uuid: string;
  uniqueID: string;
  amount: string;
}

export interface ReferralUser {
  uuid: string;
  uniqueID: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

export interface PaginationLink {
  url?: string;
  label: string;
  active: boolean;
}

const referralTabs: TabSwitcherTab[] = [
  {
    label: "Referral Used",
    value: "redeemed",
  },
  {
    label: "Referral Earned",
    value: "awarded",
  },
];

function ReferralModule() {
  const [referralTransactions, setReferralTransactions] = useState<
    ReferralTransaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string | null>("");
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState<string>("redeemed");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [apiPage, setApiPage] = useState<number>(1);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [transactionsPerPage, setTransactionsPerPage] = useState<number>(0);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [confirmConfigModalOpen, setConfirmConfigModalOpen] = useState(false);
  const [successConfigModalOpen, setSuccessConfigModalOpen] = useState(false);

  // Using useForm for Referral Config fields
  const referralConfigForm = useForm<{
    purchase_reward: string;
    registration_reward: string;
  }>({
    initialValues: {
      purchase_reward: "",
      registration_reward: "",
    },
    validate: {
      purchase_reward: (value) =>
        value === "" || isNaN(Number(value)) || Number(value) < 0
          ? "Enter a valid non-negative number"
          : undefined,
      registration_reward: (value) =>
        value === "" || isNaN(Number(value)) || Number(value) < 0
          ? "Enter a valid non-negative number"
          : undefined,
    },
    validateInputOnChange: false,
    validateInputOnBlur: true,
  });

  // For server errors to show in form

  // Fetch referral config
  const {
    data: referralConfigResponse,
    isLoading: isLoadingReferralConfig,
    isError: isErrorReferralConfig,
    error: referralConfigError,
    refetch: refetchReferralConfig,
  } = useFetchData(`admin/referral/config-amount`);

  // Fetch transaction list
  const {
    data: referralTransactionsResponse,
    isLoading: isLoadingReferralTransactions,
    isError: isErrorReferralTransactions,
    error: referralTransactionsError,
  } = useFetchData(
    `admin/referral/transactions?paginate=1&search=${debouncedSearchTerm}&page=${apiPage}&sort_by=${sortOrder || ""}&filter_by=${transactionTypeFilter || ""}`
  );

  // Export referral transactions
  const exportReferralTransactionsMutation = useGetExportData(
    `admin/referral/transactions?paginate=1&search=${debouncedSearchTerm}&page=${apiPage}&sort_by=${sortOrder || ""}&filter_by=${transactionTypeFilter || ""}&export=1`
  );

  // Edit referral config
  const updateReferralConfigMutation = usePutData(
    `admin/referral/config-amount`
  );

  useEffect(() => {
    if (isErrorReferralConfig) {
      notifications.show({
        title: "Failed to fetch referral configuration",
        message:
          (referralConfigError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [referralConfigError, isErrorReferralConfig]);

  useEffect(() => {
    if (isErrorReferralTransactions) {
      notifications.show({
        title: "Failed to fetch referral transactions",
        message:
          (referralTransactionsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }

    if (referralTransactionsResponse) {
      setReferralTransactions(
        referralTransactionsResponse.data?.transactions?.data
      );
      setCurrentPage(
        referralTransactionsResponse.data?.transactions?.current_page || 1
      );
      setTotalTransactions(
        referralTransactionsResponse.data?.transactions?.total || 0
      );
      setTransactionsPerPage(
        referralTransactionsResponse.data?.transactions?.per_page || 10
      );
    }
  }, [
    referralTransactionsError,
    isErrorReferralTransactions,
    referralTransactionsResponse,
  ]);

  // Preload config values into modal on open
  useEffect(() => {
    if (referralConfigResponse?.data) {
      referralConfigForm.setValues({
        purchase_reward:
          referralConfigResponse.data.purchase_reward !== undefined
            ? String(referralConfigResponse.data.purchase_reward)
            : "",
        registration_reward:
          referralConfigResponse.data.registration_reward !== undefined
            ? String(referralConfigResponse.data.registration_reward)
            : "",
      });
      referralConfigForm.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralConfigResponse]);

  const handleExportReferralTransactions = () => {
    exportReferralTransactionsMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `referral_transactions_export_${new Date()
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

  function handlePageChange(page: number) {
    setApiPage(page);
  }

  useEffect(() => {
    if (isErrorReferralConfig) {
      notifications.show({
        title: "Failed to Load Referral Configuration",
        message:
          (referralConfigError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [referralConfigError, isErrorReferralConfig]);

  const referralConfig: ReferralConfig = referralConfigResponse?.data;

  /**
   * Using useForm for validation now.
   * If valid, close config modal and open confirmation modal.
   */
  const handleConfigFormSaveClick = () => {
    const isValid = referralConfigForm.validate();
    if (isValid.hasErrors) return;
    setConfigModalOpen(false);
    setConfirmConfigModalOpen(true);
  };

  /**
   * Actually submit the update (PUT) for referral config.
   */
  const handleConfigConfirmSave = () => {
    updateReferralConfigMutation.mutate(
      {
        purchase_reward: parseFloat(referralConfigForm.values.purchase_reward),
        registration_reward: parseFloat(
          referralConfigForm.values.registration_reward
        ),
      },
      {
        onSuccess: () => {
          setConfirmConfigModalOpen(false);
          setSuccessConfigModalOpen(true);
          refetchReferralConfig();
        },
        onError: (err) => {
          // Handle validation/error shape from API if present
          if (err?.message) {
            notifications.show({
              title: "Update Failed",
              message:
                (err as { message: string })?.message || "An error occurred",
              color: "var(--color-primary-red)",
            });
          }
          setConfirmConfigModalOpen(false);
          setConfigModalOpen(true);
        },
      }
    );
  };

  return (
    <>
      <div className="text-primary-text px-6 md:px-10 pb-10">
        <Box
          className="border border-dashed border-primary-red bg-secondary-red rounded-2xl mt-11"
          px={"xl"}
          py={"xl"}
        >
          <div className="!space-y-1">
            <Text tt="capitalize" c="var(--secondary-text)">
              Referral Bonus Configuration
            </Text>
            <Flex justify={"space-between"} align={"center"}>
              <Text
                tt="capitalize"
                fw={800}
                className="!text-primary-text !text-4xl"
              >
                1 Referral Point
              </Text>
              <Flex justify={"flex-end"} align={"center"} gap={15}>
                <Text
                  tt="capitalize"
                  className="!text-primary-red !text-4xl !mt-1"
                  fw={800}
                >
                  {isLoadingReferralConfig ? (
                    <RenderSkeletonText width={90} height={36} />
                  ) : (
                    formatCurrency(referralConfig?.purchase_reward || 0)
                  )}
                </Text>

                <ActionIcon
                  onClick={() => setConfigModalOpen(true)}
                  className="!inline-flex !bg-[#FFD5D6] !pr-2 !py-2 !pl-3 !w-fit !h-fit !rounded-xl"
                >
                  <FaEdit className="!text-2xl !text-primary-red" />
                </ActionIcon>
              </Flex>
            </Flex>
            {isLoadingReferralConfig ? (
              <RenderSkeletonText width={200} height={18} className="!mt-2" />
            ) : referralConfig?.updated_at ? (
              <Text tt="capitalize" c="var(--secondary-text)">
                Last Edited:{" "}
                {format(new Date(referralConfig?.updated_at), "MMMM d, yyyy")}
              </Text>
            ) : (
              " - "
            )}
          </div>
        </Box>

        <section className="my-10">
          <Card withBorder mt={"xl"} radius={"md"} p={0}>
            {/* Header */}
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-text">
                  Referral Bonus Transactions
                </Text>
                <Text className="!text-secondary-text">
                  A list of all referral bonus transactions
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
                onClick={handleExportReferralTransactions}
                loading={exportReferralTransactionsMutation?.isPending}
                disabled={exportReferralTransactionsMutation?.isPending}
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
              <Flex justify="space-between" align="center">
                <TabSwitcher
                  tabs={referralTabs}
                  activeTab={transactionTypeFilter}
                  onChange={setTransactionTypeFilter}
                />
              </Flex>
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                className="!w-72 !rounded-xl shadow-md"
              />
              <Group>
                <Select
                  value={sortOrder}
                  onChange={setSortOrder}
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
              </Group>
            </Flex>

            <DynamicTableSection
              headers={[
                { label: "Transaction ID", key: "id" },
                { label: "User Detail", key: "user" },
                { label: "Date & Time", key: "date" },
                { label: "Transaction Value", key: "value" },
                { label: "Status", key: "status" },
              ]}
              data={referralTransactions}
              loading={isLoadingReferralTransactions}
              emptyMessage="No referral transactions found"
              renderItems={(transaction) => [
                transaction.order?.uniqueID,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {transaction.referred_user?.firstname}{" "}
                    {transaction.referred_user?.lastname}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {transaction.referred_user?.uniqueID}
                  </Text>
                </>,
                <>
                  <Text className="!text-base !text-primary-text !font-medium">
                    {transaction.date
                      ? format(new Date(transaction.date), "MMMM d, yyyy")
                      : " - "}
                  </Text>
                  <Text className="!text-secondary-text !text-sm">
                    {transaction.date
                      ? format(new Date(transaction.date), "h:mm a")
                      : ""}
                  </Text>
                </>,
                formatCurrency(transaction.amount),
                <CustomBadge
                  status={
                    transaction.status === "awarded"
                      ? "active"
                      : transaction.status === "redeemed"
                        ? "successful"
                        : transaction.status === "pending"
                          ? "pending"
                          : "failed"
                  }
                  label={transaction.status}
                />,
              ]}
            />

            {/* Pagination */}
            <TablePaginator
              currentPage={currentPage}
              isLoading={isLoadingReferralTransactions}
              total={totalTransactions}
              pageSize={transactionsPerPage}
              onPageChange={handlePageChange}
            />
          </Card>
        </section>
      </div>

      {/* Referral Config Modal */}
      <AdminAlertModal
        opened={configModalOpen}
        status="error"
        padding={"xl"}
        size="lg"
        onClose={() => setConfigModalOpen(false)}
        title={<div className="!text-center">Referral Bonus Configuration</div>}
        description={
          <form
            onSubmit={referralConfigForm.onSubmit(handleConfigFormSaveClick)}
            className="!text-start text-secondary-text"
            autoComplete="off"
          >
            <Text mb={"xl"} className="text-center">
              Edit and update the referral bonus configuration
            </Text>
            <Text className="!text-secondary-text !text-sm"></Text>
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Purchase Reward
                </h3>
                <p className="text-base text-secondary-text">
                  Enter purchase reward value
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  placeholder="Enter purchase reward"
                  {...referralConfigForm.getInputProps("purchase_reward")}
                  type="number"
                  min={0}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Referral Reward
                </h3>
                <p className="text-base text-secondary-text">
                  Enter referral reward value
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  placeholder="Enter referral reward"
                  {...referralConfigForm.getInputProps("registration_reward")}
                  type="number"
                  min={0}
                />
              </Grid.Col>
            </Grid>
            {/* Show any non-field errors */}
          </form>
        }
        primaryButton={{
          label: "Save Changes",
          loading: updateReferralConfigMutation.isPending,
          onClick: () =>
            referralConfigForm.onSubmit(handleConfigFormSaveClick)(),
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfigModalOpen(false),
        }}
      />

      {/* Confirm Save Modal */}
      <AdminAlertModal
        opened={confirmConfigModalOpen}
        onClose={() => setConfirmConfigModalOpen(false)}
        status="error"
        title="Save Changes ?"
        description="Are you sure you want to save these new changes? Kindly note, that prior changes will be overridden by this new change and action is irreversible."
        primaryButton={{
          label: updateReferralConfigMutation.isPending
            ? "Saving..."
            : "Save Changes",
          loading: updateReferralConfigMutation.isPending,
          onClick: handleConfigConfirmSave,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => {
            setConfirmConfigModalOpen(false);
            setConfigModalOpen(true);
          },
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successConfigModalOpen}
        status="success"
        title="New Changes Saved"
        description="Congratulations, new changes have been successfully saved and updated."
        secondaryButton={{
          label: "Close",
          onClick: () => {
            setSuccessConfigModalOpen(false);
          },
        }}
      />
    </>
  );
}

export default ReferralModule;
