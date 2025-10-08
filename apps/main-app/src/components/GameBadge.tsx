import { type GameType, type RaffleStatus } from "../models/raffles";
import InstantRaffleBadge from "./InstantRaffleBadge";
import RaffleBadge from "./RaffleBadge";

interface RaffleBadgeProps {
  date: string;
  gameType: GameType;
  status: RaffleStatus;
  label?: string;
  active?: string;
  className?: string;
  description?: string;
}

export default function GameBadge({ date, active, status, label, className, gameType, description }: RaffleBadgeProps) {
  const isInstant = gameType==='instant';
  return (
    <>
    {isInstant && <InstantRaffleBadge active={active} status={status} description={description} />}
    {!isInstant && <RaffleBadge date={date} status={status} label={label} className={className} description={description} />}
    </>
  );
}
