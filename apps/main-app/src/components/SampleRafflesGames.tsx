import { useState } from 'react';
import RaffleCard from './RaffleCard';
import FilterPill from './FilterPill'; // ✅ import here
import raffleImg from '../assets/default-raffle.png';

const raffles = [
  {
    title: 'Win One Bed Room Flat in Akoka-Yaba, Lagos State, Nigeria',
    description: 'Play for a chance to own the latest iPhone.',
    fee: '₦2K',
    image: raffleImg,
    sold: 70,
    date: 'June 2, 2025 | 10:00am',
    status: 'active',
    category: 'apartment',
    prizeType: 'iPhone',
  },
  {
    title: 'Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria',
    description: 'Enter now to grab the opportunity of a brand new Samsung Galaxy.',
    fee: '₦3K',
    image: raffleImg,
    sold: 60,
    date: 'June 2, 2025 | 10:00am',
    status: 'active',
    category: 'apartment',
    prizeType: 'Samsung',
  },
  {
    title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
    description: 'Take part for a chance to win a MacBook Pro.',
    fee: '₦5K',
    image: raffleImg,
    sold: 0,
    date: 'June 2, 2025 | 10:00am',
    status: 'upcoming',
    category: 'apartment',
    prizeType: 'MacBook',
  },
];

export default function SampleRafflesGames() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'instant'>('all');
  const [category, setCategory] = useState('all');
  const [prizeType, setPrizeType] = useState('all');

  const filteredRaffles = raffles.filter((raffle) => {
    const statusMatch = statusFilter === 'all' || raffle.status === statusFilter;
    const categoryMatch = category === 'all' || raffle.category === category;
    const prizeMatch = prizeType === 'all' || raffle.prizeType === prizeType;
    return statusMatch && categoryMatch && prizeMatch;
  });

  return (
    <section className="px-6 md:px-16 py-20 bg-white">
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Raffles/Games</h2>
          <p className="text-sm text-gray-500">One ticket. One shot. Your keys could be next.</p>
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-gray-600"
          >
            <option value="all">Category: Show All</option>
            <option value="apartment">Apartments</option>
            <option value="car">Cars</option>
            <option value="phone">Phones</option>
          </select>

          <select
            value={prizeType}
            onChange={(e) => setPrizeType(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-gray-600"
          >
            <option value="all">Prize Type</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="MacBook">MacBook</option>
          </select>

          <a href="#" className="text-red-500 text-sm font-medium hover:underline">
            Explore All ({raffles.length})
          </a>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterPill
          label="All Games"
          count={40}
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        <FilterPill
          label="Live Games"
          count={10}
          active={statusFilter === 'active'}
          onClick={() => setStatusFilter('active')}
        />
        <FilterPill
        
          label="Upcoming Games"
          count={16}
          active={statusFilter === 'upcoming'}
          onClick={() => setStatusFilter('upcoming')}
        />
        <FilterPill
          label="Instant Games"
          count={12}
          active={statusFilter === 'instant'}
          onClick={() => setStatusFilter('instant')}
        />
      </div>

      {/* Raffles List */}
      <div className="grid gap-6 md:grid-cols-3">
        {filteredRaffles.map((raffle, idx) => (
          <RaffleCard key={idx} {...raffle} />
        ))}

        {filteredRaffles.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">No raffles match your filters.</p>
        )}
      </div>
    </section>
  );
}
