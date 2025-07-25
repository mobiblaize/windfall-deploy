import { Container, Divider, Group, Text, Title } from "@mantine/core";
import SectionBanner from "../components/SectionBanner";
import { NavLink } from "react-router-dom";

const policies = [
  {
    heading: "Introduction",
    content:
      "Windfall Raffle is operated by Home Windfall Ltd. We are committed to safeguarding your personal information and complying with relevant data protection laws, including NDPR, AML, KYC obligations. This privacy policy describes how we collect, use and protect your personal information that you entrust with us.",
  },
  {
    heading: "What information we collect",
    content:
      "We collect the following data when you use our platform; identity information: name, DOB, address, NIN, or passport. Contact details: Email, phone number. KYC documents; ID uploads, proof of address. Financial details: bank name, account number, BVN. Device and usage data: IP address, browser locations, time zone. Raffle activity: entries, winnings, claims.",
  },
  {
    heading: "Why we collect your data?",
    content:
      "We use your data: verify your identity (KYC), enable account creation and log in, process raffle entries and manage winnings, notify winners and enable prize claiming, detect fraud and suspicious activities, provide customer support and dispute resolution, improve our platform and measure engagements and fulfill legal and regulatory requirements.",
  },
  {
    heading: "Data sharing and third parties",
    content:
      "We may share your information with: KYC verification vendors (ID/passport validation), payment processors for cash or crypto transfers, legal entities for property title issuance, Government law enforcement authorities if required by law.",
  },
  {
    heading: "Data storage, security and retention",
    content:
      "All data encrypted in transit (SSL) and at rest, access to personal data is restricted to authorized personnel only. We maintain 99% platform uptime and daily cloud backups. Your data is retained only as long as legally necessary or until your account is deleted, whichever is longer.",
  },
  {
    heading: "Your rights and controls",
    content: (
      <>
        You have the right to access or download your personal data, correct
        inaccurate or outdated information, delete your account and data
        (subject to legal limits), opt out of non-essential communication and
        marketing, contact our data protection officer at{" "}
        <span className="text-primary-red hover:underline">
          <a href="mailto:privacy@windfall.ng" className="hover:underline">
            privacy@windfall.ng
          </a>
        </span>
      </>
    ),
  },
  {
    heading: "Cookies and tracking",
    content: (
      <>
        We use cookies for: securing your session, improving site performance,
        analytics and personalized user experience and you can manage your
        cookie preferences in your browser or via our{" "}
        <span className="!text-primary-red hover:underline">
          <NavLink to={"/profile/settings"}>[cookie settings]</NavLink>
        </span>{" "}
        panel.
      </>
    ),
  },
  {
    heading: "Contact us",
    content: (
      <>
        If you have questions, complaints or requests please reach us via email:{" "}
        <span className="text-primary-red hover:underline">
          <a href="mailto:privacy@windfall.ng" className="hover:underline">
            privacy@windfall.ng
          </a>
        </span>
        , also via phone:{" "}
        <a
          href="tel:+2348007543675"
          className="!text-primary-red !font-medium hover:underline"
        >
          +234 800 7543 675
        </a>{" "}
        and you can also visit us at{" "}
        <span className="!text-primary-red hover:underline">
          <NavLink to={"/dashboard"}>Home Windfall Ltd, Lagos, Nigeria.</NavLink>
        </span>{" "}
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="bg-white">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title order={2} className="text-black mb-10">
            Privacy Policy
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[40vw]">
            <span className="!text-primary-red">
              <NavLink to="/dashboard">Windfall</NavLink>
            </span>{" "}
            is committed to protecting policy. This policy explains how we
            handle your personal data.
          </Text>
        </Group>
      </SectionBanner>

      <Container fluid className="!pt-8 !pb-16 !px-6 md:!px-16 sm:!mx-5">
        {policies.map(({ heading, content }, i) => (
          <div key={i} className="grid md:grid-cols-12 gap-6 md:gap-y-0">
            <div className="col-span-12 md:col-span-5">
              <Text className="!font-medium !text-xl !text-gray-800">
                {heading}
              </Text>
            </div>
            <div className="col-span-12 md:col-span-7">
              <Text className="!text-base !text-gray-700 !leading-relaxed !whitespace-pre-line">
                {content}
              </Text>
            </div>
            {i < policies.length - 1 && (
              <Divider className="col-span-12 !my-6" />
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}
