import { Text, Card, Image, Grid, Divider, Flex } from "@mantine/core";
import walletImage from "../../assets/Wallet.png";
import CustomButton from "../../components/Buttons/CustomButton";
import { HiDocumentArrowDown } from "react-icons/hi2";
import RaffleBadge from "../../components/RaffleBadge";
import RelatedRaffles from "../raffles/RelatedRaffles";
import { useEffect, useState } from "react";
import AlertModal from "../../components/Modals/AlertModal";
import MyGameHeader from "./MyGameHeader";
import type { Crumb } from "../../components/DynamicBreadCrumbs";
import { useOutletContext } from "react-router-dom";

const raffles = [
  {
    title: "1 Bed Room Flat at Banana Island, Lagos State, Nigeria",
    subtitle: "Win 3 bed room flat at the high prestige location",
    tickets: 32,
    purchased: "April 11, 2025",
    drawDate: "June 2, 2025 | 10:00am",
  },
  {
    title: "1 Bed Room Flat at Banana Island, Lagos State, Nigeria",
    subtitle: "Win 3 bed room flat at the high prestige location",
    tickets: 32,
    purchased: "April 11, 2025",
    drawDate: "June 2, 2025 | 10:00am",
  },
  {
    title: "1 year of Mini-Flat Rent, Ikorodu, Lagos State, Nigeria",
    subtitle:
      "Seize the chance to win a stunning 3 bedroom condo in a sought-after area",
    tickets: 32,
    purchased: "April 11, 2025",
    drawDate: "August 15, 2025 | 1:00pm",
  },
  {
    title: "2023 Tesla Model S",
    subtitle: "Experience the luxury of electric driving",
    tickets: 50,
    purchased: "April 11, 2025",
    drawDate: "July 15, 2025 | 12:00pm",
  },
  {
    title: "4 Bedroom Villa at Ocean View, Miami, Florida",
    subtitle: "Enter to win a luxurious 4 bedroom villa in an upscale area",
    tickets: 50,
    purchased: "April 11, 2025",
    drawDate: "July 10, 2025 | 12:00pm",
  },
  {
    title: "4 Bedroom Villa at Ocean View, Miami, Florida",
    subtitle: "Enter to win a luxurious 4 bedroom villa in an upscale area",
    tickets: 50,
    purchased: "April 11, 2025",
    drawDate: "July 10, 2025 | 3:00pm",
  },
];

type ContextType = { setCrumbs: React.Dispatch<React.SetStateAction<Crumb[]>> };
const items: Crumb[] = [
  { label: "Transactions", to: "/profile/transaction" },
  { label: "Order 121211" },
];

export default function PaymentReceipt() {
  const { setCrumbs } = useOutletContext<ContextType>();

  useEffect(() => {
    setCrumbs(items);
  }, [setCrumbs]);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  return (
    <div>
      <MyGameHeader
        title={
          <span
            className="!font-bold !text-[#2D2D2D] !text-2xl !mb-1"
          >
            Order ID: <span className="text-primary-red">9049404GJSB</span>
          </span>
        }
        description="View and download transaction receipt."
      >
        <CustomButton
          onClick={() => setSuccessModalOpen(true)}
          rightSection={<HiDocumentArrowDown size={18} />}
        >
          Download Receipt
        </CustomButton>
      </MyGameHeader>
      <Divider />
      <section className="sm:mx-5 px-6 md:px-16 py-12">
        <Grid gutter="lg" className="!mb-20">
          {raffles.map((item, i) => (
            <Grid.Col
              key={i}
              span={{ base: 12, sm: 6, md: 4 }}
              className="!justify-start !cursor-pointer !flex !flex-col mb-10 !items-center 
             !transition-transform !duration-300 !ease-in-out 
             hover:!translate-y-16 group"
            >
              <Image src={walletImage} alt="wallet" className="!w-[66%] mb-5" />
              <Card
                withBorder
                radius="lg"
                className="!pb-7 w-full !shadow-md transition-all duration-300 !border !border-transparent
               group-hover:!border-primary-red group-hover:!bg-light-red"
              >
                <Text
                  fw={600}
                  mt="sm"
                  className="!text-[#2D2D2D] text-center !text-xl !font-bold"
                >
                  {item.title}
                </Text>

                <Text className="text-center !text-secondary-text !text-sm">
                  {item.subtitle}
                </Text>

                <Flex justify="space-between" gap={5} className="!mt-4 !mb-3">
                  <Text className="!text-sm !text-secondary-text">
                    <span>No. of Ticket Unit (s):</span>
                  </Text>
                  <Text className="!text-sm !text-primary-text !font-medium">
                    <span>{item.tickets}</span>
                  </Text>
                </Flex>

                <Flex justify="space-between" gap={5} className="!mb-3">
                  <Text className="!text-sm !text-secondary-text">
                    <span>Ticket Unit Price: </span>
                  </Text>
                  <Text className="!text-sm !text-primary-text !font-medium">
                    <span>₦3,000</span>
                  </Text>
                </Flex>

                <Flex justify="space-between" gap={5} className="!mb-3">
                  <Text className="!text-sm !text-secondary-text">
                    <span>Discount Amount:</span>
                  </Text>
                  <Text className="!text-sm !text-primary-text !font-medium">
                    <span>₦1,000</span>
                  </Text>
                </Flex>

                <Flex justify="space-between" gap={5} className="!mb-3">
                  <Text className="!text-sm !text-secondary-text">
                    <span>Sub-Total:</span>
                  </Text>
                  <Text className="!text-sm !text-primary-text !font-medium">
                    <span>₦29,000</span>
                  </Text>
                </Flex>

                <RaffleBadge date={"June 2, 2025 | 10:00am"} status={"won"} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <div className="-mx-5 mt-10">
          <RelatedRaffles />
        </div>
        <AlertModal
          opened={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          status="success"
          title="Receipt Downloaded"
          description="Congratulation, you have successfully downloaded the receipt for this transaction."
        />
      </section>
    </div>
  );
}
