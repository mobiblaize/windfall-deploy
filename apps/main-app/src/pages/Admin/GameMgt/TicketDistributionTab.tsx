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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import type {
  Last30DaysPlatformBreakdown,
  TicketStats,
} from "./PerformanceMonitor";

function TicketDistributionTab({
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

  const chartData =
    ticketStats?.map((stat) => ({
      date: new Date(stat.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      "Tickets Sold": stat.total,
    })) || [];

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

      {/* --- Sales trend analysis section --- */}
      <Card withBorder my="lg">
        <Flex justify="space-between">
          <Text
            tt="capitalize"
            fz="sm"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            sales trend analysis
            <span>
              <PiQuestionThin />
            </span>
          </Text>
        </Flex>
        <Divider my="md" />

        <div className="w-full">
          {loading ? (
            <Skeleton height={300} radius="md" />
          ) : chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis
                    label={{
                      value: "Tickets Sold",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                    tickCount={6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="left"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "16px" }}
                  />
                  <Bar
                    dataKey="Tickets Sold"
                    fill="#2196F3"
                    radius={[4, 4, 0, 0]}
                    name="Tickets Sold"
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    // Smooth hover transition like Transaction Graph
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Text fz="sm" c="dimmed" ta="center" py="lg">
              No ticket sales data available for the selected period.
            </Text>
          )}
        </div>
      </Card>
    </>
  );
}

export default TicketDistributionTab;
