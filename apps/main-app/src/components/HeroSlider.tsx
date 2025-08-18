// components/HeroSlider.tsx
import { Button } from '@mantine/core';
import hero from '../assets/hero-img.jpg';
import { useNavigate } from 'react-router-dom';

export default function HeroSlider() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden">
      {/* Background Image */}
      <img
        src={hero} // Replace with your actual image path
        alt="Car"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-[2px] z-10" />

      {/* Content Box */}
      <div className="absolute top-1/2 left-10 md:left-24 -translate-y-1/2 z-20">
        <div className="bg-white/20 backdrop-blur-lg text-white p-8 md:w-[30vw] pt-10 rounded-xl max-w-[522px]">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            Your key to a new <br />
            <span className="text-white">Home!</span>
          </h1>
          <p className="text-sm mb-4">Live in , Rent out , Sell up</p>
          <Button onClick={() => navigate("/raffles")}
              size='lg'
              className="!bg-primary-red hover:bg-primary-red text-white font-semibold text-sm px-6 py-2 rounded-md shadow">
            Enter Game
          </Button>
        </div>
      </div>

      {/* Dots Navigation (Mockup for now) */}
      <div className="absolute bottom-5 right-5 flex gap-2 z-20">
        <span className="w-3 h-3 rounded-full bg-white/60" />
        <span className="w-3 h-3 rounded-full bg-white/90" />
      </div>
    </section>
  );
}
