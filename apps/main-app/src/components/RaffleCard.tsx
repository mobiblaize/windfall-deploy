import { Button, Progress } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { Raffle } from "../models/raffles";
import GameBadge from "./GameBadge";
import { formatCurrency } from "../utils/helper/formatCurrency";
import { getTicketsSoldPercentage } from "../utils/helper/getTicketsSoldPercentage";
import defaultRaffleImg from "../utils/helper/defaultRaffeImg";

export default function RaffleCard(raffle: Raffle) {
  const isActive = raffle.main_active_status === "live";
  const isInstant =
    raffle.main_active_status === "instant" || raffle.instant_game === "true";
  const navigate = useNavigate();
  const progressColor = !isActive ? "#f79009": isInstant ? "var(--color-instant-blue)" : "var(--primary-red)";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      {/* Image */}
      <div className="overflow-hidden mb-3">
        <img
          src={raffle.card_image || defaultRaffleImg}
          alt="raffle"
          className="w-full rounded-xl h-70 object-cover mb-[-1.25rem]"
        />
        <GameBadge
          date={raffle.start_date}
          status={raffle.main_active_status}
          gameType={isInstant ? "instant" : "raffle"}
          active={raffle.is_active}
        />
      </div>

      {/* Info */}
      <h3 className="font-extrabold text-xl text-gray-800 leading-snug">
        {raffle.name}
      </h3>
      <p className="text-gray-500 text-sm mt-1">{raffle.description}</p>

      <p className="text-xs mt-3 mb-2 text-gray-500">
        Min Entry Fee:{" "}
        <span>{formatCurrency(raffle.maximum_ticket_amount_purchase)}</span>
      </p>
      {/* <div className="border-2 border-dashed border-red-500 rounded-md my-2"> */}
      <Button
        fullWidth
        size="lg"
        disabled={!isActive}
        style={{
          backgroundColor: "#ef4444",
          color: "#fff",
          opacity: isActive ? 1 : 0.5,
          cursor: isActive ? "pointer" : "not-allowed",
        }}
        onClick={() => navigate(`/raffles/${raffle.uuid}`)}
        className={`text-sm font-semibold py-2 !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
          !isActive ? "" : isInstant ? "!bg-instant-blue" : "!bg-primary-red"
        }`}
      >
        {raffle.cta_text
          ? raffle.cta_text
          : isInstant
            ? `Purchase Ticket For ${formatCurrency(raffle.ticket_price)}`
            : `Buy Ticket For ${formatCurrency(raffle.ticket_price)}`}
      </Button>
      {/* </div> */}

      {raffle.total_tickets && (
        <div className="mt-5">
          <div className="flex items-center">
            <div className="w-2/3">
              <Progress
                value={getTicketsSoldPercentage(
                  raffle.available_tickets,
                  raffle.total_tickets
                )}
                color={progressColor}
                size="sm"
                radius="xl"
              />
            </div>
            <div className="w-1/3">
              <p className="text-xs mt-1 text-gray-500 text-right">
                {getTicketsSoldPercentage(
                  raffle.available_tickets,
                  raffle.total_tickets
                )}
                % Entries Sold
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
