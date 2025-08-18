import { type GameType, type RaffleStatus } from "../models/raffles";
import InstantRaffleBadge from "./InstantRaffleBadge";
import RaffleBadge from "./RaffleBadge";

interface ResultsBadgeProps {
  date: string;
  gameType: GameType;
  status: RaffleStatus;
  label?: string;
  className?: string;
}

export default function ResultsBadge({ date, status, label, className, gameType }: ResultsBadgeProps) {
  const isInstant = gameType==='instant';
  const isCompleted = status==='completed';
  return (
    <>
    {isInstant && <InstantRaffleBadge status={status} bgColor="#039855" label={isCompleted ? 'Check Results': undefined} />}
    {!isInstant && <RaffleBadge date={date} status={status} label={isCompleted ? 'Check Results': undefined} description={isCompleted ? 'Draw Completed': label} className={className} bgColor={isCompleted ? "#4F7A21": undefined} labelColor={isCompleted ? "#669F2A": undefined} />}
    </>
  );
}
