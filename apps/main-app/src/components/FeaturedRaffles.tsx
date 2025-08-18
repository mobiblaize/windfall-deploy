// components/FeaturedRaffles.tsx
import { NavLink } from "react-router-dom";
import raffleImg from "../assets/default-raffle.png";
import instantRaffleImg from "../assets/instant-raffle.png";
import RaffleCard from "./RaffleCard";
import type { Raffle } from "../models/raffles";

const raffles: Raffle[] = [
  {
    title: "Win One Bed Room Flat in Akoka-Yaba, Lagos State, Nigeria",
    description: "Play for a chance to own the latest iPhone.",
    fee: "₦2K",
    image: raffleImg,
    sold: 70,
    date: "June 2, 2025 | 10:00am",
    status: "active",
    category: "apartment",
    prizeType: "iPhone",
    ticketType: "MacBook",
    drawTime: "8am",
    gameType: "raffle",
  },
  {
    title: "Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria",
    description:
      "Enter now to grab the opportunity of a brand new Samsung Galaxy.",
    fee: "₦3K",
    image: instantRaffleImg,
    sold: 60,
    date: "June 2, 2025 | 10:00am",
    status: "active",
    category: "apartment",
    prizeType: "Samsung",
    ticketType: "MacBook",
    drawTime: "9am",
    gameType: "instant",
  },
  {
    title: "Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria",
    description: "Take part for a chance to win a MacBook Pro.",
    fee: "₦5K",
    image: raffleImg,
    sold: 0,
    date: "June 2, 2025 | 10:00am",
    status: "upcoming",
    category: "apartment",
    prizeType: "MacBook",
    ticketType: "MacBook",
    drawTime: "10am",
    gameType: "raffle",
  },
];

export default function FeaturedRaffles() {
  return (
    <section className="px-6 md:px-16 py-20 bg-[#f9f9f9]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Featured Raffles</h2>
          <p className="text-gray-500 text-sm">
            One ticket. One shot. Your keys could be next.
          </p>
        </div>
        <NavLink to={"/raffles"}>
          <p className="text-red-500 text-sm font-medium hover:underline">
            Explore All (60)
          </p>
        </NavLink>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {raffles.map((raffle, idx) => (
          <RaffleCard key={idx} {...raffle} />
        ))}
      </div>
    </section>
  );
}
