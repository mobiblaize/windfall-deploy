// components/Paginator.tsx
interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (newPage: number) => void;
}

export default function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  return (
    <div className="flex justify-center items-center gap-7 bg-white rounded-2xl py-5 px-8 shadow-sm border border-gray-200">
      <button
        className={`text-base px-4 py-2 rounded-full shadow-md ${
          currentPage === 1 ? 'text-gray-400 bg-white' : 'text-black bg-gray-100'
        }`}
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt; Previous
      </button>

      <span className="bg-black text-white text-base h-full px-4 py-2 rounded-full">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`text-base px-4 py-2 rounded-full shadow-md ${
          currentPage === totalPages ? 'text-gray-400 bg-white' : 'text-black bg-gray-100'
        }`}
        onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
}
