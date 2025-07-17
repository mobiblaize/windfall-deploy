import { useState } from "react";
// import { IconPlus, IconMinus } from "@tabler/icons-react";
import raffleImg1 from "../../assets/raffle-img-1.jpg";
import raffleImg2 from "../../assets/raffle-img-2.jpg";
import raffleImg3 from "../../assets/raffle-img-3.jpg";
import raffleImg4 from "../../assets/raffle-img-4.jpg";
import { PiMinusFill, PiPlusFill } from "react-icons/pi";
import { Button, Progress, Text } from "@mantine/core";
import DiscountSlider from "../../components/DiscountSlider";
import RaffleBadge from "../../components/RaffleBadge";
import { IconCash } from "@tabler/icons-react";
import { IoCartSharp } from "react-icons/io5";
import { FaReceipt, FaUser } from "react-icons/fa";

const mockImages = [raffleImg1, raffleImg2, raffleImg3, raffleImg4];

export default function RaffleInfo() {
  const [selectedImage, setSelectedImage] = useState(mockImages[0]);
  const [quantity, setQuantity] = useState(1);

  const pricePerTicket = 3000;
  const maxTickets = 200;

  const discount = Math.floor((quantity / maxTickets) * 30); // Up to 30%
  const hasDiscount = discount > 0;
  const totalOriginalPrice = pricePerTicket * quantity;
  const discountedPrice = Math.round(totalOriginalPrice * (1 - discount / 100));

  const progressColor = "var(--primary-red)";

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (newQty > maxTickets) return maxTickets;
      return newQty;
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-3">
            {mockImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded-md border-2 cursor-pointer ${
                  selectedImage === img
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 aspect-[1/1]">
            <img
              src={selectedImage}
              alt="Main"
              className="rounded-xl w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-8">
          <RaffleBadge date={new Date().toDateString()} status="active" />
        </div>

        <div className="mt-5">
          <div className="">
            <div className="mb-3">
              <Progress
                h={7}
                value={60}
                color={progressColor}
                size="sm"
                radius="xl"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg mt-1 text-gray-500 text-right">
                  60% Entries Sold
                </p>
              </div>
              <div>
                <p className="text-lg mt-1 text-gray-500 text-right">
                  1000 Tickets Left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-xl flex flex-col gap-6 text-center shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria
          </h1>
          <p className="text-gray-500 mt-1">
            Enter now to grab the opportunity of a brand new Samsung Galaxy.
          </p>
        </div>

        <div className="flex justify-center items-center gap-5">
          <span className="text-gray-500 text-lg">One Ticket Price:</span>{" "}
          <span className="text-red-600 text-2xl md:text-3xl font-semibold">
            ₦ {pricePerTicket.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-5 items-center mb-4">
          <p className="text-gray-500 text-base text-center">Ticket Quantity</p>

          <div className="flex gap-x-2 md:gap-x-5 items-center">
            <PiPlusFill
              onClick={() => handleQuantityChange(1)}
              size={32}
              className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
            />

            <Text className="!px-5 !pt-1.5 !rounded-t-lg !font-semibold !text-primary-red !text-2xl md:!text-3xl !bg-secondary-red !border-dashed !border-b-1 !border-primary-red ">
              {quantity}
            </Text>

            <PiMinusFill
              onClick={() => handleQuantityChange(-1)}
              size={32}
              className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
            />
          </div>
        </div>

        <DiscountSlider
          value={quantity}
          max={maxTickets}
          onChange={setQuantity}
          getDiscount={(val, max) => Math.floor((val / max) * 30)}
        />

        <div className="flex justify-center mb-4 items-center space-x-6 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <FaReceipt />
            <span>Min Entry: ₦3K</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUser className="rounded-full" />
            <span>Max/Person: 200 Tickets</span>
          </div>
        </div>

        <div className="bg-red-50 border-2 mb-7 border-dashed border-red-500 rounded-xl px-4 py-5">
          <p className="text-gray-700 text-sm">
            {hasDiscount ? "Discounted Price" : "Price"}
          </p>
          <div className="flex justify-center items-baseline gap-3">
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                ₦ {totalOriginalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-2xl md:text-3xl font-bold text-red-600">
              ₦ {(hasDiscount ? discountedPrice : totalOriginalPrice).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="xl"
            style={{
              backgroundColor: "var(--primary-red)",
              color: "#fff",
            }}
            className={`text-sm !text-wrap font-semibold py-2 !rounded-xl transition !border-2 !border-dashed !border-secondary-red hover:bg-red-600`}
            rightSection={<IoCartSharp />}
          >
            Add To Cart
          </Button>
          <Button
            size="xl"
            style={{
              backgroundColor: "black",
              color: "#fff",
            }}
            className={`text-sm font-semibold !py-2 !rounded-xl transition !border-2 !border-dashed !border-secondary-red hover:bg-gray-900 !shadow-md`}
            rightSection={<IconCash />}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
