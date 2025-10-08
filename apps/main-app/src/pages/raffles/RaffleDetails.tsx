import { useEffect, useState } from "react";
import { Flex, Text } from "@mantine/core";
import RaffleInfo from "./RaffleInfo";
import CompetitionDetails from "./CompetitionDetails";
// import RafflesFaq from "./RafflesFaq";
import SponsorshipDetails from "./SponsorshipDetails";
import RelatedRaffles from "./RelatedRaffles";
import type { Raffle } from "../../models/raffles";
import InstantPrizes from "./InstantPrizes";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";

type TabItem = {
  label: string;
  value: string;
};

const baseTabs: TabItem[] = [
  { label: "Competition Details", value: "competition" },
  { label: "Sponsorship Details", value: "sponsorship" },
  // { label: "FAQs", value: "faqs" },
];

export default function RaffleDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>("competition");
  const [raffle, setRaffle] = useState<Raffle>();
  const isInstant =
    raffle?.main_active_status === "instant" || raffle?.instant_game === "true";
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`guest/games/${id}`);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Game",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setRaffle(response.data);
      setActiveTab("competition");
    }
  }, [error, isError, response]);

  const menuTabs: TabItem[] = isInstant
    ? [...baseTabs, { label: "Instant Prizes to be Won", value: "prizes" }]
    : baseTabs;

  return (
    <section className="px-6 md:px-16 py-10">
      {isLoading && <LoadingState description="Getting your game details" />}
      {!isLoading && (
        <>
          {!raffle && (
            <EmptyState
              description="Game not Found"
              title="Game not found"
              btnText="Explore Games"
              redirectLink="/raffles"
            />
          )}
          {raffle && (
            <>
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
                {activeTab === "competition" && (
                  <CompetitionDetails details={raffle.sponsorship_details} />
                )}
                {activeTab === "sponsorship" && (
                  <SponsorshipDetails details={raffle.sponsorship_details} />
                )}
                {activeTab === "prizes" && <InstantPrizes raffle={raffle} />}
                {/* {activeTab === "faqs" && <RafflesFaq />} */}
              </div>

              <div className="-mx-5 mt-10">
                <RelatedRaffles id={id} />
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
