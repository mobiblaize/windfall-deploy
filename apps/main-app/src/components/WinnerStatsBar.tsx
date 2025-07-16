import { IconUserFilled } from '@tabler/icons-react';

const stats = [
  { label: '₦170m + in prize value so far' },
  { label: '1,904 Winners and Counting' },
  { label: 'Over 320 New Owners.' },
  { label: '2,2904 Price Won Since 2025' },
  { label: '6,400 Instant Prizes Won so far' },
];

export default function WinnerStatsBar() {
  return (
    <div className="bg-[#f9f9f9] px-6 md:px-16 pt-10 pb-20">
      <div className="bg-white border border-[#ececec] rounded-xl px-6 py-6 flex flex-wrap justify-start md:justify-between gap-4 shadow-sm">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-1 items-center gap-3 min-w-[180px]">
            <div className="bg-[#ffd5d6] p-2 rounded-md text-[var(--primary-red)]">
              <IconUserFilled size={28} />
            </div>
            <p className="text-sm md:text-base font-medium text-gray-800 leading-5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
