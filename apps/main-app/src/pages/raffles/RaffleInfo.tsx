import { useEffect, useState } from "react";
import { PiMinusFill, PiPlusFill } from "react-icons/pi";
import { Button, Card, Progress, Text } from "@mantine/core";
import DiscountSlider from "../../components/DiscountSlider";
import { IconCash } from "@tabler/icons-react";
import { IoCartSharp } from "react-icons/io5";
import { FaReceipt, FaUser } from "react-icons/fa";
import type { Raffle } from "../../models/raffles";
import LiveBadge from "./LiveBadge";
import InstantBadge from "./InstantBadge";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { formatCurrency } from "../../utils/helper/formatCurrency";
import { useCart } from "../../utils/hooks/useCart";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { evaluateDiscount } from "../../utils/helper/evaluateDiscount";
import { raffleToCartItem } from "../../utils/helper/raffleToCartItem";
import { getTicketsSoldPercentage } from "../../utils/helper/getTicketsSoldPercentage";
import defaultRaffleImg from "../../utils/helper/defaultImg";
import GameBadge from "../../components/GameBadge";
import evaluateMax from "../../utils/helper/evaluateMax";

interface RaffleProps {
  raffle: Raffle;
}

export default function RaffleInfo({ raffle }: RaffleProps) {
  const [quantity, setQuantity] = useState(
    raffle.minimum_ticket_number_purchase
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [maxTickets, setMaxTickets] = useState(0);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const { addItemToCart, addItemMutation, getItemQuantity } = useCart();

  const navigate = useNavigate();

  // Check if there are insufficient tickets available
  const hasInsufficientTickets =
    raffle.available_tickets < raffle.minimum_ticket_number_purchase;
  const isSoldOut = raffle.available_tickets <= 0;
  const canPurchase = !hasInsufficientTickets && !isSoldOut;

  useEffect(() => {
    setMaxTickets(evaluateMax(raffle));

    // Set quantity based on availability
    if (isSoldOut) {
      setQuantity(0);
    } else if (hasInsufficientTickets) {
      setQuantity(raffle.available_tickets);
    } else {
      setQuantity(
        Math.max(
          getItemQuantity(raffle.uuid) || 0,
          raffle.minimum_ticket_number_purchase
        )
      );
    }

    setActiveSlide(0);
    setActiveThumbnail(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffle]);

  function setDiscount(min: number) {
    if (!canPurchase) return;
    setQuantity(
      Math.max(
        raffle.minimum_ticket_number_purchase,
        Math.min(min, raffle.available_tickets)
      )
    );
  }

  function selectImage(idx: number) {
    setActiveThumbnail(idx);
    setActiveSlide(idx);
  }

  const handleAddToCart = async (buyNow = false) => {
    if (!canPurchase) {
      notifications.show({
        title: "Cannot Add to Cart",
        message: isSoldOut
          ? "This raffle is sold out"
          : `Minimum ${raffle.minimum_ticket_number_purchase} tickets required, but only ${raffle.available_tickets} available`,
        color: "red",
      });
      return;
    }

    if (buyNow)
      return navigate(`/checkout`, {
        state: { data: { buy_now: raffleToCartItem(raffle, quantity) } },
      });
    try {
      const response = await addItemToCart(raffle.uuid, quantity);
      notifications.show({
        title: "Action Successful",
        message: response?.message || "Item added successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Failed to Add Item",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  };

  const galleryImages = raffle.gallery_images
    ? raffle.gallery_images.split("|").filter(Boolean)
    : [defaultRaffleImg];

  const {
    activeDiscount,
    discountedPricePerItem: discountedPricePerTicket,
    discountedTotal: discountedPrice,
    totalOriginalPrice,
  } = evaluateDiscount(
    raffle.ticket_price,
    quantity,
    raffle.discount_type === "straight_line"
      ? raffle.discount_percentage === 0
        ? []
        : [
            {
              max: raffle.maximum_ticket_number_purchase,
              min: raffle.minimum_ticket_number_purchase,
              value: raffle.discount_percentage,
            },
          ]
      : raffle.discount?.tiers
  );

  const pricePerTicket = raffle.ticket_price;

  const isInstant =
    raffle?.main_active_status === "instant" || raffle?.instant_game === "true";
  const isActive = raffle?.main_active_status === "live";
  const isClosed = raffle?.main_active_status === "ended";
  const isUpcoming = raffle?.main_active_status === "upcoming";
  const progressColor = "var(--primary-red)";

  const handleQuantityChange = (delta: number) => {
    if (!canPurchase) return;

    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < raffle.minimum_ticket_number_purchase)
        return raffle.minimum_ticket_number_purchase;
      if (newQty > maxTickets) return maxTickets;
      return newQty;
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-3">
            <div className="w-full md:w-auto !h-[100%]">
              <Carousel
                slideGap="sm"
                withControls={false}
                withIndicators={false}
                orientation={
                  window.innerWidth < 768 ? "horizontal" : "vertical"
                }
                className="max-w-full md:max-w-[100px] !h-[100%]"
                slideSize="auto"
                styles={{
                  viewport: { overflow: "hidden", height: "100%" },
                  container: { alignItems: "start", height: "100%" },
                }}
              >
                {galleryImages.map((img, idx) => (
                  <Carousel.Slide key={idx} className="!w-auto">
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      onClick={() => selectImage(idx)}
                      className={`w-16 h-16 object-cover rounded-md border-2 cursor-pointer ${
                        activeThumbnail === idx
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="flex-1">
            <div className="aspect-[1/1]">
              <Carousel
                withIndicators={galleryImages.length > 1}
                withControls={galleryImages.length > 1}
                height="100%"
                className="rounded-xl overflow-hidden w-full h-full"
                styles={{
                  viewport: { height: "100%" },
                  container: { height: "100%" },
                }}
                initialSlide={activeSlide}
                onSlideChange={setActiveThumbnail}
              >
                {galleryImages.map((img, idx) => (
                  <Carousel.Slide key={idx}>
                    <img
                      src={img}
                      alt={`raffle-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {!isInstant && isActive && (
            <GameBadge
              startDate={raffle.start_date}
              endDate={raffle.end_date}
              startTime={raffle.start_time}
              endTime={raffle.end_time}
              status={raffle.main_active_status}
              gameType={isInstant ? "instant" : "raffle"}
              active={raffle.is_active}
            />
          )}
          {isInstant && (
            <div className="flex gap-5">
              <InstantBadge />
              {(isActive || isClosed) && (
                <LiveBadge status={isActive ? "live" : "closed"} />
              )}
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="">
            {raffle.total_tickets && (
              <div className="mb-3">
                <Progress
                  h={7}
                  value={getTicketsSoldPercentage(
                    raffle.available_tickets,
                    raffle.total_tickets
                  )}
                  color={progressColor}
                  size="sm"
                  radius="xl"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              {isActive && raffle.total_tickets && (
                <>
                  <div>
                    <p className="text-lg mt-1 text-gray-500 text-right">
                      {getTicketsSoldPercentage(
                        raffle.available_tickets,
                        raffle.total_tickets
                      )}
                      % Entries Sold
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-lg mt-1 text-right ${isSoldOut ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                      {isSoldOut
                        ? "Sold Out!"
                        : `${raffle.available_tickets} Tickets Left`}
                    </p>
                  </div>
                </>
              )}
              {isClosed && (
                <>
                  <div>
                    <p className="text-lg mt-1 text-gray-500 text-right">
                      Draw Closed
                    </p>
                  </div>
                </>
              )}
              {isUpcoming && (
                <>
                  <div>
                    <p className="text-lg mt-1 text-gray-500 text-right">
                      No Ticket Sold Yet
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-xl flex flex-col gap-6 text-center shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {raffle.name}
          </h1>
          <p className="text-gray-500 mt-1">{raffle.description}</p>
        </div>

        {/* Insufficient Tickets Warning */}
        {isActive && hasInsufficientTickets && !isSoldOut && (
          <div className="bg-yellow-50 border-2 border-dashed border-yellow-500 rounded-xl px-4 py-3">
            <p className="text-yellow-800 text-sm font-semibold">
              ⚠️ Only {raffle.available_tickets} ticket
              {raffle.available_tickets !== 1 ? "s" : ""} remaining
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Minimum purchase is {raffle.minimum_ticket_number_purchase}{" "}
              tickets
            </p>
          </div>
        )}

        {/* Sold Out Warning */}
        {isActive && isSoldOut && (
          <div className="bg-red-50 border-2 border-dashed border-red-500 rounded-xl px-4 py-3">
            <p className="text-red-800 text-sm font-semibold">
              🎫 This raffle is sold out
            </p>
            <p className="text-red-700 text-xs mt-1">
              All tickets have been purchased
            </p>
          </div>
        )}

        <div className="flex justify-center items-center gap-5">
          <span className="text-gray-500 text-lg">One Ticket Price:</span>{" "}
          <div className="flex flex-col items-center justify-center">
            <span className="text-primary-red text-2xl md:text-3xl font-semibold">
              ₦{" "}
              {(activeDiscount
                ? discountedPricePerTicket
                : pricePerTicket
              ).toLocaleString()}
            </span>
            {activeDiscount && (
              <span className="text-lg md:text-lg font-light text-gray-500 line-through">
                ₦ {pricePerTicket.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center mb-4">
          <p className="text-gray-500 text-base text-center">Ticket Quantity</p>

          {isActive && canPurchase && (
            <div className="flex gap-x-2 md:gap-x-5 items-center">
              <PiMinusFill
                onClick={() => handleQuantityChange(-1)}
                size={32}
                className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
              />

              <Text className="!px-5 !pt-1.5 !rounded-t-lg !font-semibold !text-primary-red !text-2xl md:!text-3xl !bg-secondary-red !border-dashed !border-b-1 !border-primary-red ">
                {quantity}
              </Text>

              <PiPlusFill
                onClick={() => handleQuantityChange(1)}
                size={32}
                className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
              />
            </div>
          )}

          {isActive && !canPurchase && (
            <div className="flex gap-x-2 md:gap-x-5 items-center opacity-50">
              <PiMinusFill
                size={32}
                className="p-2 text-[#ABABAB] rounded-full bg-white cursor-not-allowed shadow-md"
              />

              <Text className="!px-5 !pt-1.5 !rounded-t-lg !font-semibold !text-gray-400 !text-2xl md:!text-3xl !bg-gray-100 !border-dashed !border-b-1 !border-gray-300 ">
                {quantity}
              </Text>

              <PiPlusFill
                size={32}
                className="p-2 text-[#ABABAB] rounded-full bg-white cursor-not-allowed shadow-md"
              />
            </div>
          )}
        </div>

        {isActive && canPurchase && (
          <>
            <DiscountSlider
              min={raffle.minimum_ticket_number_purchase}
              value={quantity}
              max={maxTickets}
              onChange={setQuantity}
              activeDiscount={activeDiscount}
            />

            <div className="flex flex-wrap justify-center gap-4 w-full">
              {raffle.discount?.tiers?.map((item, i) => {
                const isActiveDiscount = activeDiscount?.value === item.value;
                const isDisabled = item.min > raffle.available_tickets;
                return (
                  <Card
                    key={i}
                    withBorder
                    onClick={() => !isDisabled && setDiscount(item.min)}
                    className={`!flex !flex-col !items-center !justify-center !text-center !py-3 !rounded-xl !border-2 !border-dashed !transition
          ${
            isDisabled
              ? "!border-gray-200 !bg-gray-50 !opacity-50 !cursor-not-allowed"
              : isActiveDiscount
                ? "!border-primary-red !bg-secondary-red !cursor-pointer"
                : "!border-gray-300 hover:!border-primary-red !bg-primary-grey hover:!bg-secondary-red !cursor-pointer"
          }
          !min-w-[100px] !max-w-full !flex-grow`}
                  >
                    <Text className="!text-[#575757] !text-base">
                      {item.min} Units
                    </Text>
                    <Text
                      fw={700}
                      className={`!text-lg !font-bold ${isActiveDiscount ? "!text-primary-red" : "!text-black"}`}
                    >
                      {item.value}% Off
                    </Text>
                    {isDisabled && (
                      <Text className="!text-xs !text-gray-400 !mt-1">
                        Not available
                      </Text>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {!isActive && (
          <div>
            <GameBadge
              startDate={raffle.start_date}
              endDate={raffle.end_date}
              startTime={raffle.start_time}
              endTime={raffle.end_time}
              status={raffle.main_active_status}
              gameType={isInstant ? "instant" : "raffle"}
              active={raffle.is_active}
            />
          </div>
        )}

        <div className="flex justify-center mb-4 items-center space-x-6 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <FaReceipt />
            <span>
              Min Entry: {formatCurrency(raffle.minimum_ticket_amount_purchase)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaUser className="rounded-full" />
            <span>
              Max/Person: {raffle.maximum_ticket_number_purchase} Tickets
            </span>
          </div>
        </div>

        <div className="bg-red-50 border-2 mb-7 border-dashed border-red-500 rounded-xl px-4 py-5">
          <p className="text-gray-700 text-sm">
            {activeDiscount ? "Discounted Price" : "Price"}
          </p>
          <div className="flex justify-center items-baseline gap-3 flex-wrap">
            {activeDiscount && canPurchase && (
              <span className="text-2xl md:text-3xl font-light text-[#FF9798] line-through">
                ₦ {totalOriginalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-2xl md:text-3xl font-bold text-primary-red">
              ₦{" "}
              {(activeDiscount && canPurchase
                ? discountedPrice
                : totalOriginalPrice
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="xl"
            fullWidth={!isActive || !canPurchase}
            style={{
              backgroundColor:
                isActive && canPurchase ? "var(--primary-red)" : "#ef4444",
              color: "#fff",
              opacity: isActive && canPurchase ? 1 : 0.5,
              cursor: isActive && canPurchase ? "pointer" : "not-allowed",
            }}
            className={`text-sm !text-wrap font-semibold py-2 !rounded-xl transition !border-2 !border-dashed !border-secondary-red hover:bg-primary-red`}
            rightSection={<IoCartSharp />}
            onClick={() => handleAddToCart()}
            loading={addItemMutation.isPending}
            disabled={!isActive || !canPurchase || addItemMutation.isPending}
          >
            {"Add To Cart"}
          </Button>
          {isActive && canPurchase && (
            <Button
              size="xl"
              style={{
                backgroundColor: "black",
                color: "#fff",
              }}
              onClick={() => handleAddToCart(true)}
              disabled={!isActive || !canPurchase || addItemMutation.isPending}
              className={`text-sm font-semibold !py-2 !rounded-xl transition !border-2 !border-dashed !border-secondary-red hover:bg-gray-900 !shadow-md`}
              rightSection={<IconCash />}
            >
              Buy Now
            </Button>
          )}
        </div>
        {!isActive && (
          <Text className="!text-sm !text-secondary-text">
            Price change based on number of tickets
          </Text>
        )}
      </div>
    </div>
  );
}