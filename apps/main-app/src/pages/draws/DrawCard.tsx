import { Button, Divider, Image } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import type { LiveDraw } from "./Draws";
import { format } from "date-fns";
import defaultRaffleImg from "../../utils/helper/defaultImg";

export default function DrawCard({ draw }: { draw: LiveDraw }) {
  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm">
      <Image
        className="!rounded-md h-48 object-cover mb-5"
        src={draw.game?.card_image ?? defaultRaffleImg}
        alt={draw.game?.name}
      />
      <h3 className="text-primary-text font-bold text-2xl mb-2">
        {draw.game?.name}
      </h3>
      <p className="text-gray-700 mb-6">{draw.game?.short_description}</p>

      {/* Raffle Details */}
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-4">
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Draw Winner</p>
          <p className="text-base text-wrap break-all text-primary-red font-semibold">
            {draw.customer ? `${draw.customer?.firstname} ${draw.customer?.lastname}`: 'N/A'}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Draw Date</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.draw_at
              ? format(new Date(draw.draw_at), "MMMM d, yyyy")
              : "N/A"}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Total Ticket</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.metrics?.total_tickets_sold?.toLocaleString()}
          </p>
        </div>
      </div>
      <Divider />
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-5">
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Conducted by</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.conducted_by?.name ?? 'N/A'}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Number of Players</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.metrics?.unique_players?.toLocaleString()}
          </p>
        </div>

        <Divider orientation="vertical" />
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Number of Winners</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.metrics?.potential_winner?.toLocaleString()}
          </p>
        </div>
      </div>

      <Button
        my="lg"
        fullWidth
        disabled={!draw.video_url}
        rightSection={
          <GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
        }
        onClick={() => window.open(draw.video_url, "_blank")}
        className={
          "!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide !text-lg disabled:opacity-50 disabled:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:bg-gray-200 data-[disabled=true]:border-gray-300 data-[disabled=true]:text-gray-500"
        }
      >
        Watch Live Draw
      </Button>
    </div>
  );
}
