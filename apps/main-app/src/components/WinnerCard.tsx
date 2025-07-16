import { IconArrowRight } from '@tabler/icons-react';

type WinnerCardProps = {
  name: string;
  story: string;
  image: string;
  priceValue: string;
  raffleName: string;
  ticketValue: string;
};

export default function WinnerCard({
  name,
  story,
  image,
  priceValue,
  raffleName,
  ticketValue,
}: WinnerCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm">
      <img src={image} alt={name} className="w-full h-48 object-cover rounded-md mb-5" />
      <p className="text-sm text-gray-500 mb-1">Prize Won</p>
      <h3 className="text-[var(--primary-red)] font-bold text-2xl mb-2">{name}</h3>
      <p className="text-gray-700 mb-6">{story}</p>

      {/* Raffle Details */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-4 mb-5">
        <div className="text-center flex-1 gap-1 border-r border-r-[#f3f2f5]">
          <p className="font-medium">Price Value</p>
          <p className="text-base text-[#2d2d2d]">{priceValue}</p>
        </div>
        <div className="text-center flex-1 gap-1 border-r border-r-[#f3f2f5]">
          <p className="font-medium">Raffle Name</p>
          <p className="text-base text-[#2d2d2d]">{raffleName}</p>
        </div>
        <div className="text-center flex-1 gap-1 border-r border-r-transparent">
          <p className="font-medium">Value Ticket Bought</p>
          <p className="text-base text-[#2d2d2d]">{ticketValue}</p>
        </div>
      </div>

      <button className="flex items-center justify-center gap-[5px] border font-bold bg-[#ffd5d6] border-dashed border-[var(--primary-red)] text-[var(--primary-red)] w-full py-2 rounded-md">
        Read Exclusive Winner Story <IconArrowRight size={16} />
      </button>
    </div>
  );
}
