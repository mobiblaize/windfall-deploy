import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import "@mantine/dates/styles.css";
import { Link } from "react-router-dom";
import type { Raffle } from "../../models/raffles";
import { useGetData } from "../../utils/hooks/useApis";
import LoadingState from "../../components/LoadingState";
import RaffleCard from "../../components/RaffleCard";
import EmptyState from "../../components/EmptyState";
import { Container, Flex, SimpleGrid, Text } from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";

export default function RelatedRaffles({ id }: {id?: string}) {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  const getRafflesMutation = useGetData(
    `guest/games/related/${id}?paginate=1&limit=${9}`
  );

  useEffect(() => {
    getRaffles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getRaffles() {
    try {
      const response = await getRafflesMutation.mutateAsync();
      setRaffles(response.data?.data || []);
    } catch (error) {
      setRaffles([]);
      notifications.show({
        title: "Failed to fetch raffle games",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <Container fluid my="xl">
      <Flex
        className=" flex !flex-col md:!flex-row md:!justify-between"
        mb="xl"
      >
        <div>
          <Text fz="h2" fw={700} className="!text-gray-800">
            Related Raffles
          </Text>
          <Text fz="md" className="!text-secondary-text">
            Checkout related raffle games and play now
          </Text>
        </div>
        <Link to="/raffles">
          <Text className="!text-primary-red !flex !gap-x-3 !items-center hover:!underline hover:!text-primary-red/60 transition-all ease-linear duration-300">
            Explore All
            <span>
              <RiArrowRightUpLine className="bg-black text-white font-light text-lg rounded-full" />
            </span>
          </Text>
        </Link>
      </Flex>

      <div className="">
        {getRafflesMutation.isPending && (
          <LoadingState description="Fetching games from the system." />
        )}

        {!getRafflesMutation.isPending && (
          <>
            {raffles.length ? (
              <>
                <SimpleGrid
                  type="container"
                  cols={{ base: 1, "680px": 2, "1080px": 3 }}
                  spacing={{ base: 10 }}
                >
                  {raffles.map((raffle, idx) => (
                    <RaffleCard key={idx} {...raffle} />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <EmptyState
                description="No Raffles Found"
                title="No raffles found"
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
}
