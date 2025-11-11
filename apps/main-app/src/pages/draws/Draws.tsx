import { ActionIcon, SimpleGrid, TextInput } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import SectionHeader from "../../components/SectionHeader";
import houseLeft from "../../assets/draws-img-l.png";
import houseRight from "../../assets/draws-img-r.png";
import Paginator from "../../components/Paginator";
import { useEffect, useState } from "react";
import { useGetData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../components/EmptyState";
import DrawCard from "./DrawCard";
import { HiSearch } from "react-icons/hi";
import { DatePickerInput } from "@mantine/dates";
import { CiCalendar } from "react-icons/ci";
import LoadingState from "../../components/LoadingState";
export interface LiveDraw {
  uuid: string;
  status: string;
  draw_at?: string;
  game: Game;
  prize_name?: string;
  card_image?: string;
  customer?: Customer;
  metrics: Metrics;
}

export interface Game {
  name: string;
  short_description: string;
  total_tickets: number;
  start_date: string;
  end_date: string;
}

export interface Customer {
  firstname: string;
  lastname: string;
}

export interface Metrics {
  tickets_left: number;
  unique_players: number;
  potential_draw: number;
}

export default function Draws() {
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [draws, setDraws] = useState<LiveDraw[]>([]);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);

  const url = `guest/all-draw-lines?paginate=1&start_date=${dateRange[0] ?? ""}&end_date=${dateRange[1] ?? ""}&page=${filterPage}&limit=${15}`;

  const getDrawsMutation = useGetData(url);

  async function getDraws(page = 1) {
    setFilterPage(page);
    try {
      const response = await getDrawsMutation.mutateAsync();
      setDraws(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    } catch (error) {
      setDraws([]);
      setTotal(0);
      notifications.show({
        title: "Failed to fetch raffle games",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  useEffect(() => {
    getDraws();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-10 flex flex-col h-full">
      <SectionHeader
        heading="Raffle Draw"
        subHeading="Catch the draw live or watch previous draws"
        imageLeft={houseLeft}
        imageRight={houseRight}
      />
      <main className="flex-grow p-4 mt-5 md:mt-10 mx-3 md:mx-10  text-[#2D2D2D]">
        <header className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div>
            <h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
              all draw result <span className="text-primary-red">(192)</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <TextInput
              leftSection={<HiSearch />}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="!w-72 !rounded-xl"
            />
            <DatePickerInput
              type="range"
              value={dateRange}
              onChange={setDateRange}
              valueFormat="YYYY-MM-DD"
              placeholder="Select date range"
              clearable
              rightSection={
                !dateRange[0] && !dateRange[1] ? <CiCalendar /> : undefined
              }
              classNames={{
                label: "!capitalize",
              }}
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
            />
            <ActionIcon size={44} onClick={() => getDraws()}>
              <IconZoomFilled />
            </ActionIcon>
          </div>
        </header>
        <section className=" md:mx-2 my-14 ">
          {getDrawsMutation.isPending && (
            <LoadingState description="Fetching draws from the system." />
          )}

          {!getDrawsMutation.isPending && (
            <>
              {draws.length ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                  {draws.map((draw) => (
                    <DrawCard key={draw.uuid} draw={draw} />
                  ))}
                </SimpleGrid>
              ) : (
                <div className="mt-10">
                  <EmptyState
                    description="No draws stories found"
                    title="No Records Found"
                    format="secondary"
                    fullWidth={true}
                  />
                </div>
              )}
            </>
          )}
        </section>

        <section className="md:mx-2">
          <Paginator
            currentPage={currentPage}
            isLoading={getDrawsMutation.isPending}
            total={total}
            pageSize={pageSize}
            onPageChange={getDraws}
          />
        </section>
      </main>
    </div>
  );
}
