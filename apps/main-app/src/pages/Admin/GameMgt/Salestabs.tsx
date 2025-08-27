import { Box, Card, Divider, Flex, SimpleGrid, Stack, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { PiQuestionThin } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatCurrency } from "../../../utils/helper";
import { BarChart } from "@mantine/charts";

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

			<Tabs.Panel value="website">website</Tabs.Panel>
			<Tabs.Panel value="mobile app">
				<Box>
					<Text
						tt={"capitalize"}
						fz={"sm"}
						className="!text-secondary-text !flex !items-center !gap-x-2"
					>
						total revenue generated
						<span>
							<PiQuestionThin />
						</span>
					</Text>
					<Text fw={500} fz={28} className="!text-primary-green">
						{formatCurrency(1230004)}
					</Text>
				</Box>
				<SimpleGrid cols={3} spacing="xl" mt="md">
					<Stack gap={"xs"} className="border-r border-secondary-text/30">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							total revenue generated
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text>{formatCurrency(1598000)}</Text>
						<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
							15 tickets sold in the last 6 hours
						</Text>
					</Stack>
					<Stack gap={"xs"} className="border-r border-secondary-text/30">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							total revenue generated
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text>{formatCurrency(1598000)}</Text>
						<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
							15 tickets sold in the last 6 hours
						</Text>
					</Stack>
					<Stack gap={"xs"} className="">
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							total revenue generated
							<span>
								<PiQuestionThin />
							</span>
						</Text>
						<Text>{formatCurrency(1598000)}</Text>
						<Text tt={"capitalize"} fz={"xs"} className="!text-secondary-text">
							15 tickets sold in the last 6 hours
						</Text>
					</Stack>
				</SimpleGrid>
				<Card withBorder my={"lg"}>
					<Flex justify={"space-between"}>
						<Text
							tt={"capitalize"}
							fz={"sm"}
							className="!text-secondary-text !flex !items-center !gap-x-2"
						>
							sales trend analysis
							<span>
								<PiQuestionThin />
							</span>
						</Text>
					</Flex>
					<Divider my="md" />
					<BarChart
						h={300}
						data={data}
						withTooltip={false}
						dataKey="month"
						series={[{ name: "Smartphones", color: "blue" }]}
					/>
				</Card>
			</Tabs.Panel>
		</Tabs>
	);
}

export default Salestabs;

const data = [
	{ month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
	{ month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
	{ month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
	{ month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
	{ month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
	{ month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
];