interface FilterPillProps {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}

export default function FilterPill({
  label,
  active,
  count,
  onClick,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-4 py-2 rounded-full cursor-pointer ${
        active ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {label}{' '}
      {active && <span
        className={`ml-2 text-xs rounded-full px-2 py-1.5 ${
          active ? 'bg-white text-black' : 'bg-[#cdcdcd] text-gray-500'
        }`}
      >
        {count}
      </span>}
    </button>
  );
}
