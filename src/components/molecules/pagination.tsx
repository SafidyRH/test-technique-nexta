'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '../atoms/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  className,
}: Readonly<PaginationProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  /**
   * Génère les numéros de page à afficher avec ellipsis
   * Exemple: [1, ..., 4, 5, 6, ..., 10]
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const showPages = 7; // Nombre max de boutons à afficher

    if (totalPages <= showPages) {
      // Si peu de pages, afficher toutes
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Afficher avec ellipsis intelligente
    if (currentPage <= 3) {
      // Début: [1, 2, 3, 4, ..., 10]
      return [1, 2, 3, 4, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      // Fin: [1, ..., 7, 8, 9, 10]
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Milieu: [1, ..., 4, 5, 6, ..., 10]
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  // Si une seule page, ne rien afficher
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* First Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(1)}
        disabled={!hasPreviousPage}
        aria-label="Première page"
        className="hidden sm:inline-flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <Button
              key={page}
              variant={isActive ? 'default' : 'outline'}
              size="icon"
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                isActive && "pointer-events-none"
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(totalPages)}
        disabled={!hasNextPage}
        aria-label="Dernière page"
        className="hidden sm:inline-flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      {/* Info Text (Mobile Hidden) */}
      <div className="ml-4 hidden text-sm text-muted-foreground lg:block">
        Page {currentPage} sur {totalPages}
      </div>
    </nav>
  );
}