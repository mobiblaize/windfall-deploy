import { Card, Grid, Group, Text, Title } from "@mantine/core";
import {
  IconUserCheck,
  IconCreditCard,
  IconGift,
  IconTrophy,
  IconShieldCheck,
  IconBan,
  IconAlertTriangle,
  IconClipboardList,
} from "@tabler/icons-react";
import SectionBanner from "../components/SectionBanner";
import { NavLink } from "react-router-dom";

const rules = [
  {
    title: "Eligibility",
    icon: IconUserCheck,
    bullets: [
      "You must be 18+ years old",
      "Residency must be in Nigeria",
      "KYC verification must be complete",
    ],
  },
  {
    title: "Ticket purchase",
    icon: IconCreditCard,
    bullets: [
      "Tickets are purchased via wallet or payment integration",
      "Residency must be in Nigeria",
      "KYC verification must be complete",
    ],
  },
  {
    title: "Raffle entry process",
    icon: IconClipboardList,
    bullets: [
      "Select a raffle from the dashboard",
      "Choose ticket quantity and complete payment",
      "Entry is confirmed instantly and visible in your account",
    ],
  },
  {
    title: "Winner selection",
    icon: IconTrophy,
    bullets: [
      "Winners are selected randomly using a secure system",
      "Results are verifiable and logged",
      "Winners are notified via dashboard, email, and SMS.",
    ],
  },
  {
    title: "Prize claims",
    icon: IconGift,
    bullets: [
      "You must claim your prize within 14 days",
      "KYC and additional documents may be required",
      "Real estate prizes involve legal ownership transfer",
    ],
  },
  {
    title: "Fair Play & Transparency",
    icon: IconShieldCheck,
    bullets: [
      "All raffles are tracked and auditable by admin",
      "Raffle history and logs are maintained",
      "Maker-checker approval for raffle setup",
    ],
  },
  {
    title: "Dispute Resolution",
    icon: IconAlertTriangle,
    bullets: [
      "Disputes can be submitted through support",
      "Admin reviews are final unless legally escalated",
    ],
  },
  {
    title: "Disqualification & Fraud",
    icon: IconBan,
    bullets: [
      "Cheating, fake accounts, or fraudulent claims are disqualified",
      "Violations result in ban or legal action",
    ],
  },
];

export default function GameRules() {
  return (
    <div className="bg-white">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title order={2} className="text-black mb-10">
            Game Rules
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[30vw]">
            Understand how{" "}
            <span className="!text-primary-red"><NavLink to={'/dashboard'}>Windfall Raffle</NavLink></span> works.
            Know the rules know the rewards
          </Text>
        </Group>
      </SectionBanner>
      <div className="sm:!mx-5 !px-6 md:!px-16 !py-15">
        <Grid gutter="xl">
          {rules.map((rule, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6 }}>
              <Card
                withBorder
                radius="md"
                className="h-full !rounded-2xl !border-dashed !border-primary-red !bg-light-red !p-8"
              >
                <Group>
                  <div className="bg-red-100 p-2 rounded-xl">
                    <rule.icon size={28} className="text-red-500" />
                  </div>
                  <Text className="font-semibold !text-lg text-gray-900">
                    {rule.title}
                  </Text>
                </Group>

                <ul className="list-disc list-outside space-y-1 text-red-500">
                  {rule.bullets.map((bullet, i) => (
                    <li
                      className="mb-0 text-3xl leading-none pl-2 ml-20"
                      key={i}
                    >
                      <span className="text-[#575757] text-base">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </div>
  );
}
