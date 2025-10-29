// components/Footer.tsx
import { Button, createTheme, MantineProvider, TextInput } from "@mantine/core";
import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import google from "../assets/google-play.png";
import apple from "../assets/apple-store.png";
import over18 from "../assets/over-18.png";
import { NavLink } from "react-router-dom";
import { usePostData } from "../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

export default function Footer() {
  const subscribeMutation = usePostData(`guest/subscribe`);

  const form = useForm({
    initialValues: {
      email: ""
    },

    validate: {
      email: (val) => {
        if (!val) return "Please enter your email"
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
    },
  });

  const subscribe = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      email: form.values.email,
    };

    try {
      const response = await subscribeMutation.mutateAsync(payload);
      notifications.show({
        title: "Email Subscription Successful",
        message: response?.message || "Thank You For Subscribing",
        color: "green",
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Email Subscription Failed",
        message: (error as { message?: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const theme = createTheme({
    components: {
      TextInput: TextInput.extend({
        classNames: {
          input:
            "!bg-[#1f1f1f] !text-[#cdcdcd] text-[14px] !h-[48px] placeholder:text-[14px] placeholder:text-[#cdcdcd] focus:ring-0 !border-none focus:border-green-500 !rounded-r-none",
        },
      }),
      Button: Button.extend({
        classNames: {
          root: "!h-[48px] !rounded-none !rounded-r cursor-pointer",
        },
      }),
    },
  });

  return (
    <footer className="bg-[#010101] text-[#cdcdcd] px-6 md:px-16 py-10 text-sm">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Section */}
        <div>
          <div className="inline-block text-3xl leading-4 font-bold">
            <span className="text-white">Windfall</span>
            <span className="text-red-500">Raffle</span>
            <p className="text-xs text-white text-right">
              Live in - Rent out - Sell up
            </p>
          </div>
          <p className="text-xs mt-2 mb-6">
            At Home Windfall Limited we make you step into a world where luck
            meets lifestyle, where our raffles open doors to new homes and
            exciting prizes. We are committed to providing a seamless and
            engaging platform that connects dreams with reality.
          </p>

          <div className="flex gap-4 mb-6">
            <IconBrandFacebookFilled size={20} />
            <IconBrandInstagramFilled size={20} />
            <IconBrandYoutubeFilled size={20} />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <img src={over18} alt="18+" className="w-9 h-9" />
            <span>
              Players must be 18 or over and physically
              <br />
              located in Lagos, Nigeria
            </span>
          </div>

          <p className="mb-3">
            Download to get automatic notification when you win.
          </p>
          <div className="flex gap-3">
            <img src={google} alt="Google Play" className="h-10" />
            <img src={apple} alt="App Store" className="h-10" />
          </div>
        </div>

        {/* Right Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-3">
            <p className="font-semibold text-white">
              Subscribe to Our Newsletter
            </p>
            <p className="text-sm mb-3">
              Get update about our raffle draws on your email.
            </p>
            <div className="flex items-center w-full max-w-md">
              <MantineProvider theme={theme}>
                <form className="flex w-full max-w-md" onSubmit={form.onSubmit(subscribe)}>
                  <TextInput
                    className="!rounded-r-none flex-grow-1"
                    radius="md"
                    size="md"
                    type="email"
                    placeholder="sample@email.com"
                    {...form.getInputProps("email")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        subscribe();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    loading={subscribeMutation.isPending}
                    className="!rounded-l-none bg-primary-red hover:bg-primary-red text-white h-[48px] px-5"
                  >
                    Subscribe
                  </Button>
                </form>
              </MantineProvider>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white mb-2">Quick Links</p>
            <ul className="space-y-2">
              <li>
                <NavLink to={"/about"}>About Us</NavLink>
              </li>
              <li>
                <NavLink to={"/faq"}>FAQs</NavLink>
              </li>
              <li>
                <NavLink to={"/login"}>Login</NavLink>
              </li>
              <li>
                <NavLink to={"/register"}>Register</NavLink>
              </li>
              <li>
                <NavLink to={"/winners/all-time"}>Our Winner</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Resources</p>
            <ul className="space-y-2">
              <li>
                <NavLink to={"/game-rules"}>How to play</NavLink>
              </li>
              <li>
                <NavLink to={"/claim-prices"}>Claim prizes</NavLink>
              </li>
              <li>
                <NavLink to={"/contact-us"}>Contact Us</NavLink>
              </li>
              <li>Blog</li>
              <li>
                <NavLink to={"/responsible-playing"}>
                  Responsible Playing
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Legal</p>
            <ul className="space-y-2">
              <li>
                <NavLink to={"/game-rules"}>Games Rules</NavLink>
              </li>
              <li>
                <NavLink to={"/terms-and-conditions"}>
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink to={"/privacy-policy"}>Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to={"/terms-of-use"}>Terms of Use</NavLink>
              </li>
              <li>
                <NavLink to={"/cookie-policy"}>Cookies Policy</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <hr className="my-6 border-[#444]" />

      <div className="grid md:grid-cols-2 gap-10">
        <div className="text-xs text-center md:text-left space-y-2">
          <p>
            For compliance and responsible gaming, ensure your raffle adheres to
            all regulatory guidelines.
          </p>
          <p>
            Lagos State Lotteries & Gaming Authority (LSLGA) -{" "}
            <a
              href="https://www.lslb.lg.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500"
            >
              www.lslb.lg.gov.ng
            </a>
          </p>
          <p>
            Federal Competition & Consumer Protection Commission (FCCPC) -{" "}
            <a
              href="https://www.fccpc.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500"
            >
              www.fccpc.gov.ng
            </a>
          </p>
        </div>
        <p className="text-gray-500 pt-4 text-center md:text-right">
          © 2025 Windfall Raffle™ by Home Windfall Limited | All Rights
          Reserved
        </p>
      </div>
    </footer>
  );
}
