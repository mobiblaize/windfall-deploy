import { useState } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { Image } from "@mantine/core";
import SectionHeader from "../components/SectionHeader";
import faql from "../assets/faq-l.png";
import faqr from "../assets/faq-r.png";
import faqImage from "../assets/faq-img.png"; // Replace with the image from your design
import HelpSection from "../components/HelpSection";

const faqData = [
  "How do I enter the Raffle?",
  "What is my draw number?",
  "How is the winner chosen?",
  "How will I know if I have won?",
  "How long is the competition open for?",
  "Can anyone enter the competition?",
  "What if a competition does not sell out?",
  "What are the prizes?",
  "Is Windfall Raffle a scam?",
  "How do you use my personal data?",
  "Can I try again?",
  "What are my chances of winning?",
  "Can I get a refund of my entry fee?",
  "How do the instant win competitions work?",
].map((question) => ({
  question,
  answer:
    "Yes, you can try us for 30 days. If you want, we’ll provide you with a free personalized 30-minute onboarding call to get you up and running as soon as possible.",
}));

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mb-5 md:mb-10 flex flex-col h-full">
      <SectionHeader
        heading={
          <>
            Frequently Asked Questions <br /> and Answers
          </>
        }
        subHeading="Got a question? We have the answers below."
        imageLeft={faql}
        imageRight={faqr}
        imageLeftWidth="23vw"
        imageRightWidth="28vw"
      />

      <main className="px-6 md:px-16 my-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-15 lg:px-20 mb-8">
          {/* Image Column */}
          <div className="w-full md:w-7/12">
            <Image
              src={faqImage}
              alt="FAQ support agent"
              radius="md"
              className="!rounded-2xl"
            />
          </div>

          {/* Accordion Column */}
          <div className="w-full md:w-5/12">
            <div className="w-full pt-10">
              {faqData.map((item, idx) => {
                const isOpen = idx === openIndex;
                return (
                  <div
                    key={idx}
                    className="border-t border-gray-200 py-8 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggle(idx)}
                      className="flex justify-between items-center w-full text-left text-lg gap-5 font-medium text-gray-800"
                    >
                      <ul className="text-lg font-medium text-[#101828] space-y-2 list-disc list-inside pl-0">
                        <li>
                          <span>{item.question}</span>
                        </li>
                      </ul>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                          isOpen
                            ? "border-[#667085] text-[#667085]"
                            : "border-red-500 text-red-500"
                        }`}
                      >
                        {isOpen ? (
                          <IconMinus size={16} />
                        ) : (
                          <IconPlus size={16} />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-[#667085] text-base font-normal leading-relaxed mr-10">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <HelpSection
          heading={
            <>
              Your Questions hasn't
              <br />
              been Answered Here?
            </>
          }
          description={
            <>
              If you have any questions that have not been answered here, please
              email us at{" "}
              <span className="text-primary-red underline">
                <a
                  href="mailto:info@homewindfall.com"
                  className="hover:underline"
                >
                  info@homewindfall.com
                </a>
              </span>{" "}
              and we will happily answer them for you.
            </>
          }
          buttonText="Send Us a Mail"
          onClick={() =>
            (window.location.href = "mailto:info@homewindfall.com")
          }
        />
      </main>
    </div>
  );
}
