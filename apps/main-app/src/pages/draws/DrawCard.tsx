import { Button, Divider, Image } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import type { LiveDraw } from "./Draws";
import { format } from "date-fns";

export default function DrawCard({ draw }: { draw: LiveDraw }) {

  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm">
      <Image
        className="!rounded-md h-48 object-cover mb-5"
        src={draw.card_image}
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
            {draw.customer?.firstname} {draw.customer?.lastname}
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
            {draw.metrics?.unique_players}
          </p>
        </div>
      </div>
        <Divider/>
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-5">
        <div className="text-center flex-1 gap-1">
          <p className="text-secondary-text">Conducted by</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.customer?.firstname} {draw.customer?.lastname}
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
          <p className="text-secondary-text">Number of Winners</p>
          <p className="text-base text-wrap break-all text-[#2d2d2d]">
            {draw.metrics?.unique_players}
          </p>
        </div>
      </div>

      <Button
        my="lg"
        fullWidth
        rightSection={
          <GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
        }
        className="!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide !text-lg"
      >
        Watch Live Draw
      </Button>
    </div>
  );
}
