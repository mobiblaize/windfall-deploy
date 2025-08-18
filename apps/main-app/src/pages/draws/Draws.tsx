import { ActionIcon, Select, SimpleGrid } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import { IconZoomFilled } from "@tabler/icons-react";
import DrawsItems from "./DrawsItems";
import SectionHeader from "../../components/SectionHeader";
import houseLeft from '../../assets/draws-img-l.png';
import houseRight from '../../assets/draws-img-r.png';
import Paginator from "../../components/Paginator";

export default function Draws() {
	function setCurrentPage() {

	}
	return (
		<div className="mb-10 flex flex-col h-full">
			<SectionHeader heading="Raffle Draw" subHeading="Check your draw results here" imageLeft={houseLeft} imageRight={houseRight}/>
			<main className="flex-grow p-4 mt-5 md:mt-10 mx-3 md:mx-10  text-[#2D2D2D]">
				<header className="flex flex-col md:flex-row items-center justify-between mb-4">
					<div>
						<h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
							all draw result <span className="text-primary-red">(192)</span>
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
				<section className=" md:mx-5 my-14 ">
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
						{[1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 9, 4].map((item, index) => (
							<DrawsItems key={index} item={item} />
						))}
					</SimpleGrid>
				</section>
				<section className="md:mx-2">
					<Paginator currentPage={1} totalPages={2} onPageChange={setCurrentPage} />
				</section>
			</main>
		</div>
	);
}
