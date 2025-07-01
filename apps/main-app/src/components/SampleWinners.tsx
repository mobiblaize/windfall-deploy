import WinnerCard from './WinnerCard';

const winners = [
  {
    name: 'Luxury SUV',
    story:
      'I participated in the Lucky Ride Raffle and won a stunning luxury SUV! The moment I drove it home, I felt like a celebrity. Thanks to this amazing raffle, my daily commute has transformed into an extraordinary experience.',
    image:
      'https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdXNlfGVufDB8fDB8fHww',
    priceValue: '₦ 15,000,000',
    raffleName: 'Lucky Ride Raffle',
    ticketValue: '₦ 5,000',
  },
  {
    name: '3-Bedroom House in Lekki',
    story:
      'I still can believe it — I entered with just one ticket and now I own a house in Lekki! Windfall Raffle changed my life. No stress, no long story. Just a simple game that gave me the biggest win of my life.',
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=987&q=80',
    priceValue: '₦ 32,000,000',
    raffleName: 'Golden House Lekki Raffle',
    ticketValue: '₦ 10,000',
  },
  {
    name: '3-Bedroom House in Lekki',
    story:
      'I still can’t believe it — I entered with just one ticket and now I own a house in Lekki! Windfall Raffle changed my life. No stress, no long story. Just a simple game that gave me the biggest win of my life.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    priceValue: '₦ 32,000,000',
    raffleName: 'Golden House Lekki Raffle',
    ticketValue: '₦ 10,000',
  },
];

export default function SampleWinners() {
  const isEmpty = winners.length === 0;

  return (
    <section className="px-6 md:px-16 py-10 bg-[#f9f9f9] text-center">
      <h2 className="text-3xl font-bold text-gray-800">Real People. Real Wins.</h2>
      <p className="text-gray-500 mb-5 max-w-xl mx-auto">
        Meet the lucky participants who turned tickets into life-changing prizes. Your story could be next.
      </p>
      <button className="bg-[var(--primary-red)] text-white font-medium px-6 py-2 rounded-md mb-10">
        Explore Games
      </button>

      {isEmpty ? (
        <div className="bg-white border border-gray-200 rounded-md p-10 max-w-lg mx-auto">
          <p className="text-lg font-semibold text-gray-700 mb-2">No Winners Yet</p>
          <p className="text-gray-500 mb-4">Stay tuned. New winners will be announced soon!</p>
          <button className="bg-[var(--primary-red)] text-white font-medium px-5 py-2 rounded-md">
            Try a Game
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {winners.map((winner, index) => (
            <WinnerCard key={index} {...winner} />
          ))}
        </div>
      )}
    </section>
  );
}
