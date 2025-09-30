import { type Raffle, type RaffleStatus } from "../models/raffles";
import InstantRaffleBadge from "./InstantRaffleBadge";
import RaffleBadge from "./RaffleBadge";

interface ResultsBadgeProps {
  raffle: Raffle;
  status: RaffleStatus;
  label?: string;
  className?: string;
}

export default function ResultsBadge({
  label,
  className,
  raffle
}: ResultsBadgeProps) {
  const isInstant =
    raffle?.main_active_status === "instant" ||
    raffle?.instant_game === "true";
  const isCompleted = (raffle?.main_active_status === "ended") || (raffle?.is_active === "false");
  return (
    <>
      {isInstant && (
        <InstantRaffleBadge
          active={raffle?.is_active}
          bgColor="#039855"
          label={isCompleted ? "Check Results" : undefined}
        />
      )}
      {!isInstant && (
        <RaffleBadge
          date={raffle.start_date}
          status={raffle.main_active_status}
          label={isCompleted ? "Check Results" : undefined}
          description={isCompleted ? "Draw Completed" : label}
          className={className}
          bgColor={isCompleted ? "#4F7A21" : undefined}
          labelColor={isCompleted ? "#669F2A" : undefined}
        />
      )}
    </>
  );
}
