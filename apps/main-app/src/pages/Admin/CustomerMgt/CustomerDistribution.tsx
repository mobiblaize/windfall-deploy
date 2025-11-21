import { Card, Divider, Flex, Group, Tabs, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerTab from "./CustomerTab";
import { DatePickerInput, MonthPickerInput } from "@mantine/dates";
import { useGetData } from "../../../utils/hooks/useApis";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";

interface AcquisitionDayPlatform {
  platform: string;
  registrations: number;
  date: string;
}

interface AcquisitionDayBreakdown {
  date: string;
  total_registrations: number;
  platforms: AcquisitionDayPlatform[];
}

type TrendPoint = { date: string; registrations: number };

function CustomerDistribution() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("sales");
  const [tabs, setTabs] = useState(tabFromUrl || "web");
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [month, setMonth] = useState<string | undefined>(undefined);

  const [platformBreakdown, setPlatformBreakdown] = useState<
    Array<{
      platform: string;
      total_revenue: number;
      tickets_sold: number;
      percentage_increase?: number;
    }>
  >([]);

  const {
    mutate: fetchDistribution,
    data: distributionResponse,
    isPending: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetData(
    `admin/customer-management/get-customer-distribution-by-channel?start_date=${startDate || ""}&end_date=${endDate || ""}&month=${month || ""}`
  );

  // Acquisition trend (web/mobile) - ignore pos
  const {
    mutate: fetchAcquisitionTrend,
    data: acquisitionTrendResponse,
    isPending: isAcqPending,
  } = useGetData(
    `admin/customer-management/get-customer-acquisition-trend?start_date=${startDate || ""}&end_date=${endDate || ""}&month=${month || ""}`
  );

  useEffect(() => {
    fetchDistribution();
    fetchAcquisitionTrend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, month]);

  useEffect(() => {
    if (isFetchError) {
      // Optional: notify
    }
    const pb = distributionResponse?.data?.platform_breakdown ?? [];
    setPlatformBreakdown(pb);
  }, [distributionResponse, isFetchError, fetchError]);

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
  const tablinks = [
    {
      label: "Website",
      value: "web",
    },
    {
      label: "Mobile App",
      value: "mobile",
    },
  ];

  const breakdowns = useMemo(() => {
    return platformBreakdown.filter((x) => x.platform === tabs);
  }, [platformBreakdown, tabs]);

  // Prepare acquisition trend series for chart
  const trendSeries = useMemo(() => {
    const daily: AcquisitionDayBreakdown[] = acquisitionTrendResponse?.data?.daily_breakdown ?? [];
    const toPoint = (date: string, registrations: number): TrendPoint => ({ date, registrations });
    const web: TrendPoint[] = daily.map((d) => {
      const w = (d.platforms || []).find((p) => p.platform === "web");
      return toPoint(d.date, Number(w?.registrations || 0));
    });
    const mobile: TrendPoint[] = daily.map((d) => {
      const m = (d.platforms || []).find((p) => p.platform === "mobile");
      return toPoint(d.date, Number(m?.registrations || 0));
    });
    return { web, mobile };
  }, [acquisitionTrendResponse]);

  const activeTrend: TrendPoint[] = tabs === "web" ? trendSeries.web : trendSeries.mobile;

  return (
    <div className="text-secondary-text my-10">
      <Card withBorder mt={"xl"} radius={"md"} px={"md"}>
        {/* Header */}
        <Flex justify="space-between" pt="lg" wrap="wrap" gap={8}>
          <div>
            <Text fz={20} fw="bold" className="!text-primary-text">
              Customer Distribution by Channel
            </Text>
            <Text className="!text-secondary-text">
              Distribution of customer Purchase by Channels
            </Text>
          </div>

          <Group>
            <DatePickerInput
              type="range"
              value={dateRange}
              onChange={(val: [string | null, string | null]) => {
                setDateRange(val);
                const [start, end] = val;
                if ((start && end) || (!start && !end)) {
                  setStartDate(start || "");
                  setEndDate(end || "");
                  setMonth(undefined);
                }
              }}
              valueFormat="YYYY-MM-DD"
              placeholder="Select date range"
              maxDate={new Date()}
              clearable
              rightSection={!dateRange[0] && !dateRange[1] ? <CiCalendar /> : undefined}
              className="!rounded-xl !shadow-sm"
              classNames={{
                label: "!capitalize",
              }}
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
            />

            <MonthPickerInput
              value={month ?? null}
              onChange={(value) => {
                if (!value) {
                  setMonth(undefined);
                } else {
                  setMonth(String(value).slice(0, 7));
                  setStartDate("");
                  setEndDate("");
                  setDateRange([null, null]);
                }
              }}
              rightSection={!month ? <CiCalendar /> : undefined}
              valueFormat="YYYY-MM"
              placeholder="Select month"
              clearable
              className="!rounded-xl !shadow-sm"
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
            />
          </Group>
        </Flex>

        <Divider my="md" />

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
            <CustomerTab
              breakdowns={breakdowns}
              loading={isFetching}
              acquisitionTrend={activeTrend}
              acquisitionTrendLoading={isAcqPending}
            />
          </Tabs.Panel>
          <Tabs.Panel value="mobile">
            <CustomerTab
              breakdowns={breakdowns}
              loading={isFetching}
              acquisitionTrend={activeTrend}
              acquisitionTrendLoading={isAcqPending}
            />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </div>
  );
}

export default CustomerDistribution;
