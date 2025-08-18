import { useState } from 'react';
import raffleImg from '../../assets/default-raffle.png';
import instantRaffleImg from '../../assets/instant-raffle.png';
import FilterPill from '../../components/FilterPill';
import RaffleCard from '../../components/RaffleCard';
import { ActionIcon } from '@mantine/core';
import { IconZoomFilled } from '@tabler/icons-react';
import Paginator from '../../components/Paginator';
import type { Raffle } from '../../models/raffles';

const raffles: Raffle[] = [
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
    ticketType: 'MacBook',
    drawTime: '8am',
    gameType: 'raffle',
  },
  {
    title: 'Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria',
    description: 'Enter now to grab the opportunity of a brand new Samsung Galaxy.',
    fee: '₦3K',
    image: instantRaffleImg,
    sold: 60,
    date: 'June 2, 2025 | 10:00am',
    status: 'active',
    category: 'apartment',
    prizeType: 'Samsung',
    ticketType: 'MacBook',
    drawTime: '9am',
    gameType: 'instant',
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
    ticketType: 'MacBook',
    drawTime: '10am',
    gameType: 'raffle',
  },
  {
    title: 'Win a 2-Bedroom Apartment in Victoria Island, Lagos State, Nigeria',
    description: 'Take part for a chance to win a MacBook Pro.',
    fee: '₦5K',
    image: instantRaffleImg,
    sold: 0,
    date: 'June 2, 2025 | 10:00am',
    status: 'upcoming',
    category: 'apartment',
    prizeType: 'MacBook',
    ticketType: 'MacBook',
    drawTime: '10am',
    gameType: 'instant',
  },
];

export default function RaffleGames() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'instant'>('all');
  const [category, setCategory] = useState('all');
  const [prizeType, setPrizeType] = useState('all');
  const [ticketType, setTicketType] = useState('all');
  const [drawTime, setDrawTime] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 6;

  const filteredRaffles = raffles.filter((raffle) => {
    const statusMatch = statusFilter === 'all' || raffle.status === statusFilter;
    const categoryMatch = category === 'all' || raffle.category === category;
    const prizeMatch = prizeType === 'all' || raffle.prizeType === prizeType;
    const ticketMatch = ticketType === 'all' || raffle.ticketType === ticketType;
    const drawMatch = drawTime === 'all' || raffle.drawTime === drawTime;
    return statusMatch && categoryMatch && prizeMatch && ticketMatch && drawMatch;
  });

  const totalPages = Math.ceil(filteredRaffles.length / rafflesPerPage);
  const paginatedRaffles = filteredRaffles.slice((currentPage - 1) * rafflesPerPage, currentPage * rafflesPerPage);

  return (
    <section>
      <div className="px-6 md:px-16 py-10 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              All Raffles/Games <span className="text-primary-red">(192)</span>
            </h2>
            <p className="text-sm text-gray-500">One ticket. One shot. Your keys could be next.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[#d0d5dd] rounded px-3 py-2 text-sm text-gray-600">
              <option value="all">Category: Show All</option>
              <option value="apartment">Apartments</option>
              <option value="car">Cars</option>
              <option value="phone">Phones</option>
            </select>

            <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className="border border-[#d0d5dd] rounded px-3 py-2 text-sm text-gray-600">
              <option value="all">Ticket Type</option>
              <option value="iPhone">iPhone</option>
              <option value="Samsung">Samsung</option>
              <option value="MacBook">MacBook</option>
            </select>

            <select value={drawTime} onChange={(e) => setDrawTime(e.target.value)} className="border border-[#d0d5dd] rounded px-3 py-2 text-sm text-gray-600">
              <option value="all">Draw Time</option>
              <option value="8am">8am</option>
              <option value="9am">9am</option>
              <option value="10am">10am</option>
            </select>

            <select value={prizeType} onChange={(e) => setPrizeType(e.target.value)} className="border border-[#d0d5dd] rounded px-3 py-2 text-sm text-gray-600">
              <option value="all">Prize Type</option>
              <option value="iPhone">iPhone</option>
              <option value="Samsung">Samsung</option>
              <option value="MacBook">MacBook</option>
            </select>

            <ActionIcon size={44}>
              <IconZoomFilled />
            </ActionIcon>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          <FilterPill label="All Games" count={40} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <FilterPill label="Live Games" count={10} active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} />
          <FilterPill label="Upcoming Games" count={16} active={statusFilter === 'upcoming'} onClick={() => setStatusFilter('upcoming')} />
          <FilterPill label="Instant Games" count={12} active={statusFilter === 'instant'} onClick={() => setStatusFilter('instant')} />
        </div>
      </div>

      {/* Raffles Grid */}
      <div className="px-6 md:px-16 pt-15 pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {paginatedRaffles.map((raffle, idx) => (
            <RaffleCard key={idx} {...raffle} />
          ))}

          {paginatedRaffles.length === 0 && (
            <p className="text-center text-gray-400 col-span-full">No raffles match your filters.</p>
          )}
        </div>
      </div>

      {/* Pagination Component */}
      <div className="px-6 md:px-16 pb-10">
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
}
