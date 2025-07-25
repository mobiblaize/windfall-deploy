import SectionHeader from "../components/SectionHeader";
import downloadl from "../assets/download-app-l.png";
import downloadr from "../assets/Wallet.png";
import appMockup from "../assets/app-mock-up.png";
import MainButton from "../components/Buttons/MainButton";
import { IconFileDownloadFilled } from "@tabler/icons-react";
import DownloadAppContainer from "../components/DownloadAppContainer";

const features = [
  {
    title: "Enter Raffles in Seconds",
    description:
      "Buy tickets and join exciting draws easily with just a few taps.",
  },
  {
    title: "Stay Updated Instantly",
    description:
      "Get real-time draw results and notifications right on your phone.",
  },
  {
    title: "Secure Your Win, Fast",
    description:
      "Winners can claim prizes quickly with clear steps and full transparency.",
  },
  {
    title: "Discover New Opportunities",
    description:
      "Browse fresh raffles, early bird draws, and limited-time prizes all in one place.",
  },
];

export default function DownloadApp() {
  return (
    <div className="mb-5 md:mb-10 flex flex-col h-full">
      <SectionHeader
        heading={<>Raffle in your FingerTip🚀</>}
        subHeading="Create a new password today for a secured login"
        imageLeft={downloadl}
        imageRight={downloadr}
        imageLeftWidth="30vw"
        imageRightWidth="12vw"
      />

      <main className="px-6 md:px-16 my-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="items-start pb-6 border-b border-gray-200"
              >
                <div className="flex-shrink-0 mb-2">
                  <div className="bg-[#FFE3E4] text-primary-red inline-block p-2 rounded-md text-xl">
                    <IconFileDownloadFilled />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-gray-500 text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center md:justify-end relative">
            <DownloadAppContainer>
              <img
                src={appMockup}
                alt="iPhone App Mockup"
                className="w-full aspect-[6/6] object-cover overflow-hidden rounded-xl"
              />
            </DownloadAppContainer>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          <MainButton>Download on App Store</MainButton>
          <MainButton variant="dark">Download on PlayStore</MainButton>
        </div>
      </main>
    </div>
  );
}
