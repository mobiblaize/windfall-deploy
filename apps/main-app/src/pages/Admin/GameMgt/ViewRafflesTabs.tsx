import { Divider, Tabs } from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RaffleTransactionalList from "./RaffleTransactionalList";
import CustomerList from "./CustomerList";
import PerformanceMonitor from "./PerformanceMonitor";
import WinnerTab from "./WinnerTab";
import GamedrawTab from "./GamedrawTab";

function ViewRafflesTabs() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("view");
	const [tabs, setTabs] = useState(tabFromUrl || "transactional list");
	useEffect(() => {
		if (tabFromUrl && tabFromUrl !== tabs) {
			setTabs(tabFromUrl);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabFromUrl]);

	const handleTabChange = (value: string | null) => {
		const newTab = value ?? "website";
		setTabs(newTab);
		const params = new URLSearchParams(window.location.search);
		params.set("view", newTab);
		navigate(`?${params.toString()}`);
	};
	const tablinks = [
		"transactional list",
		"customer list",
		"performance monitor",
		"winner",
		"game draw",
	];
	return (
		<Tabs
			value={tabs}
			onChange={handleTabChange}
			className="space-y-7 "
			unstyled
		>
			<Tabs.List className="mr-5 !tracking-wide overflow-scroll flex flex-nowrap ">
				{tablinks.map((item) => (
					<Tabs.Tab
						key={item}
						value={item}
						className="relative 
        
        px-4 py-2 
        !font-xs sm:!font-medium 
        !capitalize 
        cursor-pointer 
        rounded-t-md 
        text-secondary-text
        hover:text-primary-red
        data-[active=true]:z-[1] 
        data-[active=true]:text-[var(--color-primary-red)] 
        data-[active=true]:border-b-[3px] 
        data-[active=true]:border-b-solid 
        data-[active=true]:border-b-2[var(--color-primary-red)]
        data-[active=true]:hover:text-primary-red text-nowrap"
					>
						{item}
					</Tabs.Tab>
				))}
			</Tabs.List>
			<Divider />
			<Tabs.Panel value="transactional list">
				<RaffleTransactionalList />
			</Tabs.Panel>
			<Tabs.Panel value="customer list">
				<CustomerList />
			</Tabs.Panel>
			<Tabs.Panel value="performance monitor">
				<PerformanceMonitor />
			</Tabs.Panel>
			<Tabs.Panel value="winner">
				<WinnerTab />
			</Tabs.Panel>
			<Tabs.Panel value="game draw">
				<GamedrawTab/>
			</Tabs.Panel>
		</Tabs>
	);
}

export default ViewRafflesTabs;
