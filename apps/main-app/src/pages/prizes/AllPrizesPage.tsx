import { ActionIcon, SimpleGrid, Text, TextInput } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import PrizesCard from "./PrizesCard";
import SectionHeader from "../../components/SectionHeader";
import houseLeft from "../../assets/prize-img-l.png";
import houseRight from "../../assets/prize-img-r.png";
import Paginator from "../../components/Paginator";
import { useFetchData } from "../../utils/hooks/useApis";
import { useEffect, useState } from "react";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { notifications } from "@mantine/notifications";
import type { Prize } from "../Admin/PrizeManagement/PrizeManagement";
import { HiSearch } from "react-icons/hi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

function AllPrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const {
    data: prizesResponse,
    isLoading: isLoadingPrizes,
    isError: isErrorPrizes,
    error: prizesError,
    refetch: refetchPrizes,
  } = useFetchData(
    `guest/all-prizes?paginate=1&search=${debouncedSearch}&page=${filterPage}&limit=${15}`
  );

  useEffect(() => {
    if (isErrorPrizes) {
      notifications.show({
        title: "Failed to fetch prizes",
        message:
          (prizesError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }

    if (prizesResponse) {
      setPrizes(prizesResponse?.data?.data);
      setCurrentPage(prizesResponse?.data?.current_page || 1);
      setTotal(prizesResponse?.data?.total || 0);
      setPageSize(prizesResponse?.data?.per_page || 10);
    }
  }, [prizesError, isErrorPrizes, prizesResponse]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  return (
    <div className="mb-5 md:mb-10 flex flex-col h-full">
      <SectionHeader
        heading="Prizes"
        subHeading="A look at prizes that we offer"
        imageLeft={houseLeft}
        imageRight={houseRight}
        imageLeftWidth="40%"
        imageRightWidth="40vw"
      />

      <main className="flex-grow mt-5 md:mt-10 sm:mx-5 px-6 md:px-16 text-[#2D2D2D]">
        <header className="flex flex-wrap gap-5 items-center justify-between mb-4">
          <div>
            <h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
              All Prizes <span className="text-primary-red">({total})</span>
            </h1>
            <Text fz="md" className="!text-secondary-text !capitalize">
              live in - rent out - sell up.
            </Text>
          </div>
          <div className="flex items-center gap-x-3">
            <TextInput
              leftSection={<HiSearch />}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="!w-72 !rounded-xl"
            />

            <ActionIcon
              size={44}
              onClick={() => {
                setFilterPage(1);
                refetchPrizes();
              }}
            >
              <IconZoomFilled />
            </ActionIcon>
          </div>
        </header>
        <section className="md:mx-2 my-14 ">
          {isLoadingPrizes && (
            <LoadingState description="Fetching prizes from the system." />
          )}

          {!isLoadingPrizes && (
            <>
              {prizes.length ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                  {prizes.map((item) => (
                    <PrizesCard key={item.uuid} item={item} />
                  ))}
                </SimpleGrid>
              ) : (
                <div className="mt-10">
                  <EmptyState
                    description="No prizes found"
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
            isLoading={isLoadingPrizes}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </section>
      </main>
    </div>
  );
}

export default AllPrizesPage;
