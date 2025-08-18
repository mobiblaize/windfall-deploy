import { Avatar, Box, Grid, Group, Image, Text, Title } from "@mantine/core";
import SectionBanner from "../../components/SectionBanner";
import CustomTickets from "../../components/CustomTickets";
import raffleImg from "../../assets/default-raffle.png";
import QRCodeImage from "../../assets/qr-code.png";
import RaffleBadge from "../../components/RaffleBadge";
import { IconTrophy } from "@tabler/icons-react";
import ClaimPricesStep1 from "./ClaimPricesStep1";
import { useState } from "react";
import ClaimPricesStep2 from "./ClaimPricesStep2";
import ClaimPricesStep3 from "./ClaimPricesStep3";
import ClaimSuccessModal from "./ClaimSuccessModal";
import { useNavigate } from "react-router-dom";
import GamesTicketModal from "../../components/Modals/GamesTicketModal";

const formData = {
  raffleTitle: "3 bedroom house in lekki",
  winnerName: "Adekunle ibrahim",
  dob: "05/10/1991",
  legalName: "Adekunle ibrahim olamide",
  address: "13 bode thomas surulere lagos",
  email: "adekunleibrahim@gmail.com",
  phone: "+234 6784333329",
};

const steps = [
  {
    number: 1,
    label: "Identity verification",
    description: "Identity verification",
    component: (onNext: () => void) => <ClaimPricesStep1 onNext={onNext} />,
  },
  {
    number: 2,
    label: "Ownership",
    description: "Ownership handover Details",
    component: (onNext: () => void) => <ClaimPricesStep2 onNext={onNext} />,
  },
  {
    number: 3,
    label: "Review and submit",
    description: "Review and submit",
    component: (onSubmit: () => void) => (
      <ClaimPricesStep3 onSubmit={onSubmit} formData={formData} />
    ),
  },
];

export default function ClaimPrices() {
  const [activeStep, setActiveStep] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setReferenceId("WF-CLAIM-023423"); // Replace with real logic if needed
      setSuccessModalOpen(true);
    }
  };

  function closeSuccessModal() {
    setSuccessModalOpen(false);
    navigate("/dashboard");
  }

  return (
    <div className="bg-white pb-10">
      <SectionBanner>
        <Group
          align="center"
          justify="center"
          gap="lg"
          className="!gap-5 !justify-center !items-center !flex-col"
        >
          <Title
            order={2}
            className="!font-bold !text-[#2D2D2D] !text-2xl !flex !items-center !gap-2 !text-center"
          >
            Congratulations adekunle !!! you have won a house in the windfall
            raffle
          </Title>
          <Text className="text-base !font-medium !text-gray-800 md:!w-[40vw] !text-center">
            Lets help you claim your prize in a few easy steps
          </Text>
        </Group>
      </SectionBanner>

      <div className="px-6 py-10 mx-10">
        <div className="border border-dashed !border-[#039855] p-5">
          <CustomTickets
            cardClick={() => setTicketModalOpen(true)}
            className="!border-[#039855]"
            borderColor="!border-[#039855]"
            bgColor="!bg-[#F6FEF9]"
            containerBgColor="!bg-[#fff]"
          >
            <Grid gutter="xl" justify="center">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <div className="overflow-hidden mb-3 text-center">
                  <img
                    src={raffleImg}
                    alt="raffle"
                    className="w-full rounded-xl h-70 object-cover mb-[-1.25rem]"
                  />
                  <RaffleBadge date={"June 2, 2025 | 10:00am"} status={"won"} />
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div className="relative p-6">
                  <div className="flex gap-5 items-center justify-between !mb-6">
                    <div>
                      <Text className="!text-xl md:!text-2xl !font-semibold !text-gray-900 mb-1">
                        3 bedroom duplex
                      </Text>
                      <Text className="!text-sm !text-gray-600">
                        Win 3 bed room flat at the high prestige location
                      </Text>
                    </div>
                    <Image
                      src={QRCodeImage}
                      alt="QR Code"
                      className="!w-[7vw] !h-[7vw] !bg-white !border-2 !rounded-xl !border-[#32D583]"
                    />
                  </div>

                  <Box className="border-2 relative border-dashed border-green-400 text-center px-6 py-4 rounded-lg bg-white !mb-5">
                    <div className="absolute -left-10 top-0 translate-y-1/2 rotate-[-35deg] border-2 border-dashed border-green-400 px-4 py-2 rounded-full bg-[#D1FADF] text-[#039855] font-semibold text-sm flex items-center gap-1 shadow-md">
                      Winning Ticket
                      <IconTrophy size={16} />
                    </div>

                    <Text className="!text-sm !text-gray-600 !mb-1">
                      Ticket Number
                    </Text>
                    <Text className="!text-red-600 !text-xl !font-bold !tracking-wide">
                      #WF100423X8
                    </Text>
                  </Box>

                  <Group className="mt-2 !justify-center !items-center">
                    <Avatar
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Owner"
                      radius="xl"
                      size="md"
                    />
                    <Box>
                      <Text className="!text-xs !text-gray-500">
                        Ticket Owner
                      </Text>
                      <Text className="!text-sm !font-medium !text-gray-800">
                        Adekunle, Ibrahim (ID:9040)
                      </Text>
                    </Box>
                  </Group>
                </div>
              </Grid.Col>
            </Grid>
          </CustomTickets>
        </div>

        <Box className="w-full mt-10">
          <h2 className="text-center text-red-500 font-medium mb-6">
            Claim your prize with this few steps{" "}
            <span className="animate-bounce">↓</span>
          </h2>

          <div className="flex justify-center mb-4">
            <div className="w-full sm:w-[80vw] h-px bg-gray-200" />
          </div>

          <Box className="flex justify-between items-center bg-white border-t border-b py-6 rounded-t-lg">
            {steps.map((step, index) => {
              const isActive = step.number <= activeStep + 1;
              return (
                <Box
                  key={step.number}
                  className="!flex-1 !flex !flex-col !items-center !relative"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium z-10
                    ${isActive ? "bg-primary-red text-white" : "bg-white text-gray-500 border-gray-300"}`}
                  >
                    {step.number}
                  </div>
                  <Text
                    className={`mt-2 text-sm ${
                      isActive ? "!text-black !font-medium" : "!text-gray-400"
                    }`}
                  >
                    {step.label}
                  </Text>
                  {index !== steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-px bg-gray-200 z-0 translate-x-1" />
                  )}
                </Box>
              );
            })}
          </Box>

          <Text className="!mt-4 !text-base !font-medium !text-red-500 !text-center">
            Step {activeStep + 1}{" "}
            <span className="ml-2 text-black font-normal">
              {steps[activeStep].description}
            </span>
          </Text>
        </Box>

        <div className="px-6 sm:px-16">
          {steps[activeStep].component(handleNextStep)}

          <div className="mt-8 flex justify-center space-x-2">
            {steps.map((_, i) => (
              <span
                key={i}
                onClick={() => {
                  if (i <= activeStep + 1) setActiveStep(i);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${
                  i === activeStep
                    ? "bg-primary-red scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ClaimSuccessModal
        opened={successModalOpen}
        onClose={closeSuccessModal}
        raffleTitle={formData.raffleTitle}
        referenceId={referenceId}
      />

      {ticketModalOpen && (
        <GamesTicketModal
          item={""}
          isOpened={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
}
