'use client';

import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `/?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      <a
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
          currentPage > 1
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Previous</span>
      </a>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <a
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNum
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </a>
          );
        })}
      </div>

      {/* Next */}
      <a
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
          currentPage < totalPages
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={20} />
      </a>
    </nav>
  );
}
