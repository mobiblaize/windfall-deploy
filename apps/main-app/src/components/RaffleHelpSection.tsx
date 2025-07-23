import { useNavigate } from "react-router-dom";
import HelpSection from "../components/HelpSection";

const RaffleHelpSection = () => {
  const navigate = useNavigate();

  return (
    <HelpSection
      heading={
        <>
          Got Raffle Questions?
          <br />
          We’ve Got Answers
        </>
      }
      description="Whether it’s about tickets, draws, or claiming your prize, our team is here to help you play with confidence."
      buttonText="Let’s Talk"
      onClick={() => navigate("/contact-us")}
    />
  );
};

export default RaffleHelpSection;
