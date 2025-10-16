import { Box, SimpleGrid, Stack, Text, Skeleton } from "@mantine/core";
import { formatCurrency } from "../../../utils/helper/formatCurrency";
import type { TicketPerformance } from "./PerformanceMonitor";

function TicketPerformanceCard({
  ticketPerformance,
  loading,
}: {
  ticketPerformance?: TicketPerformance;
  loading: boolean;
}) {

  // Skeleton placeholder generator
  const renderSkeletonGrid = (count = 3) => (
    <SimpleGrid
      cols={{ base: 1, xs: 2, sm: 3 }}
      spacing={{ base: 10, sm: "xl" }}
      verticalSpacing={{ base: "lg", sm: "xl" }}
      mt="md"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Stack
          key={i}
          gap="xs"
          className={
            i < count - 1 ? "sm:border-r border-secondary-text/30" : ""
          }
        >
          <Skeleton height={20} width="40%" radius="md" />
          <Box>
            <Skeleton height={14} width="60%" radius="md" mb={4} />
            <Skeleton height={14} width="50%" radius="md" />
          </Box>
          <Skeleton height={12} width="80%" radius="md" />
        </Stack>
      ))}
    </SimpleGrid>
  );

  return (
    <section className="my-7">
      <Text fw={500}>Distribution of Ticket Sales by Discounting Structure</Text>

      {loading ? (
        renderSkeletonGrid(3)
      ) : ticketPerformance?.all_tickets_stats?.length ? (
        <>
          {Array.from(
            {
              length: Math.ceil(
                ticketPerformance.all_tickets_stats.length / 3
              ),
            },
            (_, rowIndex) => {
              const start = rowIndex * 3;
              const end = start + 3;
              const rowItems = ticketPerformance.all_tickets_stats.slice(
                start,
                end
              );

              return (
                <SimpleGrid
                  key={rowIndex}
                  cols={{ base: 1, xs: 2, sm: 3 }}
                  spacing={{ base: 10, sm: "xl" }}
                  verticalSpacing={{ base: "lg", sm: "xl" }}
                  mt={rowIndex === 0 ? "md" : "xl"}
                >
                  {rowItems.map((item, index) => (
                    <Stack
                      key={index}
                      gap="xs"
                      className={
                        index < rowItems.length - 1
                          ? "sm:border-r border-secondary-text/30"
                          : ""
                      }
                    >
                      <Text className="!text-primary-red" fz="lg" fw={500}>
                        {item.ticket_tier}
                      </Text>

                      <Box>
                        <Text>
                          {item.ticket_count?.toLocaleString()} Tickets
                        </Text>
                        <Text>{formatCurrency(item.total_revenue)}</Text>
                      </Box>

                      <Text
                        tt="capitalize"
                        fz="xs"
                        className="!text-secondary-text"
                      >
                        {item.tickets_last_days} tickets sold in the last{" "}
                        {"" + item.days_count?.toLocaleString()} days
                      </Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              );
            }
          )}
        </>
      ) : (
        <Text fz="sm" c="dimmed" mt="md">
          No ticket performance data available.
        </Text>
      )}
    </section>
  );
}

export default TicketPerformanceCard;
