import { useState } from "react";
import { Flex, Text } from "@mantine/core";
import RaffleInfo from "./RaffleInfo";
import CompetitionDetails from "./CompetitionDetails";
// import RafflesFaq from "./RafflesFaq";
import SponsorshipDetails from "./SponsorshipDetails";
import RelatedRaffles from "./RelatedRaffles";

type TabItem = {
  label: string;
  value: string;
};

const menuTabs: TabItem[] = [
  { label: "Competition Details", value: "competition" },
  { label: "Sponsorship Details", value: "sponsorship" },
  // { label: "FAQs", value: "faqs" },
];

export default function RaffleDetails() {
  const [activeTab, setActiveTab] = useState<string>("competition");

  return (
    <section className="px-6 md:px-16 py-10">
      <RaffleInfo />

      <header className="bg-white mt-20 px-10 pt-7 rounded-xl shadow-sm">
        <Flex
          fz="lg"
          className="!flex !flex-wrap !justify-start gap-5"
        >
          {menuTabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <Text
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  !py-2 !px-5                  
                  relative 
                  !capitalize !text-lg
                  cursor-pointer 
                  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                  after:w-full after:h-[2px]
                  after:bg-primary-red
                  after:origin-center after:scale-x-0
                  after:transition-transform after:duration-300 after:ease-in-out
                  hover:after:scale-x-100
                  ${isActive ? "after:scale-x-100 !text-[#2d2d2d] !font-bold" : "!text-gray-400 !font-medium"}
                `}
              >
                {tab.label}
              </Text>
            );
          })}
        </Flex>
      </header>

      <div className="mt-10 mx-5 md:w-[50vw]">
        {activeTab === "competition" && <CompetitionDetails />}
        {activeTab === "sponsorship" && <SponsorshipDetails />}
        {/* {activeTab === "faqs" && <RafflesFaq />} */}
      </div>

          <div className="-mx-5 mt-10">
            
            <RelatedRaffles />
          </div>
    </section>
  );
}
