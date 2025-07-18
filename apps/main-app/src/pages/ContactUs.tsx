import {
  Card,
  Grid,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPhone, IconMail } from "@tabler/icons-react";
import SectionBanner from "../components/SectionBanner"; // adjust path as needed
import MainButton from "../components/Buttons/MainButton";

export default function ContactUs() {
  return (
    <div className="bg-white">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title
            order={2}
            className="!font-bold !text-primary-red !text-3xl !flex !items-center !gap-2"
          >
            Contact us 🚀
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[40vw]">
            Need help with your account, a raffle, or claiming a prize? We are
            here to assist you
          </Text>
        </Group>
      </SectionBanner>

      <div className="sm:mx-5 px-6 md:px-16 py-12">
        <Grid gutter="xl" justify="center">
          {/* Left Support Info */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text className="!font-medium !text-xl !text-gray-800 !mb-4">
              We have an efficient team to answer all your questions
            </Text>
            <Card
              withBorder
              className="!border-dashed !border-gray-300 !px-5 !py-6"
            >
              <Group align="flex-start">
                <div className="p-2 rounded-full bg-[#ffd5d6] text-primary-red">
                  <IconPhone size={20} />
                </div>
                <div>
                  <Text className="!font-medium">Phone support</Text>
                  <a
                    href="tel:+2348007543675"
                    className="!text-primary-red !font-medium hover:underline"
                  >
                    +234 800 7543 675
                  </a>
                  <Text className="!text-base !font-medium !text-[#575757]">
                    Mon-Fri, 9am-5pm WAT
                  </Text>
                  <Text className="!text-sm text-gray-500 !text-wrap">
                    For urgent concerns or follow-up calls
                  </Text>
                </div>
              </Group>

              <div className="h-6" />

              <Group align="flex-start">
                <div className="p-2 rounded-full bg-[#ffd5d6] text-primary-red">
                  <IconMail size={20} />
                </div>
                <div>
                  <Text className="!font-medium">Email support</Text>
                  <a
                    href="mailto:Support@windfal.ng"
                    className="!text-primary-red !font-medium hover:underline"
                  >
                    Support@windfall.ng
                  </a>
                  <Text className="!text-base !font-medium !text-[#575757]">
                    Response time: 24–48 business hours
                  </Text>
                  <Text className="!text-sm !text-gray-500 !text-wrap">
                    For general inquiries and claims
                  </Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>

          {/* Right Contact Form */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              withBorder
              className="!bg-red-50 !border-dashed !border-red-300 !px-6 !py-10"
            >
              <Title
                order={4}
                className="!text-primary-red !mb-5 !font-medium !text-xl"
              >
                Send us a message
              </Title>

              <div className="space-y-4">
                <TextInput
                  label="Your Full Name"
                  placeholder="Adekunle, Ibrahim Olamide"
                  required
                />
                <TextInput
                  label="Email address"
                  placeholder="you@example.com"
                  required
                />
                <Select
                  label="Subject"
                  placeholder="General inquiry"
                  data={["General inquiry", "Prize claim", "Technical issue"]}
                  required
                />
                <TextInput
                  label="Raffle reference code"
                  placeholder="e.g. WIN12345678"
                />
                <Textarea
                  label="Message"
                  placeholder="Type your message here..."
                  required
                  className="!mb-5"
                  styles={{
                    input: {
                      height: "8rem",
                    },
                  }}
                />
                <Text size="xs" className="!text-primary-red !mb-7">
                  Tip: Include your winning ticket number or draw date for
                  prize-related inquiries.
                </Text>
                <MainButton size="lg">
                  <span className="!text-base">Send Message</span>
                </MainButton>
              </div>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
