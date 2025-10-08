import { Card, Flex, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const WebMobileTab = () => {
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("status");
	const [activeStatus, setActiveStatus] = useState(tabFromUrl || "show all");
	const statuses = ["show all", "web", "mobile app"];

	// Keep activeStatus in sync with the URL
	useEffect(() => {
		setActiveStatus(tabFromUrl || "show all");
	}, [tabFromUrl]);

	const handleStatusFilter = (val: string) => {
		setActiveStatus(val);
	};
	return (
		<Card p={0} withBorder className="capitalize text-sm w-full sm:w-fit">
			<Flex justify={{ base: "space-evenly",xs:"start" }}>
				{statuses.map((status) => {
					const isActive = activeStatus === status;
					const bgClass =
						isActive ?
							` bg-[#FFD5D6] text-primary-red`
						:	"hover:bg-secondary-red";

					return (
						<Text key={status} fz="sm">
							<button
								onClick={() => handleStatusFilter(status)}
								className={`px-3 py-1 rounded w-full  text-xs md:text-sm transition-colors duration-200 !capitalize text-nowrap ${bgClass}`}
							>
								{status}
							</button>
						</Text>
					);
				})}
			</Flex>
			{/* <ul className="flex items-center border divide-y sm:divide-y-0 divide-secondary-text md:divide-x border-secondary-text  rounded-md text-nowrap">
				{statuses.map((status) => {
					const isActive = activeStatus === status;
					const bgClass =
						isActive ?
							` bg-[#FFD5D6] text-primary-red`
						:	"hover:bg-secondary-red";

					return (
						<li key={status}>
							<button
								onClick={() => handleStatusFilter(status)}
								className={`px-3 py-1 rounded w-full  text-xs md:text-sm transition-colors duration-200 !capitalize ${bgClass}`}
							>
								{status}
							</button>
						</li>
					);
				})}
			</ul> */}
		</Card>
	);
};

export default WebMobileTab;
