import { Select, ActionIcon, SimpleGrid } from "@mantine/core"
import  { FaAngleDown } from "react-icons/fa"
import { IconZoomFilled } from "@tabler/icons-react"
import header from "../../assets/livedraw-banner.png"
import LiveDrawCards from "./LiveDrawCards"

function RecentDraws() {
  return (
       <div className="mb-10 flex flex-col h-full">
            <div
                className="relative w-full h-[150px] md:h-[200px] lg:h-[300px] bg-contain bg-no-repeat"
                style={{
                    backgroundImage: ` url(${header})`,
                }}
            />
            <main className="flex-grow p-4 mt-5 md:mt-10 mx-3 md:mx-10  text-[#2D2D2D]">
                <header className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <div>
                        <h1 className="capitalize font-bold text-2xl md:text-3xl text-nowrap">
                            recent draws <span className="text-primary-red">(192)</span>
                        </h1>
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
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" >
                        {[1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 9, 4].map((item, index) => (
                            <LiveDrawCards key={index} item={item} />
                        ))}
                    </SimpleGrid>
                </section>
            </main>
        </div>
  )
}

export default RecentDraws