import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { RaffleGame } from "./GamesTab";
import defaultRaffleImg from "../../utils/helper/defaultImg";
import GameBadge from "../../components/GameBadge";

function GamesCard({ game }: { game: RaffleGame }) {
  const navigate = useNavigate();
  const isCompleted = game.game.main_active_status === "ended" || game.game.is_active === "false";
  const isInstant =
    game.game?.main_active_status === "instant" ||
    game.game?.instant_game === "true";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      {/* Image */}
      <div className="overflow-hidden mb-3">
        <img
          src={game.game.card_image || defaultRaffleImg}
          alt="raffle"
          className="w-full rounded-xl h-70 object-cover mb-[-1.25rem]"
        />
        <GameBadge
          startDate={game.game.start_date}
          endDate={game.game.end_date}
          startTime={game.game.start_time}
          endTime={game.game.end_time}
          status={game.game.main_active_status}
          gameType={game.game.instant_game === "true" ? "instant" : "raffle"}
        />
      </div>

      {/* Info */}
      <h3 className="font-extrabold text-xl text-gray-800 leading-snug">
        {game.game.name}
      </h3>
      <p className="text-gray-500 text-sm mt-1 mb-2">{game.game.description}</p>

      <Button
        fullWidth
        size="lg"
        style={{
          backgroundColor: "#ef4444",
          color: "#fff",
        }}
        onClick={() => navigate(game.uuid)}
        className={`text-sm font-semibold py-2 !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
          isCompleted
            ? "!bg-[#4F7A21]"
            : isInstant
              ? "!bg-instant-blue"
              : "!bg-primary-red"
        }`}
      >
        {!isCompleted ? `My Ticket` : `View Result`}
      </Button>
    </div>
  );
}

export default GamesCard;
