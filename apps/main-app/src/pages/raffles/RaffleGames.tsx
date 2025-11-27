import { useCallback, useEffect, useState } from "react";
import FilterPill from "../../components/FilterPill";
import RaffleCard from "../../components/RaffleCard";
import { ActionIcon, Select } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import Paginator from "../../components/Paginator";
import type { Raffle } from "../../models/raffles";
import { useGetData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import "@mantine/dates/styles.css";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { IoClose } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { DateRangePicker } from "../../components/DateRangePicker";

export default function RaffleGames() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [startDate, setStartDate] = useState<string | null>("");
  const [search, setSearch] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "live" | "upcoming" | "instant" | "ended"
  >("all");
  const [drawTime, setDrawTime] = useState("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);

  // read & write query params
  const [searchParams, setSearchParams] = useSearchParams();

  // initialize search from query param on mount / when query changes externally
  useEffect(() => {
    const q = searchParams.get("search");
    // normalize null vs empty string
    setSearch(q || "");
    // when search param changes externally, reset to first page
    setFilterPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // stringify to watch the actual param changes

  // build the URL dynamically so the hook receives the latest values
  const encodedSearch = search ? encodeURIComponent(search) : "";
  const url = `guest/games/all-games?paginate=1&type=${statusFilter}&time_preset=${drawTime}&start_date=${startDate}&end_date=${endDate}&page=${filterPage}&limit=${15}&search=${encodedSearch}`;

  const getRafflesMutation = useGetData(url);

  // central fetch routine
  async function getRaffles() {
    try {
      const response = await getRafflesMutation.mutateAsync();
      setRaffles(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
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

  // refetch whenever any of these inputs change
  useEffect(() => {
    // call the fetch when dependencies change
    getRaffles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search, startDate, endDate]);

  function onPageChange(page: number) {
    setFilterPage(page);
    getRaffles();
  }

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  function clearSearch() {
    // remove from URL
    const next = new URLSearchParams(searchParams.toString());
    next.delete("search");
    setSearchParams(next);
    // clear local state and reset to page 1
    setSearch("");
    setFilterPage(1);
    // getRaffles will be triggered by effect
  }

  return (
    <section>
      <div className="px-6 md:px-16 py-10 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              {search ? (
                <>
                  <span>Search: "{search}"</span>
                  <button
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
                    title="Clear search"
                  >
                    <IoClose />
                  </button>
                  <span className="text-primary-red">({total})</span>
                </>
              ) : (
                <>
                  <span>
                    All Raffles/Games{" "}
                    <span className="text-primary-red">({total})</span>
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">
              One ticket. One shot. Your keys could be next.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={drawTime}
              onChange={(value) => setDrawTime(value || "")}
              data={[
                { value: "", label: "Draw Time" },
                { value: "next_24_hours", label: "Next 24 Hours" },
                { value: "next_3_days", label: "Next 3 Days" },
                { value: "next_7_days", label: "Next 7 Days" },
              ]}
              placeholder="Draw Time"
              className="!rounded-xl !shadow-sm"
              classNames={{
                label: "!capitalize ",
                options: "text-primary-text",
              }}
            />

            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              placeholder="Select date range"
            />

            <ActionIcon
              size={44}
              onClick={() => {
                // trigger a fetch from the first page (e.g. when user changes filters)
                onPageChange(1);
              }}
            >
              <IconZoomFilled />
            </ActionIcon>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          <FilterPill
            label="All Games"
            count={total}
            loading={getRafflesMutation.isPending}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <FilterPill
            label="Live Games"
            count={total}
            loading={getRafflesMutation.isPending}
            active={statusFilter === "live"}
            onClick={() => setStatusFilter("live")}
          />
          <FilterPill
            label="Upcoming Games"
            count={total}
            loading={getRafflesMutation.isPending}
            active={statusFilter === "upcoming"}
            onClick={() => setStatusFilter("upcoming")}
          />
          <FilterPill
            label="Instant Games"
            count={total}
            loading={getRafflesMutation.isPending}
            active={statusFilter === "instant"}
            onClick={() => setStatusFilter("instant")}
          />
          <FilterPill
            label="Ended Games"
            count={total}
            loading={getRafflesMutation.isPending}
            active={statusFilter === "ended"}
            onClick={() => setStatusFilter("ended")}
          />
        </div>
      </div>

      {/* Raffles Grid */}
      <div className="px-6 md:px-16 pt-15 pb-15">
        {getRafflesMutation.isPending && (
          <LoadingState description="Fetching games from the system." />
        )}

        {!getRafflesMutation.isPending && (
          <>
            {raffles.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {raffles.map((raffle, idx) => (
                  <RaffleCard key={idx} {...raffle} />
                ))}
              </div>
            ) : (
              <div className="-mt-10">
                <EmptyState
                  description="No raffle games found"
                  title="No Games Found"
                  format="secondary"
                  fullWidth={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination Component */}
      <div className="px-6 md:px-16 pb-10">
        <Paginator
          currentPage={currentPage}
          isLoading={getRafflesMutation.isPending}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
