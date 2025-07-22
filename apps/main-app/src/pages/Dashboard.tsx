import FeaturedRaffles from "../components/FeaturedRaffles";
import HeroSlider from "../components/HeroSlider";
import SampleRafflesGames from "../components/SampleRafflesGames";
import ParticipationSteps from "../components/ParticipationSteps";
import SampleWinners from "../components/SampleWinners";
import WinnerStatsBar from "../components/WinnerStatsBar";
import SponsorBrands from "../components/SponsorBrands";
import RaffleHelpSection from "../components/RaffleHelpSection";

export default function Dashboard() {
  return (
    <>
      <HeroSlider />
      <FeaturedRaffles />
      <SampleRafflesGames />
      <ParticipationSteps />
      <SampleWinners />
      <WinnerStatsBar />
      <SponsorBrands />
      <div className="px-6 md:px-16 py-20 bg-[#f9f9f9]">
        <RaffleHelpSection />
      </div>
    </>
  );
}
