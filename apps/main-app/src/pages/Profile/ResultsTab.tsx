import {
  Card,
  Container,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { FaAngleDown, FaClock, FaReceipt } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import EmptyDraw from "./EmptyDraw";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/Buttons/CustomButton";
import { useEffect, useState } from "react";
import { useFetchData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import type { Raffle } from "../../models/raffles";
import LoadingState from "../../components/LoadingState";
import Paginator from "../../components/Paginator";
import { formatLocalDate } from "../../utils/helper/formatLocalDate";

export interface GameResults {
  uuid: string;
  game_id: string;
  order_id: string;
  quantity: number;
  unit_amount: string;
  total_amount: string;
  paid_amount: string;
  discount_amount: string;
  created_at: string;
  updated_at: string;
  game: Raffle;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

function ResultsTab() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<
    "" | "live" | "upcoming" | "instant" | "ended" | "inactive"
  >("");
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterPage, setFilterPage] = useState<number>(1);
  const [results, setResults] = useState<GameResults[]>([]);
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(
    `customer/games/order-games?paginate=1&filter_by=${statusFilter}&page=${filterPage}&limit=${12}`
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Games",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });

      setResults([]);
      setTotal(0);
    }
    if (response) {
      setResults(response.data?.data || []);
      setCurrentPage(response.data?.current_page || 1);
      setTotal(response.data?.total || 0);
      setPageSize(response.data?.per_page || 10);
    }
  }, [error, isError, response]);

  function onPageChange(page: number) {
    setFilterPage(page);
  }

  return (
    <div>
      <MyGameHeader
        count={total}
        title="game result"
        description="A list of result pertaining to your games"
      >
        <Select
          data={[
            { value: "", label: "Show All" },
            { value: "live", label: "Live" },
            { value: "upcoming", label: "Upcoming" },
            { value: "instant", label: "Instant" },
            { value: "ended", label: "Ended" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value as typeof statusFilter);
            setFilterPage(1);
          }}
          placeholder="My Games: Show All"
          rightSection={<FaAngleDown />}
          className="w-[180px]"
          classNames={{
            label: "!capitalize ",
            options: "text-primary-text",
          }}
          clearable
        />
      </MyGameHeader>

      <Divider />
      <Container size="xl" fluid className="!px-6 md:!px-16">
        {isLoading && (
          <LoadingState description="Fetching your game results from the system." />
        )}
        {!isLoading && (
          <>
            {results?.length > 0 ? (
              <SimpleGrid
                my={54}
                py="lg"
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: 10, sm: "md" }}
                verticalSpacing={{ base: "md", sm: "xl" }}
              >
                {results?.map((result) => (
                  <Card
                    key={result.uuid}
                    withBorder
                    className="!p-5 !rounded-xl !space-y-5"
                  >
                    <div>
                      <Text className="!text-xl !font-bold">
                        {result.game?.name}
                      </Text>
                      <Text className="!text-secondary-text !text-sm !mt-3 !mb-2">
                        {result.game?.description}
                      </Text>
                    </div>
                    <div className="!text-secondary-text">
                      <Flex justify="space-between">
                        <span className="inline-flex items-center gap-1 !text-sm">
                          <FaClock className="text-base" />
                          <Text className="!text-sm leading-none">
                            Draw Date:{" "}
                            {formatLocalDate(
                              (result.game.end_date),
                              "MMMM d, yyyy"
                            )}
                          </Text>
                        </span>
                        <span className="inline-flex items-center gap-1 !text-sm">
                          <FaReceipt className="text-base" />
                          <Text className="!text-sm leading-none">
                            Number of Tickets: {result.quantity}
                          </Text>
                        </span>
                      </Flex>
                    </div>
                    <CustomButton
                      onClick={() => navigate(`${result.uuid}`)}
                      className="!h-12 !text-lg !rounded-xl !border-2 !border-dashed !border-secondary-red"
                    >
                      View Result
                    </CustomButton>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <EmptyDraw />
            )}
          </>
        )}
        <div className="mt-10">
          <Paginator
            currentPage={currentPage}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      </Container>
    </div>
  );
}

export default ResultsTab;
