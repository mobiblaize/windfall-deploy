import { ActionIcon, SimpleGrid, TextInput } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import Paginator from "../../components/Paginator";
import { useEffect, useState } from "react";
import SectionHeader from "../../components/SectionHeader";
import winnersLeft from "../../assets/winners-img-l.png";
import winnersRight from "../../assets/winners-img-r.png";
import { notifications } from "@mantine/notifications";
import { useGetData } from "../../utils/hooks/useApis";
import { DatePickerInput } from "@mantine/dates";
import { HiSearch } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import WinnerCard from "./WinnerCard";

export interface Winner {
  uuid: string;
  game_name: string;
  card_image?: string;
  gallery_images?: string;
  short_description: string;
  testimonial_short_description: string;
  media: string[];
  testimonial: string;
  game_category: string;
  prize_won: string;
  prize_cost: string;
  ticket_price: string;
  draw_index: string;
  announce_status: string;
  status: string;
  won_at?: string;
  video_url?: string;
  customer: Customer;
}

interface Customer {
  firstname: string;
  lastname: string;
}

function AllWinnersPage() {
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);

  const url = `guest/all-winners?paginate=1&start_date=${dateRange[0] ?? ""}&end_date=${dateRange[1] ?? ""}&page=${filterPage}&limit=${15}`;

  const getWinnersMutation = useGetData(url);

  async function getWinners(page = 1) {
    setFilterPage(page);
    try {
      const response = await getWinnersMutation.mutateAsync();
      setWinners(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    } catch (error) {
      setWinners([]);
      setTotal(0);
      notifications.show({
        title: "Failed to fetch raffle games",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  useEffect(() => {
    getWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-10 flex flex-col h-full">
      <SectionHeader
        heading="Winners"
        subHeading="A look at our winners since day one (1)"
        imageLeft={winnersLeft}
        imageRight={winnersRight}
        alignImageRightTop={true}
      />
      <main className="flex-grow sm:p-4 mt-10 mx-6 md:mx-10  text-[#2D2D2D]">
        <header className="flex gap-5 flex-col md:flex-row items-center justify-between mb-4">
          <div>
            <h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
              All Raffle Winners <span className="text-primary-red">({total})</span>
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
            <ActionIcon size={44} onClick={() => getWinners()}>
              <IconZoomFilled />
            </ActionIcon>
          </div>
        </header>
        <section className=" md:mx-2 my-14 ">
          {getWinnersMutation.isPending && (
            <LoadingState description="Fetching winners from the system." />
          )}

          {!getWinnersMutation.isPending && (
            <>
              {winners.length ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                  {winners.map((winner) => (
                    <WinnerCard key={winner.uuid} winner={winner} />
                  ))}
                </SimpleGrid>
              ) : (
                <div className="mt-10">
                  <EmptyState
                    description="No winners stories found"
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
            isLoading={getWinnersMutation.isPending}
            total={total}
            pageSize={pageSize}
            onPageChange={getWinners}
          />
        </section>
      </main>
    </div>
  );
}

export default AllWinnersPage;
