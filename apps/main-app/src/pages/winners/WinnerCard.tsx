import { Button, Divider, Image } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import type { Winner } from "./AllWinnersPage";
import { formatCurrency } from "../../utils/helper/formatCurrency";

export default function WinnerCard({ winner }: { winner: Winner }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm">
      <Image
        className="!rounded-md h-48 object-cover mb-5"
        src={winner.card_image}
        alt={winner.game_name}
      />
      <p className="text-sm text-gray-500 mb-1">Prize Won</p>
      <h3 className="text-[var(--primary-red)] font-bold text-2xl mb-2">
        {winner.prize_won}
      </h3>
      <p className="text-gray-700 mb-6">{winner.short_description}</p>

      {/* Raffle Details */}
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-5">
        <div className="text-center flex-1 gap-1">
          <p className="font-medium">Price Value</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {formatCurrency(winner.prize_cost)}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="font-medium">Raffle Name</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {winner.game_name}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="font-medium">Value Ticket Bought</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {formatCurrency(winner.ticket_price)}
          </p>
        </div>
      </div>

      <Button
        my="lg"
        fullWidth
        onClick={() => navigate("/winners/" + winner.uuid)}
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
