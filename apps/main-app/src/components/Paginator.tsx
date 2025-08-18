import { Button } from "@mantine/core";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (newPage: number) => void;
}

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
}: PaginatorProps) {
  const sharedStyles = {
    boxShadow: "0px 2.86px 22.86px 0px #EDEDF6",
    backgroundColor: "#fff",
    borderRadius: "9999px",
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "400",
    color: "#818181",
    height: "43px",
    lineHeight: "20px",
  };

  return (
    <div
      className="flex justify-center items-center gap-7 bg-white rounded-2xl py-5 px-8"
      style={{ boxShadow: "0px 2.86px 22.86px 0px #EDEDF6" }}
    >
      <Button
        variant="unstyled"
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        style={sharedStyles}
      >
        <span className="sm:hidden">&lt;</span>
        <span className="hidden sm:inline">&lt; Previous</span>
      </Button>

      <span className="bg-black text-white text-base h-full px-4 py-2 rounded-full">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="unstyled"
        disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
        style={sharedStyles}
      >
        <span className="sm:hidden">&gt;</span>
        <span className="hidden sm:inline">Next &gt;</span>
      </Button>
    </div>
  );
}
