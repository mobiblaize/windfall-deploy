import { Container, Divider, Group, Text, Title } from "@mantine/core";
import SectionBanner from "../components/SectionBanner";
import { NavLink } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <section className="bg-[#fff]">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title order={2} className="text-black mb-10">
            Terms And Conditions
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[40vw]">
            The terms govern your use of{" "}
            <span className="!text-primary-red"><NavLink to={'/dashboard'}>Windfall Raffle</NavLink></span>. By using
            our website, you accept and agree to be bound by them.
          </Text>
        </Group>
      </SectionBanner>

      <Container
        fluid
        className="!pt-8 !pb-16 !px-6 md:!px-16 sm:!mx-5 space-y-10"
      >
        {[
          {
            title: "Eligibility",
            content: [
              "Open to Lagos residents aged 18+.",
              "Employees and their immediate families are excluded.",
              "No refunds for ineligible or fraudulent entries.",
            ],
          },
          {
            title: "How to Enter",
            content: [
              "Select and enter raffles from the categories.",
              "Register or log into your Windfall account.",
              "Purchase as many tickets as you would like.",
              "Confirmation and ticket number will be sent via email or SMS.",
              "Wait for the live draw date and stay tuned for your chance to win big.",
            ],
          },
          {
            title: "Choosing a Winner",
            content: [
              "A winner is randomly selected at the end of the raffle.",
              "Draw may be streamed live on official channels.",
              "Disrupted draws may be rerun at the promoter’s discretion.",
            ],
          },
          {
            title: "Prizes & Delivery",
            content: [
              "Prize details appear on each raffle’s listing.",
              "Prizes may change or have cash alternatives.",
              "Prizes are non-transferable unless stated.",
            ],
          },
          {
            title: "Prize Claims",
            content: [
              "Must claim within 7 days via official contact.",
              "Must claim in person — no third-party collection.",
              "Property winners sign ownership documents.",
            ],
          },
          {
            title: "Data Usage & Publicity",
            content: [
              "Your info is used to process and confirm your entry.",
              "Winners may be asked to appear in social media content.",
              "You may request anonymity.",
            ],
          },
          {
            title: "Refunds & Liability",
            content: [
              "No refunds for ineligible, failed, or duplicate entries.",
              "Promoter is not liable for indirect loss unless due to negligence.",
            ],
          },
          {
            title: "Special Terms — Property Prizes",
            content: [
              "You're required to sign legal documents for transfer.",
              "Taxes, legal fees, and documentation are your responsibility.",
              "Promoter may reassign unclaimed or disputed property prizes.",
            ],
          },
          {
            title: "Legal & Jurisdiction",
            content: [
              "All raffles governed by Nigerian law.",
              "These raffles are not sponsored by Instagram, Facebook, or YouTube.",
            ],
          },
          {
            title: "Contact us",
            content: [
              "Operated by Home Windfall Ltd, Reg No. 8385235",
              "HQ: 1a Karim Kotun Street, VI, Lagos",
              <span className="text-primary-red underline">
                <a href="contact@homewindfall.com" className="hover:underline">
                  contact@homewindfall.com
                </a>{" "}
                |{" "}
                <a href="tel:+2349039537488" className="hover:underline">
                  0903 953 7488
                </a>
              </span>,
            ],
          },
        ].map((section, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <Text className="!font-medium !text-xl !text-gray-800">
                {section.title}
              </Text>
            </div>
            <div className="col-span-12 md:col-span-7">
              <ul className="text-base text-gray-700 space-y-2 list-disc pl-4">
                {section.content.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            {idx < 9 && <Divider className="col-span-12 my-4" />}
          </div>
        ))}
      </Container>
    </section>
  );
}
