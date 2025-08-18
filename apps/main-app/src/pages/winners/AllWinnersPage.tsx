import { Select, ActionIcon, SimpleGrid } from "@mantine/core";
import { IconZoomFilled } from "@tabler/icons-react";
import { FaAngleDown } from "react-icons/fa";
import WinnersCard from "./WinnersCard";
import Paginator from "../../components/Paginator";
import { useState } from "react";
import SectionHeader from "../../components/SectionHeader";
import winnersLeft from '../../assets/winners-img-l.png';
import winnersRight from '../../assets/winners-img-r.png';

function AllWinnersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage);
  
	return (
		<div className="mb-10 flex flex-col h-full">
			
			<SectionHeader heading="Winners" subHeading="A look at our winners since day one (1)" imageLeft={winnersLeft} imageRight={winnersRight} alignImageRightTop={true}/>
			<main className="flex-grow sm:p-4 mt-10 mx-6 md:mx-10  text-[#2D2D2D]">
				<header className="flex gap-5 flex-col md:flex-row items-center justify-between mb-4">
					<div>
						<h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
							All Raffle Winners <span className="text-primary-red">(192)</span>
						</h1>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Select
							placeholder="Category"
							classNames={{
								root: "w-[150px]",
							}}
							data={[""]}
							rightSection={<FaAngleDown />}
						/>
						<Select
							placeholder="Draw date"
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
				<section className=" md:mx-2 my-14 ">
					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
						{[1, 2, 3, 4].map((item, index) => (
							<WinnersCard key={index} item={item} />
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

export default AllWinnersPage;
