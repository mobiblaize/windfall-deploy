import { AreaChart } from "@mantine/charts";
import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	SimpleGrid,
	Text,
	TextInput,
	Select,
} from "@mantine/core";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaFileArrowDown } from "react-icons/fa6";
import { PiQuestionThin } from "react-icons/pi";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import { useEffect, useState, useMemo } from "react";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import TablePaginator from "../../../components/TablePaginator";
import TabSwitcher, {
	type TabSwitcherTab,
} from "../../../components/TabSwitcher";
import RenderSkeletonText from "../../../components/RenderSkeletonText";
import type { Customer } from "../CustomerMgt/CustomerDetails";
import GameCustomerTable from "./GameCustomerTable";

interface CustomerListProps {
	raffleId?: string;
	startDate?: string;
	endDate?: string;
}

export interface GameCustomer {
  customer_id: string
  platform: string
  ticket_count: string
  total_amount_spent: string
  games_played_count: number
  customer: Customer
  order_details: string[]
}


interface CustomerStats {
	total_unique_customers: number;
	unique_customers_percentage_change_last_3_days: number;
	total_new_customers: number;
	new_customers_percentage_change_last_3_days: number;
	total_returning_customers: number;
	returning_customers_percentage_change_last_3_days: number;
	ticket_stats_last_7_days_count: number;
	average_tickets_per_customer: number;
	unique_customers_by_channel_percentage: {
		highest_grossing: Array<{
			type: string;
			name: string;
			unique_customers: number;
			percentage_change_last_7_days: number;
			merchant_id: string | null;
		}>;
		platform_breakdown: Array<{
			platform: string;
			unique_customers: number;
			percentage_change_last_7_days: number;
		}>;
	};
}

interface CustomerTrends {
  date: string
  customers: number
  total_tickets: number
}


const platformTabs: TabSwitcherTab[] = [
	{
		label: "Show All",
		value: "",
	},
	{
		label: "Web",
		value: "web",
	},
	{
		label: "Mobile App",
		value: "mobile",
	},
];

function CustomerList({
	raffleId,
	startDate = "",
	endDate = "",
}: CustomerListProps) {
	const [customers, setCustomers] = useState<GameCustomer[]>([]);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState<string | null>("desc");
	const [platform, setPlatform] = useState<string>("");
	const debouncedSearch = useDebounce(search, 500);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [filterPage, setFilterPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(0);

	// Build stats API URL
	const statsUrl = useMemo(() => {
		if (!raffleId) return null;
		const params = new URLSearchParams();
		if (startDate) params.append("start_date", startDate);
		if (endDate) params.append("end_date", endDate);
		return `admin/game-management/game-list/single-game/${raffleId}/customer-overview-stats${params.toString() ? `?${params.toString()}` : ""}`;
	}, [raffleId, startDate, endDate]);

	// Fetch stats
	const {
		data: statsResponse,
		isLoading: isLoadingStats,
		isError: isErrorStats,
		error: statsError,
	} = useFetchData(statsUrl);

	// Build customers API URL
	const customersUrl = useMemo(() => {
		if (!raffleId) return null;
		const params = new URLSearchParams();
		if (debouncedSearch) params.append("search", debouncedSearch);
		params.append("limit", "10");
		if (sortBy) params.append("sort_by", sortBy);
		if (platform) params.append("platform", platform);
		if (startDate) params.append("start_date", startDate);
		if (endDate) params.append("end_date", endDate);
		params.append("paginate", "1");
		params.append("page", filterPage.toString());
		params.append("export", "0");
		return `admin/game-management/game-list/single-game/${raffleId}/unique-customer-list?${params.toString()}`;
	}, [raffleId, debouncedSearch, sortBy, platform, startDate, endDate, filterPage]);

	// Fetch customers
	const {
		data: customersResponse,
		isLoading: isLoadingCustomers,
		isError: isErrorCustomers,
		error: customersError,
	} = useFetchData(customersUrl);	

	// Build trends API URL
	const trendsUrl = useMemo(() => {
		if (!raffleId) return null;
		const params = new URLSearchParams();
		if (startDate) params.append("start_date", startDate);
		if (endDate) params.append("end_date", endDate);
		return `admin/game-management/game-list/single-game/${raffleId}/customer-trend-analysis${params.toString() ? `?${params.toString()}` : ""}`;
	}, [raffleId, startDate, endDate]);

	
	const {
		data: trendsResponse,
		isLoading: isLoadingTrends,
		isError: isErrorTrends,
		error: trendsError,
	} = useFetchData(trendsUrl);	

	// Build export URL
	const exportUrl = useMemo(() => {
		if (!raffleId) return "";
		const params = new URLSearchParams();
		if (debouncedSearch) params.append("search", debouncedSearch);
		params.append("limit", "10");
		if (sortBy) params.append("sort_by", sortBy);
		if (platform) params.append("platform", platform);
		if (startDate) params.append("start_date", startDate);
		if (endDate) params.append("end_date", endDate);
		params.append("paginate", "0");
		params.append("export", "1");
		return `admin/game-management/game-list/single-game/${raffleId}/unique-customer-list?${params.toString()}`;
	}, [raffleId, debouncedSearch, sortBy, platform, startDate, endDate]);

	const exportCustomersMutation = useGetExportData(exportUrl);

	const stats: CustomerStats | undefined = statsResponse?.data;

	const trends: CustomerTrends[] | undefined = trendsResponse?.data;

	// Handle stats error
	useEffect(() => {
		if (isErrorStats) {
			notifications.show({
				title: "Failed to fetch customer statistics",
				message:
					(statsError as { message?: string })?.message || "An error occurred",
				color: "red",
			});
		}
	}, [isErrorStats, statsError]);

	// Handle trends error
	useEffect(() => {
		if (isErrorTrends) {
			notifications.show({
				title: "Failed to fetch customer trends analysis",
				message:
					(trendsError as { message?: string })?.message || "An error occurred",
				color: "red",
			});
		}
	}, [isErrorTrends, trendsError]);

	// Handle customers
	useEffect(() => {
		if (isErrorCustomers) {
			notifications.show({
				title: "Failed to fetch customers",
				message:
					(customersError as { message?: string })?.message ||
					"An error occurred",
				color: "red",
			});
			setCustomers([]);
			setTotal(0);
		}

		if (customersResponse) {
			setCustomers(customersResponse.data?.records?.data || []);
			setCurrentPage(customersResponse.data?.records?.current_page || filterPage || 1);
			setTotal(customersResponse.data?.records?.total || 0);
			setPageSize(customersResponse.data?.records?.per_page || 10);
		}
	}, [isErrorCustomers, customersError, customersResponse, filterPage]);

	const handleExport = () => {
		exportCustomersMutation.mutate(undefined, {
			onSuccess: (data) => {
				const url = window.URL.createObjectURL(new Blob([data]));
				const a = document.createElement("a");
				a.href = url;
				a.download = `raffle_customers_${new Date()
					.toISOString()
					.slice(0, 10)}.xlsx`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				notifications.show({
					title: "Export Successful",
					message: "Your file has been downloaded",
					color: "green",
				});
			},
			onError: (error) => {
				notifications.show({
					title: "Export Failed",
					message: error?.message || "An error occurred",
					color: "var(--color-primary-red)",
				});
			},
		});
	};
	
	// Format trends data for the chart
	const chartData = useMemo(() => {
		if (!trends || trends.length === 0) return [];
		
		return trends.map((item) => ({
			date: new Date(item.date).toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric' 
			}),
			customers: item.customers,
			tickets: item.total_tickets,
		}));
	}, [trends]);

	if (!raffleId) {
		return (
			<Box mt="xl" pb="xl" mx="xl">
				<Card withBorder radius="md" p="xl">
					<Text className="!text-secondary-text" ta="center">
						No raffle selected
					</Text>
				</Card>
			</Box>
		);
	}

	return (
		<Box mt="xl" pb="xl" mx="xl">
			<Card withBorder radius={"md"}>
				<Box>
					<Text tt={"capitalize"} fz={"xl"} fw={"600"}>
						customer overview
					</Text>
					<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
						an insight into the customers for this draw
					</Text>
				</Box>
				<Divider my="md" />
				<Box mb={"lg"}>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total number of customer
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					{isLoadingStats ? (
						<Box className="space-y-2">
							<RenderSkeletonText height={40} width="30%" />
							<RenderSkeletonText height={16} width="50%" />
						</Box>
					) : (
						<>
							<Text className="!text-primary-green " fz={32} fw={700} mb="xs">
								{stats?.total_unique_customers?.toLocaleString() || 0}
							</Text>

							<Text
								tt="capitalize"
								fz="sm"
								className="!text-secondary-text !item-center !flex !gap-2"
								mb={5}
							>
								<AiFillExclamationCircle />
								<span className="!text-primary-green">
									{stats?.unique_customers_percentage_change_last_3_days || 0}%
								</span>{" "}
								increase over the last 3 days
							</Text>
						</>
					)}
				</Box>
				<Divider my="md" />
				<SimpleGrid
					my="lg"
					cols={{ base: 1, xs: 2, sm: 3 }}
					spacing={{ base: 10, sm: "xl" }}
					verticalSpacing={{ base: "lg", sm: "xl" }}
					mt="md"
					className="!text-secondary-text"
				>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							total new customer{" "}
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						{isLoadingStats ? (
							<Box className="space-y-2">
								<RenderSkeletonText height={32} width="60%" />
								<RenderSkeletonText height={14} width="70%" />
							</Box>
						) : (
							<>
								<Text className="!text-primary-text" fw={700} fz={28}>
									{stats?.total_new_customers?.toLocaleString() || 0}
								</Text>
								<Text tt="capitalize" fz="sm">
									<span className="!text-primary-green">
										{stats?.new_customers_percentage_change_last_3_days || 0}%
									</span>{" "}
									new user
								</Text>
							</>
						)}
					</Box>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							total returning buyers
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						{isLoadingStats ? (
							<Box className="space-y-2">
								<RenderSkeletonText height={28} width="60%" />
								<RenderSkeletonText height={14} width="70%" />
							</Box>
						) : (
							<>
								<Text className="!text-primary-text" fw={700} fz={22} tt="capitalize">
									{stats?.total_returning_customers?.toLocaleString() || 0}
								</Text>
								<Text tt="capitalize" fz="sm">
									<span className="text-primary-green">
										+
										{stats?.returning_customers_percentage_change_last_3_days ||
											0}
										%{" "}
									</span>{" "}
									increase in the last 3 days
								</Text>
							</>
						)}
					</Box>
					<Box className="sm:!border-r sm:!border-b-0 !border-b !border-secondary-text/40 py-3 sm:py-0">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className=" !flex !items-center !gap-x-2"
						>
							average ticket unit per customer
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						{isLoadingStats ? (
							<Box className="space-y-2">
								<RenderSkeletonText height={28} width="60%" />
								<RenderSkeletonText height={14} width="70%" />
							</Box>
						) : (
							<>
								<Text className="!text-primary-text" fw={700} fz={22}>
									{stats?.average_tickets_per_customer?.toLocaleString()} ticket units
								</Text>
								<Text tt="capitalize" fz="sm">
									<span className="text-primary-green">
										+
										{stats?.ticket_stats_last_7_days_count ||
											0}{" "}
									</span> in the last 7 days.
								</Text>
							</>
						)}
					</Box>
				</SimpleGrid>
				<Card withBorder radius={"md"} mt="md">
					<Flex justify={"space-between"} align={"start"}>
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							customer trend analysis
							<span>
								<PiQuestionThin />
							</span>
						</Text>

						{/* <Button
							variant="outline"
							className="!border-secondary-text/50 !text-primary-red"
							rightSection={
								<FaCalendarAlt className="text-secondary-text/50" />
							}
						>
							Date: 23/2025
						</Button> */}
					</Flex>
					<Divider my="md" />
					<Box my="lg" className="w-full h-full">
						{isLoadingTrends ? (
							<Box className="space-y-2">
								<RenderSkeletonText height={300} width="100%" />
							</Box>
						) : chartData.length > 0 ? (
							<AreaChart
								h={300}
								data={chartData}
								dataKey="date"
								series={[
									{ name: "customers", color: "var(--primary-red)", label: "Customers" },
									{ name: "tickets", color: "var(--primary-green)", label: "Tickets" }
								]}
								curveType="bump"
								withDots={false}
								withLegend
							/>
						) : (
							<Box className="flex items-center justify-center h-[300px]">
								<Text className="!text-secondary-text" ta="center">
									No trend data available for the selected period
								</Text>
							</Box>
						)}
					</Box>
				</Card>
			</Card>
			<Card
				mt="xl"
				px={0}
				radius={"md"}
				pb={0}
				mb={"lg"}
				withBorder
				className="!w-full"
			>
				<Flex
					direction={{ base: "column", xs: "row" }}
					gap={10}
					justify={"space-between"}
					px="md"
				>
					<Box>
						<Text tt="capitalize" fz={"lg"} fw={600}>
							Customer List
						</Text>
						<Text className="!text-secondary-text !text-xs !capitalize">
							Track and manage game customers across purchase channels
						</Text>
					</Box>

					<Button
						rightSection={<FaFileArrowDown />}
						variant="outline"
						className="!border-secondary-text !text-secondary-text"
						onClick={handleExport}
						loading={exportCustomersMutation?.isPending}
						disabled={exportCustomersMutation?.isPending}
					>
						Export
					</Button>
				</Flex>
				<Divider mt="md" mb="lg" />
				<Flex
					justify="space-between"
					px="md"
					mb="lg"
					wrap="wrap"
					gap={8}
					align="center"
				>
					<Flex justify="space-between" align="center">
						<TabSwitcher
							tabs={platformTabs}
							activeTab={platform}
							onChange={setPlatform}
						/>
					</Flex>
					<TextInput
						leftSection={<HiSearch />}
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.currentTarget.value)}
						className="!w-72 !rounded-xl shadow-md"
					/>
					<Group>
						<Select
							value={sortBy}
							onChange={setSortBy}
							rightSection={<IoFilterOutline />}
							placeholder="Sort by: Show all"
							data={[
								{ value: "asc", label: "Oldest to Newest" },
								{ value: "desc", label: "Newest to Oldest" },
							]}
							className="!shadow-md"
							classNames={{
								label: "!capitalize ",
								options: "text-primary-text",
							}}
						/>
					</Group>
				</Flex>

				<GameCustomerTable isLoading={isLoadingCustomers} customers={customers} />

				<TablePaginator
					currentPage={currentPage}
					isLoading={isLoadingCustomers}
					total={total}
					pageSize={pageSize}
					onPageChange={setFilterPage}
				/>
			</Card>
		</Box>
	);
}

export default CustomerList;