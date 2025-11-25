import {
  Card,
  Text,
  Stack,
  Flex,
  Image,
  Button,
  Divider,
  TextInput,
  Container,
  Alert,
} from "@mantine/core";
import CheckoutItem from "./CheckoutItem";
import AlertModal from "../../components/Modals/AlertModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CustomButton from "../../components/Buttons/CustomButton";
import { useCart } from "../../utils/hooks/useCart";
import { useFetchData, usePostData } from "../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import LoadingState from "../../components/LoadingState";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/hooks/useStorage";
import EmptyCart from "./EmptyCart";
import type { Item } from "./Cart";

export interface CheckoutSummary {
  items: CheckoutSummaryItem[];
  total_ticket_count: number;
  total_amount: string;
  discount_amount: string;
  promo_amount: string;
  promo_code: string;
  promo_code_id: string;
  referral_amount_used: string;
  current_referral_balance: string;
  net_referral_amount_balance: string;
  amount_to_pay: string;
  spend_limit_amount: string;
  spend_limit_remaining: string;
}

export interface PaymentMethods {
  logo: string;
  name: string;
  payment_channels: string;
  slug: string;
  channels: PaymentChannel[];
}

export interface PaymentChannel {
  name: string;
  slug: string;
}

export interface CheckoutSummaryItem {
  game_id: string;
  quantity: number;
  unit_price: string;
  discount_amount: number;
  promo_amount: number;
  net_amount: number;
}

export interface CheckoutResponse {
  error: boolean;
  message: string;
  data: Checkout;
}

export interface Checkout {
  order_id: string;
  quantity: number;
  amount_to_pay: string;
  reference: string;
  access_code: string;
  authorization_url: string;
  payment_channel: string;
  success_redirect: string;
  failure_redirect: string;
  callback: string;
}

export interface PaymentConfiguration {
  registration_configuration: RegistrationConfiguration;
  game_configuration: GameConfiguration;
}

export interface RegistrationConfiguration {
  use_lga: boolean;
  use_lga_area: boolean;
  verify_email_otp: boolean;
}

export interface GameConfiguration {
  use_promo_code: boolean;
  use_referral_amount: boolean;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [summary, setSummary] = useState<CheckoutSummary>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethods>();
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [referralAmount, setReferralAmount] = useState<number | string>("");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfiguration>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const { cart, cartLoading, cartError, isCartError } = useCart();
  const [buyNowItem, setBuyNowItem] = useState<Item>();
  const [user] = useAtom(userAtom);

  // Add ref for payment methods section
  const paymentMethodsRef = useRef<HTMLDivElement>(null);

  const getSummaryMutation = usePostData(`customer/games/checkout/summary`);
  const checkoutMutation = usePostData(`customer/games/checkout`);
  const {
    data: paymentMethodsResponse,
    isLoading: paymentMethodsLoading,
    isError: isPaymentMethodsError,
    error: paymentMethodsError,
  } = useFetchData(`guest/dropdown/payment-methods`);
  const {
    data: confgResponse,
    isError: isConfigError,
    error: configError,
  } = useFetchData(`guest/dropdown/get-all-configurations`);

  useEffect(() => {
    if (getSummaryMutation.isError)
      return setErrorMsg(getSummaryMutation.error.message);
    if (checkoutMutation.isError)
      return setErrorMsg(checkoutMutation.error.message);
    else setErrorMsg(undefined);
  }, [getSummaryMutation, checkoutMutation]);

  useEffect(() => {
    if (data?.buy_now) setBuyNowItem(data?.buy_now);
    else setBuyNowItem(undefined);
  }, [data]);

  useEffect(() => {
    setIsValidated(false);
  }, [referralAmount, promoCode]);

  useEffect(() => {
    if (isCartError) {
      notifications.show({
        title: "Failed to fetch Cart",
        message:
          (cartError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }, [cartError, isCartError]);

  useEffect(() => {
    setSelectedPaymentChannel("");
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (isPaymentMethodsError) {
      notifications.show({
        title: "Failed to fetch payment response",
        message:
          (paymentMethodsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
    if (paymentMethodsResponse) {
      setPaymentMethods(paymentMethodsResponse.data);
    }
  }, [paymentMethodsError, isPaymentMethodsError, paymentMethodsResponse]);

  useEffect(() => {
    if (isConfigError) {
      notifications.show({
        title: "Failed to fetch payment configurations",
        message:
          (configError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (confgResponse) {
      setPaymentConfig(confgResponse.data);
    }
  }, [configError, isConfigError, confgResponse]);

  const handleGetSummary = async () => {
    const payload = {
      type: buyNowItem ? "buy_now" : "cart",
      promo_code: promoCode || "",
      referral_balance_amount: referralAmount || "",
    };

    if (buyNowItem) {
      Object.assign(payload, {
        game_id: buyNowItem.game_id,
        quantity: buyNowItem.quantity,
      });
    }

    try {
      const response = await getSummaryMutation.mutateAsync(payload);
      setSummary(response.data);
      setIsValidated(true);
      setErrorMsg(undefined);
      notifications.show({
        title: "Checkout Summary updated",
        message: response?.message || "Summary fetched successfully",
        color: "green",
      });

      // Scroll to payment methods section with offset for header
      setTimeout(() => {
        if (paymentMethodsRef.current) {
          const elementPosition =
            paymentMethodsRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 200;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 500);
    } catch (error) {
      notifications.show({
        title: "Failed to fetch summary",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const checkout = async () => {
    // Get the current location/origin and append the /payment-receipt route
    const redirect_url = `${window.location.origin}/payment-receipt`;

    const payload = {
      platform: "web",
      payment_method: selectedPaymentMethod?.slug || "",
      payment_channel: selectedPaymentChannel || "",
      referral_balance_amount: referralAmount || "",
      promo_code: promoCode || "",
      redirect_url,
    };

    if (buyNowItem) {
      Object.assign(payload, {
        type: "buy_now",
        game_id: buyNowItem.game_id,
        quantity: buyNowItem.quantity,
      });
    }
    try {
      const response: CheckoutResponse =
        await checkoutMutation.mutateAsync(payload);

      notifications.show({
        title: "Checkout Initiated Successfully",
        message: response?.message || "Checkout initiated successfully",
        color: "green",
      });

      // Navigate user to the payment page
      if (response?.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      notifications.show({
        title: "Failed to initiate checkout",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  const allowPromoCode = () => {
    if (!buyNowItem) return paymentConfig?.game_configuration.use_promo_code;
    return (
      buyNowItem.allow_promo_code_usage === "true" &&
      paymentConfig?.game_configuration.use_promo_code
    );
  };

  const allowReferralBalance = () => {
    if (!buyNowItem)
      return paymentConfig?.game_configuration.use_referral_amount;
    return (
      buyNowItem.allow_referral_balance_usage === "true" &&
      paymentConfig?.game_configuration.use_referral_amount
    );
  };

  const paymentChanels = selectedPaymentMethod?.channels;
  const totalPrice = isValidated
    ? summary?.amount_to_pay
    : buyNowItem
      ? buyNowItem.total_price
      : cart?.cart.summary.total_discounted_amount;
  const totalNoOfTickets = isValidated
    ? summary?.total_ticket_count
    : buyNowItem
      ? buyNowItem.quantity
      : cart?.cart.summary.total_quantity;

  return (
    <div className="text-primary-text mt-16 mb-32 ">
      <Container size="lg" className="!mx-3 sm:!mx-auto">
        <Text className="!text-2xl !font-semibold">
          Checkout{" "}
          <span className="text-primary-red">({totalNoOfTickets || 0})</span>
        </Text>
        <Text className="!text-secondary-text !mb-5">
          Buy Raffle ticket in very simple steps and stand a chance to win
          big!!!
        </Text>

        {cartLoading && (
          <LoadingState description="Getting your checkout items" />
        )}

        {!cartLoading && (
          <>
            {!cart?.cart.summary.total_quantity && !buyNowItem && <EmptyCart />}
            {(cart?.cart.summary.total_quantity || buyNowItem) && (
              <div className="grid grid-flow-row lg:grid-cols-5 gap-7">
                <div className="!col-span-5 md:!col-span-3">
                  <Card
                    withBorder
                    className="!space-y-10 !rounded-t-xl !rounded-b-none h-fit"
                  >
                    <header>
                      <Text className=" !font-semibold !text-lg !tracking-wide">
                        <span className="text-primary-red">Review:</span> Raffle
                        Ticket Order WindFall
                      </Text>
                      <Text className="!text-secondary-text !tracking-wide">
                        List of raffle ticket(s) you intend to purchase
                      </Text>
                    </header>
                    <section className="space-y-5">
                      {!cart?.cart.items?.length && !buyNowItem && (
                        <Text className="!text-secondary-text !mb-10 !text-center !tracking-wide">
                          No items found
                        </Text>
                      )}
                      {buyNowItem && (
                        <CheckoutItem key={buyNowItem.uuid} item={buyNowItem} />
                      )}
                      {!buyNowItem &&
                        cart?.cart.items.map((item) => (
                          <CheckoutItem key={item.uuid} item={item} />
                        ))}
                    </section>
                  </Card>
                  <Card
                    withBorder
                    className=" !rounded-b-xl !rounded-t-none"
                    py="xl"
                  >
                    {errorMsg && (
                      <Alert
                        color="var(--color-primary-red)"
                        title="Checkout Failed"
                        className="!mb-5"
                      >
                        <Text>{errorMsg}</Text>
                      </Alert>
                    )}
                    <div className="!bg-secondary-red !border-primary-red py-3 border px-3 rounded-md">
                      <Text className="!text-primary-red !text-xl !font-medium">
                        Checkout Summary
                      </Text>
                    </div>

                    <Stack mx="md" my="lg" gap="xl">
                      <Flex justify="space-between" gap={10} align="center">
                        <Text className="!text-secondary-text !text-lg !capitalize">
                          Total number of tickets
                        </Text>
                        <Text className="!font-bold !text-lg">
                          {totalNoOfTickets} Tickets
                        </Text>
                      </Flex>
                      <Flex justify="space-between" gap={10} align="center">
                        <Text className="!text-secondary-text !text-lg !capitalize">
                          total price of tickets
                        </Text>
                        <Text className="!font-bold !text-lg">
                          {formatCurrency(totalPrice)}
                        </Text>
                      </Flex>
                      {allowPromoCode() && (
                        <Flex justify="space-between" gap={10} align="center">
                          <Text className="!text-secondary-text !text-lg !capitalize">
                            promo code
                          </Text>
                          <TextInput
                            placeholder="Enter promo-code"
                            description="Enter a promo-code to discount total cost of purchase"
                            inputWrapperOrder={[
                              "label",
                              "input",
                              "error",
                              "description",
                            ]}
                            value={promoCode}
                            onChange={(e) =>
                              setPromoCode(e.currentTarget.value)
                            }
                          />
                        </Flex>
                      )}
                      {allowReferralBalance() && (
                        <Flex justify="space-between" gap={10} align="center">
                          <div>
                            <Text className="!text-secondary-text !text-lg !capitalize">
                              Referral balance
                            </Text>
                            <Text className="!font-semibold !text-lg">
                              {formatCurrency(user?.referral_balance)}
                            </Text>
                          </div>
                          <TextInput
                            placeholder="N 0"
                            type="number"
                            max={user?.referral_balance}
                            description="Enter value to pay with"
                            inputWrapperOrder={[
                              "label",
                              "input",
                              "error",
                              "description",
                            ]}
                            value={referralAmount}
                            onChange={(e) => {
                              const val = e.currentTarget.value;
                              setReferralAmount(
                                Number(val) >
                                  (Number(user?.referral_balance) || 0)
                                  ? Number(user?.referral_balance) || 0
                                  : val
                              );
                            }}
                          />
                        </Flex>
                      )}
                    </Stack>
                    <Divider my="xl" />
                    <Flex justify="space-between" gap={10} align="center">
                      <Text className="!text-secondary-text !text-lg">
                        {isValidated
                          ? "Amount to Pay"
                          : "Total Prices of Ticket"}
                        :
                      </Text>
                      <Text className="!font-bold !text-primary-red !text-3xl">
                        {formatCurrency(totalPrice)}
                      </Text>
                    </Flex>

                    {!isValidated && (
                      <>
                        <Divider my="xl" />
                        <CustomButton
                          fullWidth
                          onClick={handleGetSummary}
                          disabled={getSummaryMutation.isPending}
                          loading={getSummaryMutation.isPending}
                        >
                          Proceed
                        </CustomButton>
                      </>
                    )}
                  </Card>
                </div>

                {/* Payment Methods */}
                {isValidated && (
                  <Card
                    ref={paymentMethodsRef}
                    withBorder
                    className="!rounded-xl h-fit !col-span-5 md:!col-span-2 !space-y-10 !px-5"
                  >
                    <header>
                      <Text className=" !font-semibold !text-lg !tracking-wide">
                        Pay Via
                      </Text>
                      <Text className="!text-secondary-text !tracking-wide">
                        Select your preferred payment provider
                      </Text>
                    </header>
                    {paymentMethodsLoading && (
                      <LoadingState description="Fetching payment methods." />
                    )}
                    {!paymentMethodsLoading && (
                      <>
                        <section className="space-y-5 mb-10">
                          {!paymentMethods?.length && (
                            <Text className="!text-secondary-text !text-center !tracking-wide">
                              No payment method available
                            </Text>
                          )}
                          {paymentMethods?.map((method) => {
                            const isActive =
                              method.slug === selectedPaymentMethod?.slug;
                            return (
                              <Card
                                withBorder
                                key={method.slug}
                                className={`!rounded-xl${isActive ? " !border-primary-red" : ""}`}
                              >
                                <Flex
                                  justify="space-between"
                                  gap={10}
                                  wrap="wrap"
                                  align="center"
                                >
                                  <div className="flex gap-x-3 items-center">
                                    <Image src={method.logo} h={32} w={36} />
                                    <Text fw={500} fz="lg">
                                      {method.name}
                                    </Text>
                                  </div>
                                  <Button
                                    variant={isActive ? "filled" : "outline"}
                                    onClick={() =>
                                      setSelectedPaymentMethod(method)
                                    }
                                    className=" !w-20 !tracking-wide"
                                  >
                                    Pay
                                  </Button>
                                </Flex>
                              </Card>
                            );
                          })}
                        </section>

                        {paymentChanels && (
                          <>
                            <Divider />

                            <div className="text-center !space-y-7 mb-7 ">
                              <Text className="!text-secondary-text">
                                Select payment channel below
                              </Text>
                              <Flex
                                justify="space-around"
                                className="!flex-wrap !justify-center !gap-4 !w-full"
                                gap={20}
                              >
                                {!paymentChanels?.length && (
                                  <Text className="!text-secondary-text !text-center !tracking-wide">
                                    No payment channels available
                                  </Text>
                                )}
                                {paymentChanels?.map((channel) => {
                                  const isActive =
                                    channel.slug === selectedPaymentChannel;
                                  return (
                                    <Card
                                      key={channel.slug}
                                      withBorder
                                      onClick={() =>
                                        setSelectedPaymentChannel(channel.slug)
                                      }
                                      className={`!flex !flex-col !items-center !justify-center !text-center !py-3 !cursor-pointer !rounded-xl !border-2 !border-dashed !transition
							  ${
                  isActive
                    ? "!border-primary-red !bg-secondary-red"
                    : "!border-gray-300 hover:!border-primary-red !bg-primary-grey hover:!bg-secondary-red"
                }
							  !min-w-[100px] !max-w-full !flex-grow`}
                                    >
                                      {/* <Text className="!text-[#575757] !text-base">
                            {item.min} Units
                          </Text> */}
                                      <Text
                                        fw={700}
                                        className={`!text-lg !font-bold ${isActive ? "!text-primary-red" : "!text-black"}`}
                                      >
                                        {channel.name}
                                      </Text>
                                    </Card>
                                  );
                                })}
                              </Flex>
                              <CustomButton
                                disabled={
                                  !selectedPaymentChannel ||
                                  checkoutMutation.isPending
                                }
                                loading={checkoutMutation.isPending}
                                fullWidth
                                onClick={checkout}
                              >
                                Pay Now
                              </CustomButton>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </Card>
                )}

                <AlertModal
                  opened={successModalOpen}
                  status="success"
                  title="Raffle Ticket Payment Completed"
                  description="Congratulations, you have successfully, paid for your raffle ticket(s) for specific games. Copies of the Digital raffles Tickets has been sent to your email address and can see more on your WindFall Raffle Profile."
                  primaryButton={{
                    label: "Go to my Profile",
                    onClick: () => {
                      setSuccessModalOpen(false);
                      navigate("/profile");
                    },
                  }}
                  secondaryButton={{
                    label: "View Receipt",
                    onClick: () => {
                      setSuccessModalOpen(false);
                      navigate("/profile/receipt/1");
                    },
                  }}
                />
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default CheckoutPage;
