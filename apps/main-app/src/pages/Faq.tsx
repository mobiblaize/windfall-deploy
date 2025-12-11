import { useState } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { Image } from "@mantine/core";
import SectionHeader from "../components/SectionHeader";
import faql from "../assets/faq-l.png";
import faqr from "../assets/faq-r.png";
import faqImage from "../assets/faq-img.png";
import HelpSection from "../components/HelpSection";
import SEO from "../components/SEO";

const faqData = [
  {
    question: "How do I enter the raffle?",
    answer: "Entering is simple. Browse any available raffle or instant game, select the number of entries you want, and complete your checkout. Once payment is confirmed, your entry is automatically added to the competition."
  },
  {
    question: "What is my draw number?",
    answer: "Your draw number is the unique entry code assigned to you after purchase. You can find it in My Games → Active Tickets, on your email receipt, and on the raffle details page."
  },
  {
    question: "How is the winner chosen?",
    answer: "For Draw Games, the winner is selected using a transparent, random, computer-generated process. For Instant Games, results are determined immediately the moment you play according to preset winning logic."
  },
  {
    question: "How will I know if I have won?",
    answer: "Winners are notified instantly via email, in-app notification, and an update in My Games → Results. For Instant Wins, you'll see your result immediately on the game screen."
  },
  {
    question: "How long is the competition open for?",
    answer: "Each competition has its own closing time. The countdown is always visible on the game page. Once the timer hits zero or all tickets sell out, the draw is closed."
  },
  {
    question: "Can anyone enter the competition?",
    answer: "Anyone who meets the age requirement and resides in eligible regions can participate. Restricted locations will be shown during account creation or checkout."
  },
  {
    question: "What if a competition does not sell out?",
    answer: "The draw still proceeds at the scheduled time. All valid entries remain eligible, and the prize is still awarded as advertised."
  },
  {
    question: "What are the prizes?",
    answer: "Prizes vary by competition and may include cash, gadgets, lifestyle items, or exclusive rewards. Each raffle clearly states its prize on the game page before you join."
  },
  {
    question: "Is Windfall Raffle a scam?",
    answer: "No. Windfall Raffle operates with full transparency. Winners are selected through verified random processes, results are published publicly, and prizes are delivered promptly. Every ticket purchased is trackable and verifiable."
  },
  {
    question: "How do you use my personal data?",
    answer: "Your information is used only to manage your account, process payments, and notify you about results. We do not sell or misuse your data. All information is stored securely and handled according to our privacy policy."
  },
  {
    question: "Can I try again?",
    answer: "Yes. As long as the competition is still open, you can buy more entries, or replay an instant game until you reach the entry limit (if any)."
  },
  {
    question: "What are my chances of winning?",
    answer: "Your chances depend on the number of entries you purchase compared to the total entries available. For instant games, chances follow the predefined winning structure shown in the game details."
  },
  {
    question: "Can I get a refund of my entry fee?",
    answer: "Entry fees are generally non-refundable once a ticket has been issued. However, refunds may be considered if a technical issue prevented successful entry. Contact Support if this occurs."
  },
  {
    question: "How do the instant win competitions work?",
    answer: "Instant Games reveal results immediately after you play. Each game has predefined winning odds and prize placements. If your play hits a winning position, you win instantly — no waiting for a scheduled draw."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mb-5 md:mb-10 flex flex-col h-full">
      <SEO 
        title="Frequently Asked Questions"
        description="Find answers to common questions about WindFall Raffle. Learn how to enter raffles, check results, claim prizes, and more."
        url="https://homewindfall.com/faq"
        keywords="FAQ, frequently asked questions, raffle help, how to play, WindFall help"
      />
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
