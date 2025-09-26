import { useEffect, useState } from "react";
import FilterPill from "./FilterPill";
import RaffleCard from "./RaffleCard";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { CiCalendar } from "react-icons/ci";
import "@mantine/dates/styles.css";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { useGetData } from "../utils/hooks/useApis";
import type { Raffle } from "../models/raffles";
import { Link } from "react-router-dom";
import { Text } from "@mantine/core";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

export default function SampleRafflesGames() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "live" | "upcoming" | "instant" | "ended"
  >("all");
  const [drawTime, setDrawTime] = useState("");
  const [total, setTotal] = useState<number>(0);

  const getRafflesMutation = useGetData(
    `guest/games/all-games?paginate=1&type=${statusFilter}&time_preset=${drawTime}&start_date=${startDate}&end_date=${endDate}&page=${1}&limit=${9}`
  );

  useEffect(() => {
    getRaffles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, startDate, endDate, drawTime]);

  async function getRaffles() {
    try {
      const response = await getRafflesMutation.mutateAsync();
      setRaffles(response.data?.data || []);
      setTotal(response.data?.total || 0);
    } catch (error) {
      setRaffles([]);
      setTotal(0);
      notifications.show({
        title: "Failed to fetch raffle games",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  return (
    <section className="bg-white py-15">
      <div className="px-6 md:px-16 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Raffles/Games</h2>
            <p className="text-sm text-gray-500">
              One ticket. One shot. Your keys could be next.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={drawTime}
              onChange={(e) => setDrawTime(e.target.value)}
              className="border border-[#d0d5dd] rounded px-3 py-2 text-sm text-gray-600"
            >
              <option value="">Draw Time</option>
              <option value="next_24_hours">Next 24 Hours</option>
              <option value="next_3_hours">Next 3 Hours</option>
              <option value="next_3_hours">Next 3 Hours</option>
            </select>

            <DateInput
              placeholder="Start Date"
              withAsterisk
              valueFormat="DD/MM/YYYY"
              value={startDate}
              onChange={(e) => setStartDate(e)}
              classNames={{
                label: "!capitalize",
              }}
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
              rightSection={
                startDate ? (
                  <IoClose
                    className="cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => setStartDate('')}
                  />
                ) : (
                  <CiCalendar />
                )
              }
            />

            <DateInput
              placeholder="End Date"
              withAsterisk
              rightSection={
                endDate ? (
                  <IoClose
                    className="cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => setStartDate('')}
                  />
                ) : (
                  <CiCalendar />
                )
              }
              valueFormat="DD/MM/YYYY"
              value={endDate}
              onChange={(e) => setEndDate(e)}
              classNames={{
                label: "!capitalize",
              }}
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
            />

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

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          <FilterPill
            label="All Games"
            count={total}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <FilterPill
            label="Live Games"
            count={total}
            active={statusFilter === "live"}
            onClick={() => setStatusFilter("live")}
          />
          <FilterPill
            label="Upcoming Games"
            count={total}
            active={statusFilter === "upcoming"}
            onClick={() => setStatusFilter("upcoming")}
          />
          <FilterPill
            label="Instant Games"
            count={total}
            active={statusFilter === "instant"}
            onClick={() => setStatusFilter("instant")}
          />
          <FilterPill
            label="Ended Games"
            count={total}
            active={statusFilter === "ended"}
            onClick={() => setStatusFilter("ended")}
          />
        </div>
      </div>

      {/* Raffles Grid */}
      <div className="px-6 md:px-16">
        {getRafflesMutation.isPending && (
          <LoadingState description="Fetching games from the system." />
        )}

        {!getRafflesMutation.isPending && (
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
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
