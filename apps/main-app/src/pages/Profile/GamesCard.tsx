import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { Raffle } from "../../models/raffles";
import ResultsBadge from "../../components/ResultsBadge";

function GamesCard({
  image,
  title,
  description,
  status,
  gameType,
  date,
}: Raffle) {
  const isCompleted = status === "completed";
  const isInstant = gameType === "instant";
    const navigate=useNavigate();
	return (
		<div className="bg-white rounded-xl shadow-sm p-4 text-center">
		  {/* Image */}
		  <div className="overflow-hidden mb-3">
			<img
			  src={image}
			  alt="raffle"
			  className="w-full rounded-xl h-70 object-cover mb-[-1.25rem]"
			/>
			<ResultsBadge date={date} status={status} gameType={gameType} />
		  </div>
	
		  {/* Info */}
		  <h3 className="font-extrabold text-xl text-gray-800 leading-snug">
			{title}
		  </h3>
		  <p className="text-gray-500 text-sm mt-1 mb-2">{description}</p>
	
			<Button
				fullWidth
				size="lg"
				style={{
				backgroundColor: "#ef4444",
				color: "#fff",
				}}
				onClick={()=>navigate(`2`)}
				className={`text-sm font-semibold py-2 !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
				 isCompleted ? '!bg-[#4F7A21]': isInstant ? "!bg-instant-blue": "!bg-primary-red"
				}`}
			>
				{!isCompleted ? `My Ticket`: `View Result`}
			</Button>
	

		</div>
	);
}

export default GamesCard;
