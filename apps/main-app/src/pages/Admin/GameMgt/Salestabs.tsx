import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TicketDistributionTab from "./TicketDistributionTab";
import type { TicketSalesStats, TicketStats } from "./PerformanceMonitor";

const tablinks = [
  {
    label: "Website",
    value: "web"
  },
  {
    label: "Mobile App",
    value: "mobile"
  }
];

function Salestabs({ salesStats, loading, ticketStats }: {salesStats?: TicketSalesStats, loading?: boolean, ticketStats?: TicketStats[]}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("sales");
  const [tabs, setTabs] = useState(tabFromUrl || "web");
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== tabs) {
      setTabs(tabFromUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  const handleTabChange = (value: string | null) => {
    const newTab = value ?? "web";
    setTabs(newTab);
    const params = new URLSearchParams(window.location.search);
    params.set("sales", newTab);
    navigate(`?${params.toString()}`);
  };

  const breakdowns = (()=> {
    return salesStats?.highest_grossing_platform?.last_30_days_platform_breakdown?.filter(x=>x.platform===tabs) ?? [];
  })();

  const filteredTicketStats = (platform: string) => {
    if (!ticketStats) return undefined;
    return ticketStats.map(stat => ({
      ...stat,
      total: platform === "web" ? stat.web : stat.mobile
    }));
  };

  return (
    <Tabs
      value={tabs}
      onChange={handleTabChange}
      className="space-y-7 "
      unstyled
    >
      <Tabs.List className="mr-5 !tracking-wide flex flex-nowrap">
        {tablinks.map((item) => (
          <Tabs.Tab
            key={item.value}
            value={item.value}
            className="
              relative     
              px-4 py-2 
              font-medium 
              !capitalize 
              cursor-pointer 
              rounded-t-md 
              text-secondary-text
              hover:text-primary-red
              data-[active=true]:z-[1] 
              data-[active=true]:text-[var(--color-primary-red)] 
              data-[active=true]:border-b-[3px] 
              data-[active=true]:border-b-solid 
              data-[active=true]:border-b-2[var(--color-primary-red)]
              data-[active=true]:hover:text-primary-red
            "
          >
            {item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <Tabs.Panel value="web">
        <TicketDistributionTab breakdowns={breakdowns} loading={loading} ticketStats={filteredTicketStats("web")}/>
      </Tabs.Panel>
      <Tabs.Panel value="mobile">
        <TicketDistributionTab breakdowns={breakdowns} loading={loading} ticketStats={filteredTicketStats("mobile")}/>
      </Tabs.Panel>
    </Tabs>
  );
}

export default Salestabs;
