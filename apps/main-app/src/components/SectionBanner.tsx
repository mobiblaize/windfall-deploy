import { Container } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionBannerProps {
  children: ReactNode;
}

export default function SectionBanner({ children }: SectionBannerProps) {
  return (
    <div className="border-y border-dashed border-primary-red bg-[#fff7f7] py-8">
      <Container size="lg" className="!px-6 md:!px-16 sm:!mx-5 ">
        {children}
      </Container>
    </div>
  );
}
