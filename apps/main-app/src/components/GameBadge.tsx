import { type GameType, type RaffleStatus } from "../models/raffles";
import { mergeDateTimeStrings } from "../utils/helper/mergeDateTimeStrings";
import InstantRaffleBadge from "./InstantRaffleBadge";
import RaffleBadge from "./RaffleBadge";

interface RaffleBadgeProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  gameType: GameType;
  status: RaffleStatus;
  label?: string;
  active?: string;
  className?: string;
  description?: string;
}

export default function GameBadge({ startDate, endDate, startTime, endTime, active, status, label, className, gameType, description }: RaffleBadgeProps) {
  const isInstant = gameType==='instant';
  const isUpcoming = status==='upcoming';
  const date = mergeDateTimeStrings(isUpcoming ? startDate: endDate, isUpcoming ? startTime: endTime);
  return (
    <>
    {isInstant && <InstantRaffleBadge active={active} status={status} description={description} />}
    {!isInstant && <RaffleBadge date={date} status={status} label={label} className={className} description={description} />}
    </>
  );
}
