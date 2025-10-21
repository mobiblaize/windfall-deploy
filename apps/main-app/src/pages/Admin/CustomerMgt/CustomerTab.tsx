import {
  Box,
  SimpleGrid,
  Stack,
  Card,
  Flex,
  Divider,
  Text,
  Skeleton,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import type {
  Last30DaysPlatformBreakdown,
  TicketStats,
} from "../GameMgt/PerformanceMonitor";
import { AreaChart } from "@mantine/charts";

function CustomerTab({
  breakdowns = [],
  loading,
  ticketStats = [],
}: {
  breakdowns?: Last30DaysPlatformBreakdown[];
  loading?: boolean;
  ticketStats?: TicketStats[];
}) {
  const totalRevenue = breakdowns.reduce(
    (sum, item) => sum + (item.total_revenue || 0),
    0
  );

  return (
    <>
      {/* --- Total revenue summary --- */}
      <Box>
        <Text
          tt="capitalize"
          fz="sm"
          className="!text-secondary-text !flex !items-center !gap-x-2"
        >
          total revenue generated
          <span>
            <PiQuestionThin />
          </span>
        </Text>

        {loading ? (
          <Skeleton height={36} width={180} mt={4} radius="md" />
        ) : (
          <Text fw={500} fz={28} className="!text-primary-green">
            {formatCurrency(totalRevenue)}
          </Text>
        )}
      </Box>

      {/* --- Dynamic platform breakdowns --- */}
      {loading ? (
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          my="lg"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Stack key={i} gap="xs">
              <Skeleton height={16} width="60%" />
              <Skeleton height={20} width="40%" />
              <Skeleton height={14} width="80%" />
            </Stack>
          ))}
        </SimpleGrid>
      ) : breakdowns.length > 0 ? (
        <>
          {Array.from(
            { length: Math.ceil(breakdowns.length / 3) },
            (_, rowIndex) => {
              const start = rowIndex * 3;
              const end = start + 3;
              const rowItems = breakdowns.slice(start, end);

              return (
                <SimpleGrid
                  key={rowIndex}
                  my="lg"
                  cols={{ base: 1, xs: 2, sm: 3 }}
                  spacing={{ base: 10, sm: "xl" }}
                  verticalSpacing={{ base: "lg", sm: "xl" }}
                >
                  {rowItems.map((item, index) => (
                    <Stack
                      key={index}
                      gap="xs"
                      className={
                        index < rowItems.length - 1
                          ? "sm:border-r border-b sm:border-b-0 border-secondary-text/30"
                          : ""
                      }
                    >
                      <Text
                        tt="capitalize"
                        fz="sm"
                        className="!text-secondary-text !flex !items-center !gap-x-2"
                      >
                        {item.platform}
                        <span>
                          <PiQuestionThin />
                        </span>
                      </Text>

                      <Text>{formatCurrency(item.total_revenue)}</Text>

                      <Text
                        tt="capitalize"
                        fz="xs"
                        className="!text-secondary-text"
                      >
                        {item.tickets_sold} tickets sold in the last{" "}
                        {item.days_count} days
                      </Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              );
            }
          )}
        </>
      ) : (
        <Text fz="sm" c="dimmed" my="lg">
          No platform breakdown data available.
        </Text>
      )}

      {/* --- Customer Acquisition Trend section --- */}
      <Card withBorder my="lg">
        <Flex justify="space-between">
          <Text
            tt="capitalize"
            fz="sm"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            Customer Acquisition Trend
            <span>
              <PiQuestionThin />
            </span>
          </Text>
        </Flex>
        <Divider my="md" />

        <div className="w-full">
          {loading ? (
            <Skeleton height={300} radius="md" />
          ) : (
            <AreaChart
              h={300}
              data={[
                { month: "Jan", customers: 420 },
                { month: "Feb", customers: 460 },
                { month: "Mar", customers: 520 },
                { month: "Apr", customers: 580 },
                { month: "May", customers: 640 },
                { month: "Jun", customers: 720 },
                { month: "Jul", customers: 810 },
                { month: "Aug", customers: 760 },
                { month: "Sep", customers: 780 },
                { month: "Oct", customers: 830 },
                { month: "Nov", customers: 860 },
                { month: "Dec", customers: 900 },
              ]}
              dataKey="month"
              type="default"
              series={[{ name: "customers", color: "red" }]}
              curveType="monotone"
              strokeWidth={2}
              fillOpacity={0.2}
              gridAxis="xy"
              withLegend={false}
              withTooltip
            />
          )}
        </div>
      </Card>
    </>
  );
}

export default CustomerTab;
