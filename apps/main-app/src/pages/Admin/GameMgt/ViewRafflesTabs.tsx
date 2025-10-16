import { Tabs } from "@mantine/core";
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
	// const tablinks = [
	// 	"transactional list",
	// 	"customer list",
	// 	"performance monitor",
	// 	"winner",
	// 	"game draw",
	// ];
	return (
		<Tabs
			value={tabs}
			onChange={handleTabChange}
			className="space-y-7 "
			unstyled
		>
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
