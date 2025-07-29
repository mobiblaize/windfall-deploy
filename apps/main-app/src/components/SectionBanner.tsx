import type { ReactNode } from "react";

interface SectionBannerProps {
  children: ReactNode;
}

export default function SectionBanner({ children }: SectionBannerProps) {
  return (
    <div className="border-y border-dashed border-primary-red bg-[#fff7f7] py-8">
      <div className="!px-6 md:!px-16 sm:!mx-5 ">
        {children}
      </div>
    </div>
  );
}
