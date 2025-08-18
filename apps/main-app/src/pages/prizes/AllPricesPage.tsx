import { Select, ActionIcon, SimpleGrid, Text } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import { FaAngleDown } from "react-icons/fa";
import PrizesCard from "./PrizesCard";
import SectionHeader from "../../components/SectionHeader";
import houseLeft from '../../assets/prize-img-l.png';
import houseRight from '../../assets/prize-img-r.png';
import Paginator from "../../components/Paginator";

function AllPricesPage() {
	function setCurrentPage() {

	}
	return (
		<div className="mb-5 md:mb-10 flex flex-col h-full">
			
			<SectionHeader heading="Prices" subHeading="A look at all our prizes that we offer" imageLeft={houseLeft} imageRight={houseRight} imageLeftWidth="40%" imageRightWidth="40vw"/>
			
			<main className="flex-grow mt-5 md:mt-10 sm:mx-5 px-6 md:px-16 text-[#2D2D2D]">
				<header className="flex flex-wrap gap-5 items-center justify-between mb-4">
					<div>
						<h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
							All Prizes <span className="text-primary-red">(192)</span>
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
				<section className="md:mx-2 my-14 ">
					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
						{[1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 9, 4].map((item, index) => (
							<PrizesCard key={index} item={item} />
						))}
					</SimpleGrid>
				</section>
				
				<section className="md:mx-2">
					<Paginator currentPage={1} totalPages={1} onPageChange={setCurrentPage} />
				</section>
			</main>
		</div>
	);
}

export default AllPricesPage;
