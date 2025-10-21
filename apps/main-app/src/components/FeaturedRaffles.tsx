import { useEffect, useState } from "react";
import RaffleCard from "./RaffleCard";
import { notifications } from "@mantine/notifications";
import "@mantine/dates/styles.css";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { useFetchData } from "../utils/hooks/useApis";
import type { Raffle } from "../models/raffles";
import { Link } from "react-router-dom";
import { Text } from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";

export default function SampleRafflesGames() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

    const {
      data: response,
      isLoading,
      isError,
      error,
    } = useFetchData(`guest/games/all-games?paginate=0&limit=${9}&featured=1`);
  
    useEffect(() => {
      if (isError) {
        notifications.show({
          title: "Failed to fetch featured Games",
          message:
            (error as { message?: string })?.message || "An error occurred",
          color: "red",
        });
      }
      if (response) {
        setRaffles(response.data);
      }
    }, [error, isError, response]);


  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="px-6 md:px-16 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Raffles
            </h2>
            <p className="text-gray-500 text-sm">
              One ticket. One shot. Your keys could be next.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Link to="/raffles">
              <Text className="!text-primary-red !flex !gap-x-3 !items-center hover:!underline hover:!text-primary-red/60 transition-all ease-linear duration-300">
                Explore All
                <span>
                  <RiArrowRightUpLine className="bg-black text-white font-light text-lg rounded-full" />
                </span>
              </Text>
            </Link>
          </div>
        </div>

      </div>

      {/* Raffles Grid */}
      <div className="px-6 md:px-16">
        {isLoading && (
          <LoadingState description="Fetching games from the system." />
        )}

        {!isLoading && (
          <>
            {raffles.length ? (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  {raffles.map((raffle, idx) => (
                    <RaffleCard key={idx} {...raffle} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                description="No Raffles Found"
                title="No raffles found"
                format="secondary"
                fullWidth={true}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
