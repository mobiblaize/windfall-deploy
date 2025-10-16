import { Button, Card, Flex, Skeleton, Tabs, Text, Title } from "@mantine/core";
import StatusBadge from "../../../components/StatusBadge";
import { FaCalendarAlt } from "react-icons/fa";
import { TakeAction } from "../../../components/FilterMenu";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import type { Raffle } from "./RaffleList";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RaffleTransactionalList from "./RaffleTransactionalList";
import CustomerList from "./CustomerList";
import PerformanceMonitor from "./PerformanceMonitor";
import WinnerTab from "./WinnerTab";
import GamedrawTab from "./GamedrawTab";

function ViewRaffles() {
  const [raffle, setRaffle] = useState<Raffle>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("view");
  const [tabs, setTabs] = useState(tabFromUrl || "transactional list");
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== tabs) {
      setTabs(tabFromUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

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

  const isLoading = false;

  const breadCrumbs: Crumb[] = [
    { label: "Raffle Management", to: "/admin/raffles" },
    { label: "View a raffle", to: "/admin/raffles/list" },
    { label: `${raffle?.name}` },
  ];

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
              <div>
                {isLoading ? (
                  <Skeleton height={35} width="100%" />
                ) : (
                  <Title className="!text-primary-text text-2xl" order={2}>
                    Test Raffle
                  </Title>
                )}
                <Text className="!text-secondary-text">
                  View and manage role details
                </Text>
              </div>

              <Flex align="center" wrap="wrap" gap={20} justify="end">
                <StatusBadge status="live" />
                <Button
                  variant="outline"
                  className="!text-secondary-text !border-secondary-text !py-2 scale-90 sm:scale-100"
                  rightSection={<FaCalendarAlt className="text-primary-red" />}
                >
                  Date: April 2025
                </Button>
                <TakeAction />
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

          <Tabs.Panel value="transactional list">
            <RaffleTransactionalList />
          </Tabs.Panel>
          <Tabs.Panel value="customer list">
            <CustomerList />
          </Tabs.Panel>
          <Tabs.Panel value="performance monitor">
            <PerformanceMonitor />
          </Tabs.Panel>
          <Tabs.Panel value="winner">
            <WinnerTab />
          </Tabs.Panel>
          <Tabs.Panel value="game draw">
            <GamedrawTab />
          </Tabs.Panel>
      </div>
    </Tabs>
  );
}

export default ViewRaffles;
