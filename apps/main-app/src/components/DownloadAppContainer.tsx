import { Card, Box } from "@mantine/core";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DownloadAppContainer = ({ children }: Props) => {
  const borderColor = "border-[#FF4D4D]";

  return (
    <Card className="!p-0 !bg-transparent shadow-none">
      <Box
        className={`relative max-w-2xl !bg-white border border-dashed py-6 md:py-10 rounded-[40px] ${borderColor}`}
      >
        {/* Top Left Cut-Out */}
        <div
          className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        {/* Top Right Cut-Out */}
        <div
          className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        {/* Bottom Left Cut-Out */}
        <div
          className={`absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        {/* Bottom Right Cut-Out */}
        <div
          className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-20 h-20 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />

        {/* Top small perforations */}
        <div
          className={`absolute top-0 left-1/2 -translate-y-1/2 -translate-x-12 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute top-0 left-1/2 -translate-y-1/2 -translate-x-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute top-0 left-1/2 -translate-y-1/2 translate-x-0 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute top-0 left-1/2 -translate-y-1/2 translate-x-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />

        {/* Bottom small perforations */}
        <div
          className={`absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-12 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 translate-y-1/2 translate-x-0 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 translate-y-1/2 translate-x-6 w-4 h-4 bg-gray-50 rounded-full border border-dashed ${borderColor}`}
        />

        {/* Content */}
        <div className="relative z-10 flex justify-center">{children}</div>
      </Box>
    </Card>
  );
};

export default DownloadAppContainer;
