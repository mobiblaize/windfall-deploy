import { Card, Flex, Skeleton, Tabs, Text, Title } from "@mantine/core";
import { TakeAction, type ActionItem } from "../../../components/TakeAction";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import type { Raffle } from "./RaffleList";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import RaffleTransactionalList from "./RaffleTransactionalList";
import CustomerList from "./CustomerList";
import PerformanceMonitor from "./PerformanceMonitor";
import WinnerTab from "./WinnerTab";
import GamedrawTab from "./GamedrawTab";
import CustomBadge from "../../../components/CustomBadge";
import { DatePickerInput } from "@mantine/dates";
import { CiCalendar } from "react-icons/ci";
import { FaEdit, FaPlay, FaCopy, FaEye } from "react-icons/fa";
import "@mantine/dates/styles.css";
import { useFetchData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../../components/EmptyState";

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

  // Fetch raffle data
  const {
    data: raffleResponse,
    isLoading: isLoadingRaffle,
    isError: isErrorRaffle,
    error: raffleError,
  } = useFetchData(id ? `admin/game-management/info/${id}` : null);

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

  const tablinks = [
    "transactional list",
    "customer list",
    "performance monitor",
    "winner",
    "game draw",
  ];

  // Determine if this is an instant raffle route or regular raffle route
  const isInstantRaffleRoute = useMemo(() => {
    return location.pathname.includes("/instant-raffles/");
  }, [location.pathname]);

  // Handle edit raffle action
  const handleEditRaffle = useCallback(() => {
    if (!id) return;
    const editPath = isInstantRaffleRoute 
      ? `/admin/instant-raffles/edit/${id}`
      : `/admin/raffles/edit/${id}`;
    navigate(editPath);
  }, [id, isInstantRaffleRoute, navigate]);

  // Handle start draw action
  const handleStartDraw = useCallback(() => {
    if (!id) return;
    const drawPath = `/admin/draws?game_id=${id}`;
    navigate(drawPath);
  }, [id, navigate]);

  // Handle duplicate raffle action
  const handleDuplicateRaffle = useCallback(() => {
    if (!id) return;
    const createPath = isInstantRaffleRoute 
      ? `/admin/instant-raffles/create?duplicate=${id}`
      : `/admin/raffles/create?duplicate=${id}`;
    navigate(createPath);
    notifications.show({
      title: "Duplicating Raffle",
      message: "You will be redirected to create a new raffle based on this one",
      color: "blue",
    });
  }, [id, isInstantRaffleRoute, navigate]);

  // Handle view details action
  const handleViewDetails = useCallback(() => {
    // Scroll to details section or switch to a details tab
    const detailsTab = "performance monitor";
    setTabs(detailsTab);
    const params = new URLSearchParams(window.location.search);
    params.set("view", detailsTab);
    navigate(`?${params.toString()}`, { replace: true });
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, setTabs]);

  // Memoize action items based on raffle data
  const actionItems = useMemo<ActionItem[]>(() => {
    if (!id) return [];

    const items: ActionItem[] = [];
    const isInstantGame = raffle?.instant_game === "true" || raffle?.is_scheduled === "false";
    const isLive = raffle?.main_active_status === "live";
    const isEnded = raffle?.main_active_status === "ended";

    // Edit Raffle action - always available
    items.push({
      id: "edit-raffle",
      label: "edit raffle",
      description: isLive 
        ? "edit raffle details and settings (live game)" 
        : "edit raffle details and settings",
      onClick: handleEditRaffle,
      disabled: isLoadingRaffle || !raffle,
      icon: <FaEdit size={14} />,
      color: "default",
    });

    // View Details / Performance Monitor
    items.push({
      id: "view-details",
      label: "view details",
      description: "view performance metrics and analytics",
      onClick: handleViewDetails,
      disabled: isLoadingRaffle || !raffle,
      icon: <FaEye size={14} />,
      color: "blue",
    });

    // Start a Draw action - only for scheduled raffles (not instant games)
    if (!isInstantGame) {
      items.push({
        id: "start-draw",
        label: "start a draw",
        description: "create and manage draws for this scheduled game",
        onClick: handleStartDraw,
        disabled: isLoadingRaffle || !raffle || isEnded,
        icon: <FaPlay size={14} />,
        color: "green",
        divider: true, // Add divider before this action
      });
    }

    // Duplicate Raffle action
    items.push({
      id: "duplicate-raffle",
      label: "duplicate raffle",
      description: "create a new raffle based on this one",
      onClick: handleDuplicateRaffle,
      disabled: isLoadingRaffle || !raffle,
      icon: <FaCopy size={14} />,
      color: "default",
      divider: true, // Add divider before this action
    });

    return items;
  }, [
    id, 
    raffle, 
    isLoadingRaffle, 
    handleEditRaffle,
    handleStartDraw,
    handleDuplicateRaffle,
    handleViewDetails,
  ]);

  // Helper function to get status badge info
  const getStatusInfo = () => {
    if (!raffle) return { status: "pending" as const, label: "Loading" };
    
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

  const breadCrumbs: Crumb[] = [
    { label: "Raffle Management", to: "/admin/raffles" },
    { label: "Raffle List", to: "/admin/raffles/all" },
    { label: `${raffle?.name || "Loading..."}` },
  ];

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

  return (
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
            <Flex justify="space-between" align="center">
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
                  <CustomBadge status={statusInfo.status} label={statusInfo.label} />
                )}
                
                <DatePickerInput
                  type="range"
                  value={dateRange}
                  onChange={setDateRange}
                  valueFormat="YYYY-MM-DD"
                  placeholder="Select date range"
                  clearable
                  rightSection={
                    !dateRange[0] && !dateRange[1] ? <CiCalendar /> : undefined
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

          <Flex className="px-6 md:px-10 pb-5" gap={15} justify="space-between">
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
          />
        )}
        {tabs === "winner" && (
          <WinnerTab
            raffleId={id}
            startDate={dateRange[0] || ""}
            endDate={dateRange[1] || ""}
          />
        )}
        {tabs === "game draw" && <GamedrawTab />}
      </div>
    </Tabs>
  );
}

export default ViewRaffles;
