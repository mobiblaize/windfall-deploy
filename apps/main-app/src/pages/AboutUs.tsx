import { Title, Text, Image, Container, Paper } from "@mantine/core";
import about1 from "../assets/about-1.png";
import about2 from "../assets/about-2.png";
import about3 from "../assets/about-3.png";
import about4 from "../assets/about-4.png";
import about5 from "../assets/about-5.png";
import visionImg from "../assets/about-6.png";
import missionImg from "../assets/about-7.png";
import team1 from "../assets/team-1.png";
import team2 from "../assets/team-2.png";
import team3 from "../assets/team-3.png";
import team4 from "../assets/team-4.png";
import team5 from "../assets/team-5.png";
import team6 from "../assets/team-6.png";
import RaffleHelpSection from "../components/RaffleHelpSection";
import SEO from "../components/SEO";

const values = [
  {
    id: "01",
    title: "Transparency",
    bg: "bg-white",
    content:
      "We believe in transparent, fair, and accountable operations. Every raffle draw is conducted with the highest level of integrity to maintain trust and ensure all participants have an equal chance of winning. Our commitment to ethical practices is at the core of everything we do.",
  },
  {
    id: "02",
    title: "Customer-Centricity",
    bg: "!bg-[#F7F7F9]",
    content:
      "Our users are more than just participants — they are partners in our mission. We prioritize user feedback, improve interactions, and personalize the experience to ensure everyone feels valued, heard, and supported every step of the way.",
  },
  {
    id: "03",
    title: "Impact",
    bg: "!bg-[#F7F7F9]",
    content:
      "Beyond excitement, we’re focused on creating real-world results. Each raffle helps drive community projects, fund dreams, and change lives. Our impact is measured not just in prizes given, but in futures uplifted and stories transformed.",
  },
  {
    id: "04",
    title: "Community",
    bg: "bg-white",
    content:
      "Our platform is rooted in the power of people. We create opportunities that unite individuals and foster shared joy. Through storytelling, recognition, and support, we strengthen bonds and uplift lives within our growing community.",
  },
];

const teamMembers = [
  {
    name: "Tunde Adekola",
    role: "Founder & CEO",
    image: team1,
    bg: "#A9B58D",
  },
  {
    name: "Wade Wilson",
    role: "Technical Lead",
    image: team2,
    bg: "#AA9C75",
  },
  {
    name: "Amina Ibrahim",
    role: "Raffles Operation Manager",
    image: team3,
    bg: "#D4B5AD",
  },
  {
    name: "Nyla Harper",
    role: "Head of Marketing",
    image: team4,
    bg: "#BEA887",
  },
  {
    name: "Lucy Chen",
    role: "Social Media Manager",
    image: team5,
    bg: "#A2A8CD",
  },
  {
    name: "Natali Craig",
    role: "Customer Support",
    image: team6,
    bg: "#D1BAA9",
  },
];

export default function AboutUs() {
  return (
    <div>
      <SEO 
        title="About Us"
        description="Learn about WindFall Raffle - creating life-changing wins for everyday Nigerians. Discover our mission, vision, values, and team."
        url="https://homewindfall.com/about"
        keywords="about WindFall, raffle company, team, mission, vision, values"
      />
      {/* ...About Us section ... */}
      <div className="relative w-full !px-6 md:!px-16 !pt-15">
        {/* Top red background */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-light-red z-0" />

        <div className="relative z-10 pt-5 pb-20">
          <Container size="lg" className="text-center">
            <Title
              order={2}
              className="!text-primary-red !font-bold !text-3xl !mb-2"
            >
              About Us
            </Title>
            <Text className="!text-lg !text-gray-700 !mb-10">
              Creating life-changing wins for everyday Nigerians.
            </Text>

            <div className="flex flex-row items-center justify-center gap-6">
              <Image
                src={about1}
                alt="Team working together"
                radius="md"
                className="!w-60 !h-60 !object-cover !max-w-[25vw] !max-h-[25vw] !shadow-lg !rotate-[-4deg] !mt-3"
              />
              <Image
                src={about2}
                alt="Woman writing on tablet"
                radius="md"
                className="!w-60 !h-60 !object-cover !max-w-[25vw] !max-h-[25vw] !shadow-lg !rotate-[0deg]"
              />
              <Image
                src={about3}
                alt="Discussion session"
                radius="md"
                className="!w-60 !h-60 !object-cover !max-w-[25vw] !max-h-[25vw] !shadow-lg !rotate-[4deg] !mt-3"
              />
            </div>
          </Container>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-[#FAFAFA] rounded-xl px-6 sm:px-10 md:px-12 pb-12">
        <div className="!pt-10 !pb-20 mb-20 px-6 md:!px-10 !bg-[#E7E6EC] rounded-2xl">
          <Title
            order={2}
            className="!text-center !text-primary-red !text-3xl !font-bold !mb-25"
          >
            Our Story
          </Title>

          <div className="flex flex-col md:flex-row gap-y-5 gap-x-10 items-center justify-between">
            {/* Text */}
            <div className="md:w-1/2 text-base text-gray-800 space-y-5">
              <Text className="!text-lg !font-semibold !text-primary-red">
                What We Are All About
              </Text>
              <p>
                Home Windfall Limited, established in April 2025 and based in
                Lagos, Nigeria, is an innovative enterprise that seamlessly
                integrates the excitement of lottery draws with the tangible
                rewards of real estate ownership and other useful prizes. Our
                unique platform offers participants the opportunity to win real
                estate properties and other valuable prizes through our engaging
                raffle draws.
              </p>
              <p>
                Our commitment to transparency and fairness, supported by
                cutting-edge technology, ensures a secure and trustworthy
                environment for our participants.
              </p>
              <p>
                Our incorporation and registration with the Corporate Affairs
                Commission (CAC) under the company registration number 8385235
                further solidifies our legal standing and compliance with
                Nigerian business regulations.
              </p>
            </div>

            {/* Images */}
            <div className="w-[100%] md:w-120 !max-w-[100vw] inline-flex justify-start items-center relative h-[280px]">
              <Image
                src={about4}
                alt="Team celebrating"
                radius="md"
                className="!w-64 !h-64 !max-w-[calc(60vw-40px)] !max-h-[calc(60vw-40px)] !object-cover !shadow-md !rotate-[-8deg] !border-[4px] !border-[#F1F1F1] z-10"
              />
              <Image
                src={about5}
                alt="Couple smiling by car"
                radius="md"
                className="!w-64 !h-64 !max-w-[calc(60vw-40px)] !max-h-[calc(60vw-40px)] !object-cover !shadow-md !rotate-[6deg] !border-[4px] !border-[#F1F1F1] absolute right-0 top-10 z-20"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-primary-red rounded-3xl px-6 md:px-14 py-16 md:mx-20">
          <Container size="lg">
            <Title
              order={2}
              className="!text-center !text-primary-red !font-bold !text-3xl !mb-2"
            >
              Our Values
            </Title>
            <Text className="!text-center !text-gray-600 !text-lg !mb-12">
              What drives us to create life-changing raffle experiences.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((item, idx) => (
                <Paper key={idx} radius="md" className={`p-6 ${item.bg}`}>
                  <Text className="!text-primary-red !font-medium !text-2xl !mb-2">
                    {item.id}
                  </Text>
                  <Text className="!font-normal !text-black !text-2xl !mb-2">
                    {item.title}
                  </Text>
                  <Text className="!text-gray-700 text-base">
                    {item.content}
                  </Text>
                </Paper>
              ))}
            </div>
          </Container>
        </div>

        <div className="bg-[#F7F7F9] rounded-3xl px-6 sm:px-10 md:px-14 py-10 mt-20 border border-[#E7E6EC]">
          <Container size="lg">
            <Title
              order={2}
              className="!text-primary-red !text-3xl !font-bold text-center !mb-25"
            >
              Our Vision and Mission
            </Title>

            {/* Vision Block */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 md:mb-25">
              <div className="md:w-1/2 text-gray-800 space-y-4">
                <Title
                  order={4}
                  className="!text-primary-red !text-2xl !font-bold !mb-8"
                >
                  Our Vision
                </Title>
                <Text className="text-base leading-relaxed">
                  Our vision is to become Nigeria’s most trusted and impactful
                  online raffle platform—empowering lives through innovative,
                  inclusive, and transparent gaming experiences. We aim to lead
                  a revolution in digital engagement by making opportunities to
                  win big both fun and fair for all Nigerians, regardless of
                  background or income. Windfall Raffle strives to be a beacon
                  of possibility, helping people realize their dreams one ticket
                  at a time.
                </Text>
              </div>
              <div className="md:w-1/2">
                <Image
                  src={visionImg}
                  alt="Team working on vision"
                  className="!rounded-2xl !w-full !object-cover"
                />
              </div>
            </div>

            {/* Mission Block */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-5 md:mb-12">
              <div className="md:w-1/2 order-2 md:order-1">
                <Image
                  src={missionImg}
                  alt="Gift voucher surprise"
                  className="!rounded-2xl !w-full !object-cover"
                />
              </div>
              <div className="md:w-1/2 order-1 md:order-2 text-gray-800 space-y-4">
                <Title
                  order={4}
                  className="!text-primary-red !text-2xl !font-bold !mb-8"
                >
                  Our Mission
                </Title>
                <Text className="text-base leading-relaxed">
                  Our mission is to revolutionise the real estate landscape by
                  providing an innovative and accessible pathway to
                  homeownership through our unique lottery platform. We are
                  driven by a deep-seated desire to empower young and
                  medium-income earners, making their housing aspirations more
                  attainable. By offering participants the chance to win a home
                  at an affordable ticket price, we aim to transform lives and
                  foster a vibrant community of hopeful participants.
                </Text>
              </div>
            </div>
          </Container>
        </div>

        <div className="bg-[#AA1F21] rounded-[20px] px-6 py-16 md:px-20 md:py-10 mt-20">
          <Container size="lg" className="text-center text-white">
            <Title order={2} className="!text-white !text-3xl !font-bold !mb-2">
              Meet our team
            </Title>
            <Text className="text-white/80 text-lg !mb-10">
              The Faces Behind Windfall
            </Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    bg={member.bg}
                    className="!w-24 !h-24 !object-cover !rounded-full !border-4 !border-white !mb-4"
                  />
                  <Text className="!font-medium !text-lg">{member.name}</Text>
                  <Text className="!text-sm">{member.role}</Text>
                </div>
              ))}
            </div>
          </Container>
        </div>

        <div className="mt-20">
          <div className="p-8 md:px-20 text-center border border-[#E7E6EC] rounded-3xl">
            <Title
              order={2}
              className="!text-primary-red !font-bold !text-2xl md:!text-3xl !mb-3"
            >
              Our Commitment
            </Title>
            <Text className="!text-gray-500 !text-base md:!text-lg !mb-6">
              At Windfall, Your Trust is Our Winning Ticket
            </Text>
            <Text className="!text-gray-900 !text-base md:!text-lg !leading-relaxed">
              At Windfall Raffle, we are committed to delivering an experience
              that’s fair, secure, and truly rewarding. Every raffle is backed
              by transparency, from verified winners to secure transactions. We
              prioritize your trust, ensuring that every draw is legitimate and
              every interaction is handled with integrity. Your excitement and
              confidence are at the heart of everything we do.
            </Text>
          </div>
        </div>

        <div className="mt-20 mb-10">
          <RaffleHelpSection />
        </div>
      </div>
    </div>
  );
}
