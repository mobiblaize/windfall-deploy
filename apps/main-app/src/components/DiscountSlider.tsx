import { Slider } from "@mantine/core";
import { FaTicketAlt } from "react-icons/fa";
import type { DiscountTier } from "../models/raffles";

interface DiscountSliderProps {
  value: number;
  max: number;
  activeDiscount?: DiscountTier;
  onChange: (val: number) => void;
}

export default function DiscountSlider({
  value,
  max,
  onChange,
  activeDiscount
}: DiscountSliderProps) {

  return (
    <div className="flex items-center gap-6 pt-10">
      {/* Slider with label */}
      <div className="relative w-full">
        {/* Value label above the thumb */}
        <div
          className="absolute -top-10 left-0 transform -translate-x-1/2"
          style={{ left: `${(value / max) * 100}%` }}
        >
          <div className="bg-primary-red text-white text-sm rounded-md px-3 py-1 flex items-center gap-1 shadow">
            {value}
            <FaTicketAlt size={12} />
          </div>
        </div>

        {/* Slider */}
        <Slider
          value={value}
          label={null}
          onChange={onChange}
          min={1}
          max={max}
          step={1}
          className="slider-red"
          styles={{
            track: { height: 8 },
            bar: { backgroundColor: "#ff2f31" },
            thumb: {
              border: "2px solid #ff2f31",
              width: 24,
              height: 24,
              backgroundColor: "#fff",
              boxShadow: "0 0 0 2px white",
            },
          }}
        />
      </div>

      {/* Discount pill */}
      <div className="text-center -mt-9">
        <p className="text-sm text-gray-600 mb-1">Discount</p>
        <p className="bg-black text-white text-nowrap text-sm px-4 py-2 rounded-md">
          {activeDiscount?.value ? activeDiscount?.value+'%': 'No Discount'}
        </p>
      </div>
    </div>
  );
}
