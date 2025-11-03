import {
  Box,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
  Card,
  Flex,
  Divider,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import { AreaChart } from "@mantine/charts";


type ChannelBreakdown = {
  platform: string;
  total_revenue: number;
  tickets_sold: number;
  percentage_increase?: number;
};

type TrendPoint = { date: string; registrations: number };

function CustomerTab({
  breakdowns = [],
  loading,
  acquisitionTrend = [],
  acquisitionTrendLoading,
}: {
  breakdowns?: ChannelBreakdown[];
  loading?: boolean;
  acquisitionTrend?: TrendPoint[];
  acquisitionTrendLoading?: boolean;
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
                        {item.tickets_sold} tickets sold
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
      <Card withBorder my="lg" w="100%">
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

        {acquisitionTrendLoading ? (
          <Skeleton height={300} radius="md" />
        ) : acquisitionTrend && acquisitionTrend.length > 0 ? (
          <AreaChart
            h={300}
            w="100%"
            data={acquisitionTrend}
            dataKey="date"
            type="default"
            series={[{ name: "registrations", color: "red" }]}
            curveType="monotone"
            strokeWidth={2}
            fillOpacity={0.2}
            gridAxis="xy"
            withLegend={false}
            withTooltip
          />
        ) : (
          <Text fz="sm" c="dimmed" ta="center" py="lg">
            No acquisition data for the selected period.
          </Text>
        )}
      </Card>
    </>
  );
}

export default CustomerTab;
