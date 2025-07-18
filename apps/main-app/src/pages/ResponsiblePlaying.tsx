import { Container, Divider, Text, Title } from "@mantine/core";
import SectionBanner from "../components/SectionBanner";

export default function ResponsiblePlaying() {
  return (
    <section className="bg-[#fff]">
      <SectionBanner>
        <Title order={2} className="text-black mb-10">
          Responsible Playing
        </Title>
      </SectionBanner>
      <Container fluid className="!pt-8 !pb-16 !px-6 md:!px-16 sm:!mx-5">
        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Text className="!font-medium !text-xl !uppercase !text-gray-800">
            Windfall Raffle Responsibly.
          </Text>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              Windfall Raffle is a paid entry raffle website that has been
              designed to be a fun and sociable way to win amazing prizes. We
              are licenced by Lagos State Lotteries and Gaming Authority but
              remain committed to providing a service that is socially
              responsible. We’ve designed our platform to be as much about
              social interaction as possible.
            </p>
            <p>
              If you think that you are having problems whilst playing on
              Windfall Raffle, we want to help you as quickly as we can.
            </p>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Text className="!font-medium !text-xl !uppercase !text-gray-800">
            Signs That You May Have Problem
          </Text>
          <ul className="text-base text-gray-700 space-y-2 list-disc pl-4">
            <li>
              Treating playing as a way of making money, rather than a source of
              entertainment
            </li>
            <li>
              Attempting to chase losses or playing to escape financial
              difficulty
            </li>
            <li>Spending money and time beyond your means</li>
            <li>
              Selling possessions and borrowing money in order to keep playing
            </li>
            <li>Unable or struggling to manage or stop playing</li>
          </ul>
        </div>

        <Divider className="my-6" />

        {/* Section 3 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Text className="!font-medium !text-xl !uppercase !text-red-600">
            How To Pause or Take a Break
          </Text>
          <Text className="!text-base !text-red-500">
            Log in and click on Safe Playing to take a time out or exclude
            yourself permanently from playing.
          </Text>
        </div>

        <Divider className="my-6" />

        {/* Section 4 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Text className="!font-medium !text-xl !uppercase !text-gray-800">
            Actions We May Take
          </Text>

          <ul className="text-base text-gray-700 space-y-2 list-disc pl-4">
            <li>
              As a responsible business that wishes to ensure that all of its
              customers play for fun and within their means, we may contact you
              if we see any behaviour that we think is unusual or excessive.
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
