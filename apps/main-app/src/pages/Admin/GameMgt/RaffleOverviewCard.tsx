import {
  Box,
  SimpleGrid,
  Card,
  Divider,
  Text,
  Skeleton,
  Center,
} from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import type { TicketSalesStats } from "./PerformanceMonitor";

function RaffleOverviewCard({ ticketSalesStats, loading }: {ticketSalesStats?: TicketSalesStats, loading: boolean}) {
  const highestGrossing =
    ticketSalesStats?.highest_grossing_platform?.highest_grossing || [];

  const renderSkeletonText = (width = "60%", height = 18) => (
    <Skeleton height={height} width={width} radius="md" />
  );

  // ✅ Empty-state helper
  const isEmpty = !ticketSalesStats || Object.keys(ticketSalesStats).length === 0;

  return (
    <Card mt="md" withBorder radius="md">
      {/* ---- Total Revenue ---- */}
      <Box mb="lg">
        <Text
          tt="capitalize"
          fz="sm"
          className="!text-secondary-text !flex !items-center !gap-x-2"
        >
          total revenue generated <PiQuestionThin />
        </Text>

        {loading ? (
          <Skeleton height={36} width={180} mt={4} radius="md" />
        ) : isEmpty ? (
          <Text c="dimmed" fz="sm">
            No revenue data available.
          </Text>
        ) : (
          <Text className="!text-primary-green" fz={32} fw={700}>
            {formatCurrency(
              ticketSalesStats?.highest_grossing_platform?.total_transaction_value
            )}
          </Text>
        )}
      </Box>

      {/* ---- Tickets & Customers Overview ---- */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {/* --- Total Tickets --- */}
        <Box>
          <Text
            tt="capitalize"
            fz="xs"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            total number of tickets sold <PiQuestionThin />
          </Text>

          {loading ? (
            <Box className="space-y-2">
              {renderSkeletonText("60%", 10)}
              {renderSkeletonText("80%", 20)}
              {renderSkeletonText("70%", 10)}
            </Box>
          ) : isEmpty ? (
            <Text c="dimmed" fz="sm">
              No ticket sales data available.
            </Text>
          ) : (
            <>
              <Text fw={700} fz="xl">
                {ticketSalesStats?.total_tickets_sold?.toLocaleString()}
              </Text>
              {ticketSalesStats?.tickets_last_period && (
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  <span className="text-primary-green">
                    {ticketSalesStats?.tickets_last_period_value?.toLocaleString()}
                  </span>{" "}
                  tickets sold in the last {ticketSalesStats?.tickets_last_period}.
                </Text>
              )}
            </>
          )}
        </Box>

        {/* --- Total Customers --- */}
        <Box>
          <Divider orientation="vertical" />
          <Text
            tt="capitalize"
            fz="xs"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            total number of customers <PiQuestionThin />
          </Text>

          {loading ? (
            <Box className="space-y-2">
              {renderSkeletonText("60%", 10)}
              {renderSkeletonText("80%", 20)}
              {renderSkeletonText("70%", 10)}
            </Box>
          ) : isEmpty ? (
            <Text c="dimmed" fz="sm">
              No customer data available.
            </Text>
          ) : (
            <>
              <Text fw={700} fz="xl">
                {ticketSalesStats?.total_customers?.toLocaleString()}
              </Text>
              {ticketSalesStats?.new_customers_last_period && (
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  <span className="text-primary-green">
                    +{ticketSalesStats?.customer_growth_percentage?.toLocaleString()}%
                  </span>{" "}
                  in the last {ticketSalesStats?.new_customers_last_period}
                </Text>
              )}
            </>
          )}
        </Box>
      </SimpleGrid>

      <Divider my="xl" />

      {/* ---- New Customers & Top Platform ---- */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {/* --- New Customers --- */}
        <Box>
          <Text
            tt="capitalize"
            fz="xs"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            total number of new customers <PiQuestionThin />
          </Text>

          {loading ? (
            <Box className="space-y-2">
              {renderSkeletonText("60%", 10)}
              {renderSkeletonText("80%", 20)}
            </Box>
          ) : isEmpty ? (
            <Text c="dimmed" fz="sm">
              No new customer data available.
            </Text>
          ) : (
            <>
              <Text fw={700} fz="xl">
                {ticketSalesStats?.new_customers_last_period_value?.toLocaleString()}
              </Text>
              {ticketSalesStats?.new_customers_last_period && (
                <Text
                  tt="capitalize"
                  fz="xs"
                  className="!text-secondary-text !flex !items-center !gap-x-2"
                >
                  <span className="text-primary-green">
                    +{ticketSalesStats?.customer_growth_percentage?.toLocaleString()}%
                  </span>{" "}
                  in the last {ticketSalesStats?.new_customers_last_period}
                </Text>
              )}
            </>
          )}
        </Box>

        {/* --- Top Grossing Platform --- */}
        <Box>
          <Divider orientation="vertical" />
          <Text
            tt="capitalize"
            fz="xs"
            className="!text-secondary-text !flex !items-center !gap-x-2"
          >
            highest grossing platform <PiQuestionThin />
          </Text>

          {loading ? (
            <Box className="space-y-2">
              {renderSkeletonText("60%", 10)}
              {renderSkeletonText("80%", 20)}
              {renderSkeletonText("70%", 10)}
            </Box>
          ) : highestGrossing.length === 0 ? (
            <Text c="dimmed" fz="sm">
              No platform data available.
            </Text>
          ) : (
            <>
              <Text fw={700} fz="xl">
                <span className="!capitalize">
                  {highestGrossing[0]?.name}
                </span>{" "}
                <span className="text-primary-red">
                  {highestGrossing[0]?.tickets_sold?.toLocaleString()} Ticket(s)
                </span>
              </Text>
              <Text
                tt="capitalize"
                fz="xs"
                className="!text-secondary-text !flex !items-center !gap-x-2"
              >
                <span className="text-primary-green">
                  {formatCurrency(highestGrossing[0]?.total_revenue)}
                </span>{" "}
                in Revenue Generated
              </Text>
            </>
          )}
        </Box>
      </SimpleGrid>

      <Divider my="xl" />

      {/* ---- Remaining Platforms ---- */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {Array.from({ length: 2 }).map((_, i) => (
            <Box className="space-y-2" key={i}>
              {renderSkeletonText("60%", 10)}
              {renderSkeletonText("80%", 20)}
              {renderSkeletonText("70%", 10)}
            </Box>
          ))}
        </SimpleGrid>
      ) : highestGrossing.length > 1 ? (
        Array.from(
          {
            length: Math.ceil((highestGrossing.length - 1) / 2),
          },
          (_, rowIndex) => {
            const start = 1 + rowIndex * 2;
            const end = start + 2;
            const rowItems = highestGrossing.slice(start, end);
            return (
              <SimpleGrid key={rowIndex} cols={{ base: 1, sm: 2 }} spacing="lg">
                {rowItems.map((platform, index) => (
                  <Box key={index}>
                    <Text
                      tt="capitalize"
                      fz="xs"
                      className="!text-secondary-text !flex !items-center !gap-x-2"
                    >
                      Highest Grossing Platform <PiQuestionThin />
                    </Text>
                    <Text fw={700} fz="xl">
                      <span className="!capitalize">{platform.name}</span>{" "}
                      <span className="text-primary-red">
                        {platform.tickets_sold?.toLocaleString()} Ticket(s)
                      </span>
                    </Text>
                    <Text
                      tt="capitalize"
                      fz="xs"
                      className="!text-secondary-text !flex !items-center !gap-x-2"
                    >
                      <span className="text-primary-green">
                        {formatCurrency(platform.total_revenue)}
                      </span>{" "}
                      in Revenue Generated
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            );
          }
        )
      ) : (
        <Center py="md">
          <Text fz="sm" c="dimmed">
            No additional platforms found.
          </Text>
        </Center>
      )}
    </Card>
  );
}

export default RaffleOverviewCard;
