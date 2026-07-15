import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number; // 0-indexado
  pageCount: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export default function Pagination({ currentPage, pageCount, basePath, extraParams = {} }: PaginationProps) {
  if (pageCount <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams(extraParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 text-sm" aria-label="Paginación">
      <Link
        href={hrefFor(Math.max(0, currentPage - 1))}
        aria-disabled={currentPage === 0}
        className={`flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 ${
          currentPage === 0 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
        }`}
      >
        <ChevronLeft size={15} />
      </Link>

      <span className="px-3 text-gray-600">
        Página {currentPage + 1} de {pageCount}
      </span>

      <Link
        href={hrefFor(Math.min(pageCount - 1, currentPage + 1))}
        aria-disabled={currentPage >= pageCount - 1}
        className={`flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 ${
          currentPage >= pageCount - 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
        }`}
      >
        <ChevronRight size={15} />
      </Link>
    </nav>
  );
}
