import { Text, Flex, Avatar } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
const tabs = [
	{ label: "My games", value: "all-games" },
	{ label: "result", value: "result" },
	{ label: "reward", value: "reward" },
	{ label: "transaction", value: "transaction" },
	{ label: "notifications", value: "notifications" },
	{ label: "settings", value: "settings" },
];
function ProfileHeader() {
	const location = useLocation();

	return (
		<header className=" bg-white px-10 pb-0 pt-6">
			<Flex className="flex flex-col md:flex-row gap-3 justify-between !mb-8">
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
			<Flex
				fz="lg"
				className="!flex !flex-nowrap !justify-around overflow-x-scroll md:overflow-x-hidden"
			>
				{tabs.map(({ label, value }) => {
					const isActive = location.pathname.includes(`/profile/${value}`);
					return (
						<Link key={value} to={`/profile/${value}`}>
							<Text
								className={`
                                    !py-2 !px-5
                              relative 
							  !text-nowrap
                              !capitalize !text-lg
                              cursor-pointer 
                              after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                              after:w-full after:h-[1px]
                              after:bg-primary-red
                              after:origin-center after:scale-x-0
                              after:transition-transform after:duration-300 after:ease-in-out
                              hover:after:scale-x-100
                              ${isActive ? "after:scale-x-100 !text-primary-red" : "!text-[#ABABAB]"}
                            `}
							>
								{label}
							</Text>
						</Link>
					);
				})}
			</Flex>
		</header>
	);
}

export default ProfileHeader;
