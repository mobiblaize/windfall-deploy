import { Container, Divider, Group, Text, Title } from "@mantine/core";
import SectionBanner from "../components/SectionBanner";
import { NavLink } from "react-router-dom";
import { IconMail, IconPhone } from "@tabler/icons-react";

const policies = [
  {
    heading: "What Are Cookies?",
    content:
      "Cookies are small text files stored in your browser when you visit a website. They help recognize your device and state preferences",
  },
  {
    heading: "Type of cookies we use",
    content: (
      <>
        <ul className="text-base text-gray-700 space-y-2">
          <li className="relative pl-4 before:content-['-'] before:absolute before:left-0">
            <span className="font-medium">Strictly necessary;</span> required
            for log in and security
          </li>
          <li className="relative pl-4 before:content-['-'] before:absolute before:left-0">
            <span className="font-medium">Functional;</span> remembers users
            preferences
          </li>
          <li className="relative pl-4 before:content-['-'] before:absolute before:left-0">
            <span className="font-medium">Analytics;</span> helps us understand
            traffic and behavior
          </li>
          <li className="relative pl-4 before:content-['-'] before:absolute before:left-0">
            <span className="font-medium">Marketing;</span> used for referral
            tracking and promotions
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Why we use cookies",
    content: (
      <>
        <ul className="text-base text-gray-700 space-y-2">
          {[
            "Maintain login sessions",
            "Improve website performance",
            "Analyze how users interact with raffles and pages",
            "Personalize experience and referrals",
          ].map((text, index) => (
            <li
              key={index}
              className="relative pl-4 before:content-['-'] before:absolute before:left-0"
            >
              {text}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: "Manage your preferences",
    content: (
      <>
        You can choose which cookie you allow using the{" "}
        <span className="!text-primary-red hover:underline">
          <NavLink to={"/profile/settings"}>cookie settings</NavLink>
        </span>{" "}
        panel
      </>
    ),
  },
  {
    heading: "Third party cookies",
    content:
      "Some features like analytics and payment rely on third party cookies . these are subjewct to their own policies",
  },
  {
    heading: "How to disable cookies",
    content:
      "You can manage cookies from your browser settings. Blocking essential cookies may affect your experience",
  },
  {
    heading: "Contact",
    content: (
      <>
        <div className="flex gap-5 !items-center align-bottom mb-4">
          <div className="text-primary-red">
            <IconMail size={25} />
          </div>
          <span>
            Email:{" "}
            <a
              href="mailto:legal@windfall.ng"
              className="!text-primary-red !font-medium hover:underline"
            >
              legal@windfall.ng
            </a>
          </span>
        </div>
        <div className="flex gap-5 !items-center align-bottom">
          <div className="text-primary-red">
            <IconPhone size={25} />
          </div>
          <span>
            Phone:{" "}
            <a
              href="tel:+2348007543675"
              className="!text-primary-red !font-medium hover:underline"
            >
              +234 800 7543 675
            </a>
          </span>
        </div>
      </>
    ),
  },
];

export default function CookiePolicy() {
  return (
    <section className="bg-white">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title order={2} className="text-black mb-10">
            Cookies Policy
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[40vw]">
            This page explains how and why{" "}
            <span className="!text-primary-red">
              <NavLink to="/dashboard">windfall raffle</NavLink>
            </span>{" "}
            uses cookies. By using our website you consent to the use of cookies
            in accordance with this policy
          </Text>
        </Group>
      </SectionBanner>

      <Container fluid className="!pt-8 !pb-16 !px-6 md:!px-16 sm:!mx-5">
        {policies.map(({ heading, content }, i) => (
          <div key={i} className="grid md:grid-cols-12 gap-6 md:gap-y-0">
            <div className="col-span-12 md:col-span-5">
              <Text className="!font-medium !text-2xl !text-gray-800">
                {heading}
              </Text>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="!text-lg !text-gray-700 !leading-relaxed !whitespace-pre-line">
                {content}
              </div>
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
