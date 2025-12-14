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
import { notifications } from "@mantine/notifications";
import { useFetchData, usePostData } from "../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import SEO from "../components/SEO";

const inputStyles = {
  input: {
    color: "#000",
  },
  dropdown: { color: "#000" },
};

export default function ContactUs() {
  const {
    data: response,
    isError,
    error,
  } = useFetchData(`guest/dropdown/issue-type`);
  const contactUsMutation = usePostData(`guest/contact-us-by-guest`);

  const form = useForm({
    initialValues: {
      fullname: "",
      phone: "",
      email: "",
      issue_type: "",
      customer_complaint: "",
    },

    validate: {
      fullname: (val) =>
        val.trim().split(" ").length >= 2
          ? null
          : "Enter both firstname and lastname",
      email: (val) => {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
      issue_type: (val) => (val ? null : "Enter a subject"),
      customer_complaint: (val) => (val ? null : "Enter your message"),
    },
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Issue Types",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [error, isError]);

  const issueTypes: string[] = response?.data
    ? [
        {
          value: "",
          label: "Select an issue type",
        },
        ...response.data,
      ]
    : [];

  const contactUs = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = form.values;

    try {
      const response = await contactUsMutation.mutateAsync(payload);
      notifications.show({
        title: "Message submission Successful",
        message: response?.message || "Your Message Has Been Sent Successfully",
        color: "green",
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Message submission Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  return (
    <div className="bg-white">
      <SEO 
        title="Contact Us"
        description="Get in touch with WindFall Raffle. Contact our support team for help with your account, prizes, or any questions you may have."
        url="https://homewindfall.com/contact-us"
        keywords="contact WindFall, customer support, help, support team"
      />
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
                    href="tel:+2349039537488"
                    className="!text-primary-red !font-medium hover:underline"
                  >
                    +234 903 953 7488
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
                    href="mailto:contact@homewindfall.com"
                    className="!text-primary-red !font-medium hover:underline"
                  >
                    contact@homewindfall.com
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

              <form className="space-y-4" onSubmit={form.onSubmit(contactUs)}>
                <TextInput
                  label="Your Full Name"
                  placeholder="Adekunle, Ibrahim Olamide"
                  required
                  {...form.getInputProps("fullname")}
                />
                <TextInput
                  label="Phone Number"
                  type="tel"
                  placeholder="081XXXXXXXX"
                  {...form.getInputProps("phone")}
                />
                <TextInput
                  label="Email address"
                  placeholder="you@example.com"
                  required
                  {...form.getInputProps("email")}
                />
                <Select
                  label="Subject"
                  placeholder="Add a subject"
                  data={issueTypes}
                  required
                  {...form.getInputProps("issue_type")}
                  styles={inputStyles}
                />
                <Textarea
                  label="Message"
                  placeholder="Type your message here..."
                  required
                  className="!mb-5"
                  {...form.getInputProps("customer_complaint")}
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
                <MainButton
                  disabled={contactUsMutation.isPending}
                  loading={contactUsMutation.isPending}
                  size="lg"
                  buttonType="submit"
                >
                  <span className="!text-base">Send Message</span>
                </MainButton>
              </form>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
