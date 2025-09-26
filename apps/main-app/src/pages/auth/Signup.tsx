import {
  Text,
  Container,
  Card,
  TextInput,
  Stack,
  Select,
  Checkbox,
  Flex,
  Button,
  PasswordInput,
  Loader,
  Alert,
} from "@mantine/core";
import { CiCalendar } from "react-icons/ci";
import { DateInput } from "@mantine/dates";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { useFetchData, usePostData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import "@mantine/dates/styles.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import OtpModal from "../Profile/settings/AccountSecurity/OtpModal";
import AlertModal from "../../components/Modals/AlertModal";
import { IconCheck } from "@tabler/icons-react";
import { useSessionStorage } from "../../utils/hooks/useStorage";
import maskEmail from "../../utils/helper/MaskEmail";
import type { UserCart } from "../checkout/Cart";

const otpTime = 300; // 5 minutes in seconds

export interface NewUser {
  uuid: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  firstname: string;
  lastname: string;
  referrer_id: string;
  confirm_resident: string;
  platform: string;
  merchant: string;
  merchant_id: string;
  uniqueID: string;
  referral_code: string;
  updated_at: string;
  created_at: string;
  last_login: string;
  login_count: number;
  referral_link: string;
}

function Signup({ cart = null, returnUrl }: {cart?: UserCart | null, returnUrl?: string}) {
  const [timeLeft, setTimeLeft] = useState(otpTime); // 15 minutes
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [emailVerifed, setEmailVerifed] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const { updateUser } = useSessionStorage();
  const navigate = useNavigate();
  const location = useLocation();

  const registerMutation = usePostData("customer/auth/signup_only");
  const sendOtpMutation = usePostData("customer/auth/send-otp-email");
  const confirmOtpMutation = usePostData("customer/auth/confirm-otp-email");
  const loginMutation = usePostData("customer/auth/login");

  async function verifyEmail() {
    setMaskedEmail(maskEmail(form.values.email));
    const payload = {
      email: form.values.email,
    };
    try {
      await sendOtpMutation.mutateAsync(payload);
      setTimeLeft(otpTime);
      setOtpModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Email Verification Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  async function otpEntered(otp: string) {
    const payload = {
      email: form.values.email,
      otp,
    };
    try {
      await confirmOtpMutation.mutateAsync(payload);
      setEmailVerifed(true);
      setOtpModalOpen(false);
      form.clearFieldError("email");
    } catch (error) {
      notifications.show({
        title: "OTP Verification Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  function closeSuccessModal() {
    setSuccessModalOpen(false);
    navigate(returnUrl ? returnUrl: "/dashboard");
  }

  async function login() {
    const payload = {
      username: form.values.email,
      remember_me: true,
      password: form.values.password,
    };

    try {
      const response = await loginMutation.mutateAsync(payload);
      updateUser(response?.data);
      notifications.show({
        title: "Login Successful",
        message: response?.message || "You are now logged in",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  }

  const {
    data: lgaData,
    isError: isLgaError,
    error: lgaError,
    isLoading: isPendingLga,
  } = useFetchData("guest/dropdown/lagos-lgas");

  if (isLgaError) {
    notifications.show({
      title: "Failed to load l.g.a",
      message:
        (lgaError as { message: string })?.message || "An error occurred",
      color: "var(--color-primary-red)",
    });
  }

  const isLoading = () => isPendingLga || registerMutation.isPending;

  // ✅ Map LGAs for select
  const lgas = (() => {
    if (!lgaData || !lgaData.data) return [];
    return lgaData.data.map((item: { lga: string }) => ({
      value: item.lga.toString(),
      label: item.lga,
    }));
  })();

  // ✅ Calculate max date (18 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  // ✅ Mantine form setup
  const form = useForm({
    initialValues: {
      fullName: "",
      dateOfBirth: maxDate,
      email: "",
      phone_number: "",
      lga: "",
      referral_code: "",
      heard_from: "",
      password: "",
      password_confirmation: "",
      opt_in_exclusive_offer: true,
      privacyAccepted: false,
      ageConfirmed: false,
    },

    validate: {
      fullName: (val) =>
        val.trim().split(" ").length >= 2
          ? null
          : "Enter both firstname and lastname",
      email: (val) => {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        if (!emailVerifed) {
          return "Please verify your email before continuing";
        }
        return null;
      },
      phone_number: (val) =>
        val.length >= 10 ? null : "Enter a valid phone number",
      lga: (val) => (val ? null : "Select an LGA"),
      heard_from: (val) => (val ? null : "This field is required"),
      password: (value) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
          return "Use both uppercase and lowercase letters";
        }
        if (!/[0-9]/.test(value)) {
          return "Include at least one number";
        }
        if (!/[!@#$%^&*]/.test(value)) {
          return "Include at least one special character (!@#$%^&*)";
        }
        return null;
      },
      password_confirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      dateOfBirth: (val) => (val ? null : "Please select your date of birth"),
      privacyAccepted: (val) =>
        val ? null : "You must agree to the Privacy Policy",
      ageConfirmed: (val) =>
        val ? null : "You must confirm you are at least 18 years old",
    },
  });

  const emailValid = () => {
    const email = form.values.email;
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  // reset emailVerified whenever email changes
  useEffect(() => {
    setEmailVerifed(false);
  }, [form.values.email]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref_code");
    if (refCode) {
      form.setFieldValue("referral_code", refCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (values: typeof form.values) => {
    if (form.validate().hasErrors) {
      return;
    }

    const [firstname, ...rest] = values.fullName.trim().split(" ");
    const lastname = rest.join(" ");

    const payload = {
      firstname,
      lastname,
      email: values.email,
      phone_number: values.phone_number,
      password: values.password,
      password_confirmation: values.password_confirmation,
      lga: values.lga,
      opt_in_exclusive_offer: values.opt_in_exclusive_offer,
      date_of_birth: values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString().split("T")[0]
        : "",
      heard_from: values.heard_from,
      fcm_token: "",
      referral_code: values.referral_code,
      platform: "web",
      merchant_id: "",
    };

    // API mutation

    try {
      const response = await registerMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Creation Successful",
        message: response?.message || "Account created successfully",
        color: "green",
      });
      login();
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Account Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  return (
    <div className="text-primary-text mt-16 mb-32">
      <Container px={0} size={560} className="!mx-3 sm:!mx-auto">
        {cart && (
          <>
            <Text className="!text-2xl !font-semibold">
              Checkout{" "}
              <span className="text-primary-red">
                ({cart?.cart.summary.total_quantity})
              </span>
            </Text>
            <Text className="!text-secondary-text">
              Buy Raffle ticket in very simple step and stand a chance to win
              big!!!
            </Text>
            <Card
              my="lg"
              withBorder
              className="!border !border-primary-red !bg-secondary-red !py-5"
            >
              <div className="flex gap-3 items-center">
                <FaUser
                  size={32}
                  className="text-primary-red text-2xl p-1 rounded-full bg-secondary-red/70"
                />
                <Text className="!text-secondary-text !tracking-wide">
                  No Account Detected. Do you have Windfall Account ?{" "}
                  <NavLink to="/login">
                    <span className="text-primary-red underline font-bold">Log in</span>
                  </NavLink>
                </Text>
              </div>
            </Card>
          </>
        )}
        {!cart && (
          <div className="mb-5">
            <Text className="!text-2xl !font-semibold">
              <span className="text-primary-red">Sign Up</span>
            </Text>
            <Text className="!text-secondary-text">Sign Up in easy steps</Text>
          </div>
        )}

        <Card withBorder>
          <Card.Section mx="xs" my="xs">
            <Text className="!text-primary-text !font-semibold !text-xl">
              Sign up to WindFall
            </Text>
            <Text className="!text-secondary-text">
              Sign Up now in easy steps
            </Text>
          </Card.Section>

          <Card.Section mx="xs" my="xs" className="!text-primary-text">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              {registerMutation.isError && (
                <Alert
                  color="var(--color-primary-red)"
                  title="Login Failed"
                  className="!mb-5"
                >
                  <Text>{registerMutation.error.message}</Text>
                </Alert>
              )}
              <Stack gap="xl">
                <TextInput
                  label="Your Full Name"
                  placeholder="Enter Your Full Name"
                  withAsterisk
                  {...form.getInputProps("fullName")}
                  classNames={{ label: "!capitalize " }}
                />
                <DateInput
                  label="Date of Birth"
                  placeholder="Enter date of birth"
                  withAsterisk
                  rightSection={<CiCalendar />}
                  valueFormat="DD/MM/YYYY"
                  maxDate={maxDate}
                  {...form.getInputProps("dateOfBirth")}
                  classNames={{
                    label: "!capitalize",
                  }}
                  popoverProps={{
                    classNames: {
                      dropdown: "!text-primary-text",
                    },
                  }}
                />
                <div>
                  <TextInput
                    label="Your Email Address"
                    placeholder="Enter Your Email Address"
                    withAsterisk
                    {...form.getInputProps("email")}
                    classNames={{ label: "!capitalize " }}
                    rightSection={emailVerifed && <IconCheck color="#34b233" />}
                  />
                  <Flex justify="flex-end" mt={5}>
                    {!emailVerifed && emailValid() && (
                      <>
                        {!sendOtpMutation.isPending && (
                          <a
                            onClick={verifyEmail}
                            className="!text-primary-red cursor-pointer !underline !text-sm font-medium"
                          >
                            Verify to Continue
                          </a>
                        )}
                        {sendOtpMutation.isPending && (
                          <Loader size="sm" color="var(--color-primary-red)" />
                        )}
                      </>
                    )}
                    {emailVerifed && (
                      <p className="text-[#34b233]">Email Verified</p>
                    )}
                  </Flex>
                </div>
                <TextInput
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  withAsterisk
                  {...form.getInputProps("phone_number")}
                  classNames={{ label: "!capitalize " }}
                />
                <Select
                  data={["Nigeria"]}
                  value="Nigeria"
                  readOnly
                  label="Country"
                  withAsterisk
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
                <Select
                  data={["Lagos"]}
                  value="Lagos"
                  readOnly
                  label="State"
                  withAsterisk
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                />
                <Select
                  data={lgas}
                  label="L.G.A"
                  placeholder="Select LGA"
                  withAsterisk
                  searchable
                  rightSection={<FaAngleDown />}
                  classNames={{
                    label: "!capitalize ",
                    options: "text-primary-text",
                  }}
                  {...form.getInputProps("lga")}
                />
                <TextInput
                  label="Referral Code (Optional)"
                  placeholder="Enter referral code"
                  {...form.getInputProps("referral_code")}
                  classNames={{ label: "!capitalize " }}
                />
                <TextInput
                  label="How did you hear about us"
                  withAsterisk
                  {...form.getInputProps("heard_from")}
                  classNames={{ label: "!capitalize " }}
                />
                <PasswordInput
                  label="Create Password"
                  type="password"
                  withAsterisk
                  {...form.getInputProps("password")}
                  classNames={{ label: "!capitalize " }}
                />
                <PasswordInput
                  label="Confirm Password"
                  type="password"
                  withAsterisk
                  {...form.getInputProps("password_confirmation")}
                  classNames={{ label: "!capitalize " }}
                />
                <Stack gap="sm">
                  <Checkbox
                    label="I want to receive exclusive offers, raffles update and promo alerts via email."
                    {...form.getInputProps("opt_in_exclusive_offer", {
                      type: "checkbox",
                    })}
                  />
                  <Checkbox
                    label="I have read and agree to the Privacy Policy, Terms and Game Rules"
                    {...form.getInputProps("privacyAccepted", {
                      type: "checkbox",
                    })}
                  />
                  <Checkbox
                    label="By creating your account, you confirm you are at least 18 years old and accept Windfall Raffle's policies."
                    {...form.getInputProps("ageConfirmed", {
                      type: "checkbox",
                    })}
                  />
                </Stack>
              </Stack>
              <Flex justify="flex-end" my="lg">
                <Button
                  type="submit"
                  disabled={isLoading()}
                  loading={isLoading()}
                  className="disabled:!bg-primary-red/40 !text-white !border !border-dashed !border-secondary-red !h-12 !tracking-wide md:!w-32"
                >
                  Sign Up
                </Button>
              </Flex>
            </form>
          </Card.Section>
        </Card>
      </Container>
      <OtpModal
        opened={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onValidate={otpEntered}
        timeLeft={timeLeft}
        validatingOtp={
          sendOtpMutation.isPending || confirmOtpMutation.isPending
        }
        resendOtp={verifyEmail}
        setTimeLeft={setTimeLeft}
        title="Account Opening Validation"
        description="Enter OTP to Create your account"
        emailMasked={maskedEmail}
      />
      <AlertModal
        opened={successModalOpen}
        status="success"
        title="Account Opening Successful "
        description="Congratulation, you have successfully created an account on WindFall raffle. Now start playing"
        primaryButton={{
          label: "Continue",
          onClick: closeSuccessModal,
        }}
      />
    </div>
  );
}

export default Signup;
