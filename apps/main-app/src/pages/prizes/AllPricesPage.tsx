import { Select, ActionIcon, SimpleGrid, Text } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import { FaAngleDown } from "react-icons/fa";
import CustomPagination from "../../components/CustomPagination";
import header from "../../assets/prizes-banner.png";
import PrizesCard from "./PrizesCard";

function AllPricesPage() {
	return (
		<div className="mb-5 md:mb-10 flex flex-col h-full">
			<div
				className="relative w-full h-[150px] md:h-[200px] lg:h-[300px] bg-contain bg-no-repeat"
				style={{
					backgroundImage: ` url(${header})`,
				}}
			/>
			<main className="flex-grow p-4 mt-5 md:mt-10 mx-10  text-[#2D2D2D]">
				<header className="flex  items-center justify-between mb-4">
					<div>
						<h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
							all prizes <span className="text-primary-red">(192)</span>
						</h1>
						<Text fz="md" className="!text-secondary-text !capitalize">
							live in - rent out - sell up.
						</Text>
					</div>
					<div className="flex items-center gap-x-3">
						<Select
							placeholder="Category"
							classNames={{
								root: "w-[150px]",
							}}
							data={[""]}
							rightSection={<FaAngleDown />}
						/>

						<ActionIcon size={44}>
							<IconZoomFilled />
						</ActionIcon>
					</div>
				</header>
				<section className=" md:mx-5 my-14 ">
					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
						{[1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 9, 4].map((item, index) => (
							<PrizesCard key={index} item={item} />
						))}
					</SimpleGrid>
				</section>
				<CustomPagination />
			</main>
		</div>
	);
}

export default AllPricesPage;
