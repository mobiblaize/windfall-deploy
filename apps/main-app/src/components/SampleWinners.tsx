import { useNavigate } from "react-router-dom";
import WinnerCard from "../pages/winners/WinnerCard";
import { useFetchData } from "../utils/hooks/useApis";
import type { Winner } from "../pages/winners/AllWinnersPage";
import LoadingState from "./LoadingState";

export default function SampleWinners() {
  const navigate = useNavigate();
  const {
    data: response,
    isLoading
  } = useFetchData(`guest/all-winners?paginate=0&limit=4&page=1`);

  const winners: Winner[] = response?.data?.data || [];

  return (
    <section className="px-6 md:px-16 py-10 bg-[#f9f9f9] text-center">
      <h2 className="text-3xl font-bold text-gray-800">
        Real People. Real Wins.
      </h2>
      <p className="text-gray-500 mb-5 max-w-xl mx-auto">
        Meet the lucky participants who turned tickets into life-changing
        prizes. Your story could be next.
      </p>
      <button
        onClick={() => navigate("/raffles")}
        className="bg-[var(--primary-red)] text-white font-medium px-6 py-2 rounded-md mb-10"
      >
        Explore Games
      </button>

      {isLoading && (
        <LoadingState description="Fetching winners from the system." />
      )}

      {!isLoading && (
        <>
          {winners.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {winners.map((winner, index) => (
                <WinnerCard key={index} winner={winner} />
              ))}
            </div>
          ) : (
            <>
            </>
          )}
        </>
      )}
    </section>
  );
}
