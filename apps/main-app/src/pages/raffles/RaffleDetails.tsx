import { useState } from "react";
import { Flex, Text } from "@mantine/core";
import RaffleInfo from "./RaffleInfo";
import CompetitionDetails from "./CompetitionDetails";
// import RafflesFaq from "./RafflesFaq";
import SponsorshipDetails from "./SponsorshipDetails";
import RelatedRaffles from "./RelatedRaffles";
import type { Raffle } from "../../models/raffles";
import raffleImg from "../../assets/default-raffle.png";
import InstantPrizes from "./InstantPrizes";

type TabItem = {
  label: string;
  value: string;
};

const raffle: Raffle = {
  title: "Win One Bed Room Flat in Akoka-Yaba, Lagos State, Nigeria",
  description: "Play for a chance to own the latest iPhone.",
  fee: "₦2K",
  image: raffleImg,
  sold: 70,
  date: "June 2, 2025 | 10:00am",
  status: "active",
  category: "apartment",
  prizeType: "iPhone",
  ticketType: "MacBook",
  drawTime: "8am",
  gameType: "instant",
};

const baseTabs: TabItem[] = [
  { label: "Competition Details", value: "competition" },
  { label: "Sponsorship Details", value: "sponsorship" },
  // { label: "FAQs", value: "faqs" },
];

export default function RaffleDetails() {
  const [activeTab, setActiveTab] = useState<string>("competition");

  const isInstant = raffle?.gameType === "instant";

  const menuTabs: TabItem[] = isInstant
    ? [...baseTabs, { label: "Instant Prizes to be Won", value: "prizes" }]
    : baseTabs;

  return (
    <section className="px-6 md:px-16 py-10">
      <RaffleInfo raffle={raffle} />

      <header className="bg-white mt-20 px-10 pt-7 rounded-xl shadow-sm">
        <Flex fz="lg" className="!flex !flex-wrap !justify-start gap-5">
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

      <div
        className={`mt-10 mx-5${activeTab !== "prizes" ? " md:w-[50vw]" : ""}`}
      >
        {activeTab === "competition" && <CompetitionDetails />}
        {activeTab === "sponsorship" && <SponsorshipDetails />}
        {activeTab === "prizes" && <InstantPrizes />}
        {/* {activeTab === "faqs" && <RafflesFaq />} */}
      </div>

      <div className="-mx-5 mt-10">
        <RelatedRaffles />
      </div>
    </section>
  );
}
