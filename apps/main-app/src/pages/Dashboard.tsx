import FeaturedRaffles from "../components/FeaturedRaffles";
import HeroSlider from "../components/HeroSlider";
import SampleRafflesGames from "../components/SampleRafflesGames";
import ParticipationSteps from "../components/ParticipationSteps";
import SampleWinners from "../components/SampleWinners";
// import WinnerStatsBar from "../components/WinnerStatsBar";
// import SponsorBrands from "../components/SponsorBrands";
import RaffleHelpSection from "../components/RaffleHelpSection";
import SEO from "../components/SEO";

export default function Dashboard() {
  return (
    <>
      <SEO 
        title="Home - Win Amazing Prizes"
        description="Browse exciting raffles and participate to win incredible prizes. Join WindFall Raffle and discover your chance to win today!"
        url="https://homewindfall.com/dashboard"
        keywords="raffle games, win prizes, online raffle, instant win, lottery, WindFall"
      />
      <HeroSlider />
      <FeaturedRaffles />
      <SampleRafflesGames />
      <ParticipationSteps />
      <SampleWinners />
      {/* <WinnerStatsBar /> */}
      {/* <SponsorBrands /> */}
      <div className="px-6 md:px-16 pt-10 pb-20 bg-[#f9f9f9]">
        <RaffleHelpSection />
      </div>
    </>
  );
}
