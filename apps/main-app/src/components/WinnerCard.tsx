import { Button } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

type WinnerCardProps = {
  name: string;
  story: string;
  image: string;
  priceValue: string;
  raffleName: string;
  ticketValue: string;
};

export default function WinnerCard({
  name,
  story,
  image,
  priceValue,
  raffleName,
  ticketValue,
}: WinnerCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-5"
      />
      <p className="text-sm text-gray-500 mb-1">Prize Won</p>
      <h3 className="text-[var(--primary-red)] font-bold text-2xl mb-2">
        {name}
      </h3>
      <p className="text-gray-700 mb-6">{story}</p>

      {/* Raffle Details */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-4 mb-5">
        <div className="text-center flex-1 gap-1 border-r border-r-[#f3f2f5]">
          <p className="font-medium">Price Value</p>
          <p className="text-base text-[#2d2d2d]">{priceValue}</p>
        </div>
        <div className="text-center flex-1 gap-1 border-r border-r-[#f3f2f5]">
          <p className="font-medium">Raffle Name</p>
          <p className="text-base text-[#2d2d2d]">{raffleName}</p>
        </div>
        <div className="text-center flex-1 gap-1 border-r border-r-transparent">
          <p className="font-medium">Value Ticket Bought</p>
          <p className="text-base text-[#2d2d2d]">{ticketValue}</p>
        </div>
      </div>

      <Button
        my="lg"
        fullWidth
        onClick={() => navigate("/winners/all-time/" + 1)}
        rightSection={
          <GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
        }
        className="!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide !text-lg"
      >
        Read Exclusive Winner Story
      </Button>
    </div>
  );
}
