import hero from '../assets/hero-img.jpg';

const sponsorLogos = [
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
  hero,
];

export default function SponsorBrands() {
  return (
    <section className="text-center px-6 md:px-16 pt-10 pb-20 bg-white">
      {/* Headings */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Backed by Brands That Believe in Big Wins
      </h2>
      <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-6">
        Made possible by trusted sponsors who believe in turning everyday plays into extraordinary wins.
      </p>

      {/* Call to Action Button */}
      <button className="bg-[var(--primary-red)] hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-md text-sm transition mb-10">
        Explore Games
      </button>

      {/* Logos Grid */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {sponsorLogos.map((src, index) => (
          <div key={index} className="w-16 h-16">
            <img src={src} alt={`Sponsor ${index + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
