import {
  Container,
  Title,
  Text,
  Card,
  Image,
  Group,
  Grid,
} from "@mantine/core";
import { IconCalendarWeek, IconTicket } from "@tabler/icons-react";
import walletImage from "../../assets/Wallet.png";
import CustomButton from "../../components/Buttons/CustomButton";
import { HiDocumentArrowDown } from "react-icons/hi2";
import RaffleBadge from "../../components/RaffleBadge";
import RelatedRaffles from "../raffles/RelatedRaffles";
import { useState } from "react";
import AlertModal from "../../components/Modals/AlertModal";

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

export default function PaymentReceipt() {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  return (
    <Container size="xl" className="py-8">
      <Group justify="space-between" className="!mb-10">
        <div>
          <Title
            order={3}
            className="!font-bold !text-[#2D2D2D] !text-2xl !mb-1"
          >
            Payment Receipt ID:{" "}
            <span className="text-primary-red">9049404GJSB</span>
          </Title>
          <Text className="!text-sm" c="dimmed">
            Details of raffle ticket purchased, consisting of all raffle tickets
            across multiple games.
          </Text>
        </div>

        <CustomButton onClick={()=>setSuccessModalOpen(true)} rightSection={<HiDocumentArrowDown size={18}/>}>
          Download Receipt
        </CustomButton>
      </Group>

      <Grid gutter="lg" className="!mb-20">
        {raffles.map((item, i) => (
          <Grid.Col
            key={i}
            span={{ base: 12, sm: 6, md: 4 }}
            className="!justify-end !flex !flex-col mb-10 !items-center"
          >
            <Image src={walletImage} alt="wallet" className="!w-[66%] mb-5" />
            <Card
              withBorder
              radius="lg"
              className="hover:shadow-md !pb-7 w-full"
            >
              <Text
                fw={600}
                mt="sm"
                className="!text-[#2D2D2D !text-xl !font-bold"
              >
                {item.title}
              </Text>

              <Text size="sm" c="dimmed">
                {item.subtitle}
              </Text>

              <Group className="!mt-4 !mb-3 !gap-5 !justify-center">
                <Group className="!gap-2 !justify-center !items-center">
                  <IconTicket size={16} className="text-primary-red" />
                  <Text size="xs" c="dimmed" className="text-primary-red">
                    <span>Ticket(s): {item.tickets}</span>
                  </Text>
                </Group>

                <Group className="!gap-2 !justify-center !items-center">
                  <IconCalendarWeek size={16} className="text-primary-red" />
                  <Text size="xs" c="dimmed">
                    Purchased: {item.purchased}
                  </Text>
                </Group>
              </Group>

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
              onClose={()=>setSuccessModalOpen(false)}
              status="success"
              title="Payment Receipt Downloaded"
              description="Congratulation, you have successfully downloaded the payment receipt for this transaction."
            />
    </Container>
  );
}
