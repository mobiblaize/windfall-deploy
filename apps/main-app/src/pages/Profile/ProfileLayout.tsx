import { Container, Flex, Text, Avatar } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GamesTab from "./GamesTab";
const tabs = [
	{ label: "My games", value: "games" },
	{ label: "result", value: "result" },
	{ label: "reward", value: "reward" },
	{ label: "transaction", value: "transaction" },
	{ label: "notification", value: "notification" },
	{ label: "settings", value: "settings" },
];
function ProfileLayout() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("activeTab");
	const [activeTab, setActiveTab] = useState<string>(tabFromUrl || "games");

	useEffect(() => {
		if (tabFromUrl && tabFromUrl !== activeTab) {
			setActiveTab(tabFromUrl);
		}
	}, [tabFromUrl, activeTab]);

	console.log(activeTab);
	const handleTabChange = (value: string | null) => {
		const newTab = value ?? "pharmacy";
		setActiveTab(newTab);
		const params = new URLSearchParams(window.location.search);
		params.set("tab", newTab);
		navigate(`?${params.toString()}`);
	};
	return (
		<div className="text-primary-text mb-32">
			<Tabs
				value={activeTab}
				onChange={handleTabChange}
				variant="none"
				classNames={{ list: " !capitalize" }}
			>
				<header className=" bg-white px-10 pb-5 pt-5">
					<Flex className="flex flex-col md:flex-row gap-3 justify-between !mb-5">
						<div>
							<Text className="!text-3xl !font-semibold">My Profile</Text>
							<Text className="!text-secondary-text">
								Manage your profile, games all in one place
							</Text>
						</div>
						<Flex align="center" gap={10}>
							<Avatar size="lg" />
							<div className="capitalize text-secondary-text ">
								<Text>adekunle ibrahim</Text>
								<Text className="!text-primary-red">ID:1234151</Text>
							</div>
						</Flex>
					</Flex>
					<Tabs.List
						className="!flex !flex-nowrap !justify-around overflow-x-scroll md:overflow-x-hidden"
						fz="lg"
					>
						{tabs.map(({ label, value }) => (
							<Tabs.Tab
								key={value}
								value={value}
								className={`
							  relative 
							  !capitalize !text-base
							  cursor-pointer 
							  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
							  after:w-full after:h-[2px]
							  after:bg-primary-red
							  after:origin-center after:scale-x-0
							  after:transition-transform after:duration-300 after:ease-in-out
							  hover:after:scale-x-100
							  ${activeTab === value ? "after:scale-x-100 !text-primary-red" : ""}
							`}
							>
								{label}
							</Tabs.Tab>
						))}
					</Tabs.List>
				</header>

				<Tabs.Panel value="games">
					<GamesTab />
				</Tabs.Panel>
				<Tabs.Panel value="result">result</Tabs.Panel>
				<Tabs.Panel value="reward">reward</Tabs.Panel>
				<Tabs.Panel value="transaction">transaction</Tabs.Panel>
				<Tabs.Panel value="notification">notification</Tabs.Panel>
				<Tabs.Panel value="settings">settings</Tabs.Panel>
				<Container size="xl" className="!mx-3 sm:!mx-auto"></Container>
			</Tabs>
		</div>
	);
}

export default ProfileLayout;
