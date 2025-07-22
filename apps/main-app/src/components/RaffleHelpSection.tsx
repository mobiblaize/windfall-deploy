import { Button } from "@mantine/core";
// import hero from '../assets/hero-img.jpg';
import talk1 from '../assets/talk-1.png';
import talk2 from '../assets/talk-2.png';
import { useNavigate } from "react-router-dom";

const RaffleHelpSection = () => {
  const navigate = useNavigate();
  return (
      <div className="relative bg-black text-white gap-4 rounded-xl p-6 md:p-10 overflow-hidden flex flex-wrap items-center justify-between">
        {/* Text Content */}
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            Got Raffle Questions?
            <br />
            We’ve Got Answers
          </h2>
          <p className="text-sm md:text-base text-gray-300 text-wrap">
            Whether it’s about tickets, draws, or claiming your prize, our team
            is here to help you play with confidence.
          </p>
        </div>

        {/* CTA Button */}
        <div className=" z-10">
          <Button onClick={() => navigate("/contact-us")} color="var(--primary-red)" radius="md" size="md" className="font-semibold">
            Let’s Talk
          </Button>
        </div>

        {/* Background Decorative Shapes */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-10 z-0">
          <img
            src={talk1}
            alt="Background Shapes"
            className="object-contain w-[10vw] h-auto"
          />
        </div>
        <div className="absolute bottom-0 right-0 opacity-10 z-0">
          <img
            src={talk2}
            alt="Background Shapes"
            className="object-contain w-[10vw] h-auto"
          />
        </div>
      </div>
  );
};

export default RaffleHelpSection;
