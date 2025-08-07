// components/RaffleCard.tsx
import { Button, Progress } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import RaffleBadge from "./RaffleBadge";
import type { RaffleStatus } from "../models/raffles";

export interface RaffleCardProps {
  image: string;
  title: string;
  description: string;
  fee: string;
  status: RaffleStatus;
  sold: number;
  date: string;
}

export default function RaffleCard({
  image,
  title,
  description,
  fee,
  status,
  sold,
  date,
}: RaffleCardProps) {
  const isActive = status === "active";
  const progressColor = isActive ? "var(--primary-red)" : "#f79009";
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      {/* Image */}
      <div className="overflow-hidden mb-3">
        <img
          src={image}
          alt="raffle"
          className="w-full rounded-xl h-70 object-cover mb-[-1.25rem]"
        />
        <RaffleBadge date={date} status={status} />
      </div>

      {/* Info */}
      <h3 className="font-extrabold text-xl text-gray-800 leading-snug">
        {title}
      </h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>

      <p className="text-xs mt-3 text-gray-500">Min Entry Fee:</p>
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
            onClick={() => navigate("/raffles/2")}
            className={`text-sm font-semibold py-2 !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
            isActive ? "hover:bg-red-600" : ""
            }`}
        >
            {isActive ? `Buy Ticket For ${fee}` : `Coming Soon`}
        </Button>
    {/* </div> */}



      <div className="mt-5">
        <div className="flex items-center">
          <div className="w-2/3">
            <Progress value={sold} color={progressColor} size="sm" radius="xl" />
          </div>
          <div className="w-1/3">
            <p className="text-xs mt-1 text-gray-500 text-right">
              {sold}% Entries Sold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
