import {
	Tabs,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TicketDistributionTab from "./TicketDistributionTab";

function Salestabs() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("sales");
	const [tabs, setTabs] = useState(tabFromUrl || "website");
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
		params.set("sales", newTab);
		navigate(`?${params.toString()}`);
	};
	const tablinks = ["website", "mobile app"];
	return (
		<Tabs
			value={tabs}
			onChange={handleTabChange}
			className="space-y-7 "
			unstyled
		>
			<Tabs.List className="mr-5 !tracking-wide overflow-scroll flex flex-nowrap">
				{tablinks.map((item) => (
					<Tabs.Tab
						key={item}
						value={item}
						className="relative 
    
    px-4 py-2 
    font-medium 
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
    data-[active=true]:hover:text-primary-red
  "
					>
						{item}
					</Tabs.Tab>
				))}
			</Tabs.List>

			<Tabs.Panel value="website">
				<TicketDistributionTab/>
			</Tabs.Panel>
			<Tabs.Panel value="mobile app">
				<TicketDistributionTab/>
			</Tabs.Panel>
		</Tabs>
	);
}

export default Salestabs;

