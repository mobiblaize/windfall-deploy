import { Button } from "@mantine/core";
import talk1 from "../assets/talk-1.png";
import talk2 from "../assets/talk-2.png";
import type { ReactNode } from "react";

interface HelpSectionProps {
  heading: ReactNode;
  description: ReactNode;
  buttonText: string;
  onClick: () => void;
}

const HelpSection = ({
  heading,
  description,
  buttonText,
  onClick,
}: HelpSectionProps) => {
  return (
    <div className="relative bg-black text-white gap-4 rounded-xl p-6 md:p-10 overflow-hidden flex flex-wrap items-center justify-between">
      {/* Text Content */}
      <div className="max-w-xl space-y-4">
        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
          {heading}
        </h2>
        <p className="text-sm md:text-base text-gray-300 text-wrap">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="z-10">
        <Button
          onClick={onClick}
          color="var(--primary-red)"
          radius="md"
          size="md"
          className="font-semibold"
        >
          {buttonText}
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

export default HelpSection;
