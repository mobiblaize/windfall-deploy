import { Card, Flex, Skeleton, Tabs, Text, Title } from "@mantine/core";
import { TakeAction, type ActionItem } from "../../../components/TakeAction";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import type { Raffle } from "./RaffleList";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import RaffleTransactionalList from "./RaffleTransactionalList";
import CustomerList from "./CustomerList";
import PerformanceMonitor from "./PerformanceMonitor";
import WinnerTab from "./WinnerTab";
import GamedrawTab from "./GamedrawTab";
import CustomBadge from "../../../components/CustomBadge";
import { DatePickerInput } from "@mantine/dates";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../../components/EmptyState";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import CommentsModal from "../../../components/CommentsModal";
import type { ApprovalStatus } from "../../../utils/models/approval";
import ApprovalOfficersTooltip from "../../../components/ApprovalOfficersTooltip";
import { useApprovalProcess } from "../../../utils/hooks/useApprovalProcess";
import { usePermissions } from "../../../utils/hooks/usePermissions";

function ViewRaffles() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  // Date range state - can be passed to child components in future
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [raffle, setRaffle] = useState<Raffle>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("view");
  const [tabs, setTabs] = useState(tabFromUrl || "transactional list");
  const [approvalAction, setApprovalAction] =
    useState<ApprovalStatus>("approved");
  const [approveGameModalOpen, setApproveGameModalOpen] = useState(false);
  const [approvalConfirmationModalOpen, setApprovalConfirmationModalOpen] =
    useState(false);
  const [approvalSuccessModalOpen, setApprovalSuccessModalOpen] =
    useState(false);
  const { canApproveGame } = usePermissions();

  const isApprove = approvalAction === "approved";

  // Fetch raffle data
  const {
    data: raffleResponse,
    isLoading: isLoadingRaffle,
    isError: isErrorRaffle,
    error: raffleError,
    refetch: refetchRaffle,
  } = useFetchData(id ? `admin/game-management/info/${id}` : null);

  // Use the approval process hook
  const { approveProcess, isPending: isApprovingProcess } = useApprovalProcess({
    onSuccess: () => {
      setApproveGameModalOpen(false);
      setApprovalSuccessModalOpen(true);
      refetchRaffle();
    },
  });

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== tabs) {
      setTabs(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  useEffect(() => {
    if (isErrorRaffle) {
      notifications.show({
        title: "Failed to fetch Raffle",
        message:
          (raffleError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (raffleResponse) {
      setRaffle(raffleResponse.data);
    }
  }, [raffleError, isErrorRaffle, raffleResponse]);

  const handleTabChange = (value: string | null) => {
    const newTab = value ?? "website";
    setTabs(newTab);
    const params = new URLSearchParams(window.location.search);
    params.set("view", newTab);
    navigate(`?${params.toString()}`);
  };

  // Determine if this is an instant raffle route or regular raffle route
  const isInstantRaffleRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles");
  }, [location.pathname]);

  // Determine base route for relative navigation
  const baseRoute = useMemo(() => {
    return isInstantRaffleRoute ? "/admin/instant-raffles" : "/admin/raffles";
  }, [isInstantRaffleRoute]);

  // Handle edit raffle action
  const handleEditRaffle = useCallback(() => {
    if (!id) return;
    navigate(`${baseRoute}/edit/${id}`);
  }, [id, baseRoute, navigate]);

  // Handle start draw action
  const handleStartDraw = useCallback(() => {
    if (!id) return;
    const drawPath = `/admin/draws?game_id=${id}`;
    navigate(drawPath);
  }, [id, navigate]);

  const isInstantGame = raffle?.instant_game === "true";
  const gamePendingApproval = raffle?.approvalStatus === "pending";
  const gameApproved = raffle?.approvalStatus === "approved";
  const gameDeclined = raffle?.approvalStatus === "declined";

  const tablinks = useMemo(() => {
    const links = [
      "transactional list",
      "customer list",
      "performance monitor",
      "winner",
    ];
    if (!isInstantGame) {
      links.push("game draw");
    }
    return links;
  }, [isInstantGame]);

  // Memoize action items based on raffle data
  const actionItems = useMemo<ActionItem[]>(() => {
    if (!id) return [];

    const items: ActionItem[] = [];
    const isLive = raffle?.main_active_status === "live";
    const isEnded = raffle?.main_active_status === "ended";
    const isPublished = raffle?.status === "published";
    const isPendingApproval = raffle?.approvalStatus === "pending";

    if (isPendingApproval) {
      items.push({
        id: "edit-raffle",
        label: "edit raffle",
        description: isLive
          ? "Live game edit is limited"
          : "Edit raffle details and settings",
        onClick: handleEditRaffle,
        disabled: isLoadingRaffle || !raffle,
        color: "default",
      });
    }

    if (canApproveGame && isPendingApproval && isPublished) {
      items.push(
        {
          id: "approve-game",
          label: "Approve Raffle Game",
          description: "Approve this raffle to go live for players",
          onClick: () => initiateApproval("approved"),
          disabled: !canApproveGame,
          color: "green",
          divider: true, // Add divider before this action
        },
        {
          id: "decline-game",
          label: "Reject Raffle Game",
          description: "Reject this raffle from going live",
          onClick: () => initiateApproval("declined"),
          disabled: !canApproveGame,
          color: "red",
          divider: true, // Add divider before this action
        }
      );
    }

    // Start a Draw action - only for scheduled raffles (not instant games)
    if (!isInstantGame && gameApproved && isEnded) {
      items.push({
        id: "start-draw",
        label: "start a draw",
        description: "Start a draw for this game",
        onClick: handleStartDraw,
        disabled: isLoadingRaffle || !raffle || !isEnded,
        color: "green",
        divider: true, // Add divider before this action
      });
    }

    return items;
  }, [
    id,
    raffle,
    isLoadingRaffle,
    handleEditRaffle,
    handleStartDraw,
    isInstantGame,
    gameApproved,
    canApproveGame,
  ]);

  // Helper function to get status badge info
  const getStatusInfo = () => {
    if (!raffle) return { status: "pending" as const, label: "Loading" };

    if (gamePendingApproval)
      return { status: "pending" as const, label: "Pending Approval" };
    if (gameDeclined) return { status: "failed" as const, label: "Rejected" };

    if (raffle.main_active_status === "live") {
      return { status: "successful" as const, label: "Live" };
    } else if (raffle.main_active_status === "upcoming") {
      return { status: "pending" as const, label: "Upcoming" };
    } else if (raffle.main_active_status === "ended") {
      return { status: "inactive" as const, label: "Ended" };
    } else if (raffle.main_active_status === "instant") {
      return { status: "active" as const, label: "Instant" };
    }
    return { status: "inactive" as const, label: raffle.main_active_status };
  };

  const statusInfo = getStatusInfo();

  const initiateApproval = (status: ApprovalStatus) => {
    setApprovalAction(status);
    setApprovalConfirmationModalOpen(true);
  };

  const breadCrumbs: Crumb[] = useMemo(
    () => [
      {
        label: isInstantRaffleRoute
          ? "Instant Raffle Management"
          : "Raffle Management",
        to: baseRoute,
      },
      { label: "Raffle List", to: `${baseRoute}/all` },
      { label: `${raffle?.name || "Loading..."}` },
    ],
    [isInstantRaffleRoute, baseRoute, raffle?.name]
  );

  // If no ID, show error state
  if (!id) {
    return (
      <div className="text-primary-text px-6 md:px-10 py-10">
        <EmptyState
          title="No Raffle Selected"
          description="Please select a raffle to view details"
        />
      </div>
    );
  }

  // If error occurred and no raffle data
  if (isErrorRaffle && !raffle) {
    return (
      <div className="text-primary-text px-6 md:px-10 py-10">
        <EmptyState
          title="Failed to Load Raffle"
          description="Unable to fetch raffle details. Please try again."
        />
      </div>
    );
  }

  const approveGame = async (reason: string) => {
    await approveProcess({
      process_id: raffle?.approval_workflows?.approver?.process_id,
      reason,
      status: approvalAction,
    });
  };

  return (
    <>
      <Tabs
        value={tabs}
        onChange={handleTabChange}
        classNames={{
          tab: "!text-secondary-text hover:!text-primary-red !transition !bg-white hover:!bg-light-red !text-[14px] !border-transparent !font-medium data-[active=true]:!text-primary-red hover:!border-primary-red  data-[active=true]:!border-primary-red !pb-4",
          list: "gap-6",
        }}
      >
        <div className="text-primary-text">
          <Card className="bg-white !border-b !p-0 !border-b-gray-200">
            <div className="px-6 md:px-10 py-1">
              <DynamicBreadcrumbs items={breadCrumbs} />
            </div>
          </Card>

          <div className="bg-white border-b-2 border-[#d0d5dd]">
            <div className="px-6 md:px-10 pt-7 pb-2 mb-7">
              <Flex
                justify="space-between"
                align="center"
                wrap={"wrap"}
                gap={"md"}
              >
                <div className="flex-1">
                  {isLoadingRaffle ? (
                    <>
                      <Skeleton height={35} width="60%" mb="xs" />
                      <Skeleton height={20} width="40%" />
                    </>
                  ) : raffle ? (
                    <>
                      <Title className="!text-primary-text text-2xl" order={2}>
                        {raffle.name}
                      </Title>
                      <Text className="!text-secondary-text">
                        {raffle.uniqueID} • View and manage raffle details
                      </Text>
                    </>
                  ) : (
                    <>
                      <Title className="!text-primary-text text-2xl" order={2}>
                        Raffle Details
                      </Title>
                      <Text className="!text-secondary-text">
                        Loading raffle information...
                      </Text>
                    </>
                  )}
                </div>

                <Flex align="center" wrap="wrap" gap={20} justify="end">
                  {isLoadingRaffle ? (
                    <Skeleton height={32} width={80} />
                  ) : (
                    <CustomBadge
                      status={
                        raffle?.status === "published"
                          ? "successful"
                          : "inactive"
                      }
                      label={raffle?.status}
                    />
                  )}

                  {isLoadingRaffle ? (
                    <Skeleton height={32} width={80} />
                  ) : (
                    <ApprovalOfficersTooltip
                      officers={
                        raffle?.approval_workflows?.approval_processes ?? []
                      }
                    >
                      <CustomBadge
                        status={statusInfo.status}
                        label={statusInfo.label}
                      />
                    </ApprovalOfficersTooltip>
                  )}

                  <DatePickerInput
                    type="range"
                    minDate={raffle?.start_date}
                    maxDate={raffle?.end_date}
                    value={dateRange}
                    onChange={setDateRange}
                    valueFormat="YYYY-MM-DD"
                    placeholder="Select date range"
                    clearable
                    rightSection={
                      !dateRange[0] && !dateRange[1] ? (
                        <CiCalendar />
                      ) : undefined
                    }
                    classNames={{
                      label: "!capitalize",
                    }}
                    popoverProps={{
                      classNames: {
                        dropdown: "!text-primary-text",
                      },
                    }}
                  />
                  <TakeAction
                    actions={actionItems}
                    loading={isLoadingRaffle}
                    disabled={isLoadingRaffle || !raffle}
                  />
                </Flex>
              </Flex>
            </div>

            <Flex
              className="px-6 md:px-10 pb-5"
              gap={15}
              justify="space-between"
            >
              <Tabs.List>
                {tablinks.map((item) => (
                  <Tabs.Tab
                    key={item}
                    value={item}
                    className="relative
					px-5 py-2
					!font-sm sm:!font-base 
					!capitalize 
					cursor-pointer 
					rounded-t-md 
					text-secondary-text
					hover:text-primary-red
					data-[active=true]:z-[1] 
					data-[active=true]:text-[var(--color-primary-red)] 
					data-[active=true]:border-b-2
					data-[active=true]:border-b-solid 
					data-[active=true]:border-b-2[var(--color-primary-red)]
					data-[active=true]:hover:text-primary-red text-nowrap"
                  >
                    {item}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Flex>
          </div>

          {tabs === "transactional list" && (
            <RaffleTransactionalList
              raffleId={id}
              startDate={dateRange[0] || ""}
              endDate={dateRange[1] || ""}
            />
          )}
          {tabs === "customer list" && (
            <CustomerList
              raffleId={id}
              startDate={dateRange[0] || ""}
              endDate={dateRange[1] || ""}
            />
          )}
          {tabs === "performance monitor" && (
            <PerformanceMonitor
              raffleId={id}
              startDate={dateRange[0] || ""}
              endDate={dateRange[1] || ""}
              isInstantRaffleRoute={isInstantRaffleRoute}
            />
          )}
          {tabs === "winner" && (
            <WinnerTab raffleId={id} isInstantGame={isInstantGame} />
          )}
          {tabs === "game draw" && !isInstantGame && (
            <GamedrawTab
              raffleId={id}
              startDate={dateRange[0] || ""}
              endDate={dateRange[1] || ""}
            />
          )}
        </div>
      </Tabs>

      <AdminAlertModal
        opened={approvalConfirmationModalOpen}
        onClose={() => setApprovalConfirmationModalOpen(false)}
        status="error"
        title={`${isApprove ? "Approve" : "Reject"} New Raffle Game ?`}
        description={`${isApprove ? "Are you sure you want to approve this new raffle draw/game? Kindly note that this game would go live now and customer would be able to view raffle details and buy raffle ticket accordingly." : "Are you sure you want to reject this new raffle draw/game? Kindly note that this game would not go live now."}`}
        primaryButton={{
          label: `${isApprove ? "Yes, Approve" : "Yes, Reject"} Raffle Game`,
          onClick: () => {
            setApprovalConfirmationModalOpen(false);
            setApproveGameModalOpen(true);
          },
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setApprovalConfirmationModalOpen(false),
        }}
      />

      <CommentsModal
        modalOpen={approveGameModalOpen}
        title={`${isApprove ? "Why Approve Game?" : "Why Reject Game? "}`}
        description={`${isApprove ? "Enter comment on game here" : "Provide a reason to why this game is rejected"}`}
        primaryButtonLabel={`${isApprove ? "Complete Game Approval" : "Complete Game Rejection"}`}
        label={`${isApprove ? "Comment here" : "Enter reason"}`}
        submitComment={approveGame}
        isLoading={isApprovingProcess}
        closeModal={() => setApproveGameModalOpen(false)}
      />

      <AdminAlertModal
        opened={approvalSuccessModalOpen}
        onClose={() => setApprovalSuccessModalOpen(false)}
        status="success"
        title={`Raffle ${isApprove ? "Approved" : "Rejected"}`}
        description={`${isApprove ? "Congratulation, you have successfully approved a New Raffle Game / Draw and posted it live" : "You have successfully rejected a New Raffle Game / Draw"}`}
        primaryButton={{
          label: "Close",
          onClick: () => setApprovalSuccessModalOpen(false),
        }}
      />
    </>
  );
}

export default ViewRaffles;
