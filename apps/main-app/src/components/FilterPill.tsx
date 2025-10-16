import { useEffect, useState } from "react";

interface FilterPillProps {
  label: string;
  active: boolean;
  count: number;
  loading?: boolean;
  onClick: () => void;
}

export default function FilterPill({
  label,
  active,
  count,
  onClick,
  loading = false,
}: FilterPillProps) {
  const [showCount, setShowCount] = useState(!loading);
  
  useEffect(() => {
    setShowCount(!loading);
  }, [loading]);

  function onFilter() {
    setShowCount(false);
    onClick();
  }

  return (
    <button
      onClick={onFilter}
      className={`text-sm px-4 py-2 rounded-full cursor-pointer ${
        active ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {label}{' '}
      {active && showCount && <span
        className={`ml-2 text-xs rounded-full px-2 py-1.5 ${
          active ? 'bg-white text-black' : 'bg-[#cdcdcd] text-gray-500'
        }`}
      >
        {count}
      </span>}
    </button>
  );
}
