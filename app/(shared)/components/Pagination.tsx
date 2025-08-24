'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => {
  const d =
    direction === 'left'
      ? 'M15.75 19.5L8.25 12l7.5-7.5'
      : 'M8.25 4.5l7.5 7.5-7.5 7.5';
  return (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
};
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const MAX_VISIBLE_PAGES = 5;
    const pageNumberList: (number | string)[] = [];

    if (totalPages <= MAX_VISIBLE_PAGES + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumberList.push(i);
      }
    } else {
      pageNumberList.push(1);
      if (currentPage > MAX_VISIBLE_PAGES - 1) {
        pageNumberList.push('...');
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = startPage + MAX_VISIBLE_PAGES - 3;
      } else if (currentPage >= totalPages - 2) {
        endPage = totalPages - 1;
        startPage = endPage - MAX_VISIBLE_PAGES + 3;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumberList.push(i);
      }

      if (currentPage < totalPages - (MAX_VISIBLE_PAGES - 2)) {
        pageNumberList.push('...');
      }
      pageNumberList.push(totalPages);
    }
    return pageNumberList;
  };

  const pageNumbers = getPageNumbers();

  const baseButtonStyles =
    'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border transition-colors';

  const defaultButtonStyles =
    'bg-card border-border text-foreground hover:bg-secondary text-muted-foreground bg-card';

  const activeButtonStyles = 'bg-muted border-border text-primary-foreground';

  const disabledButtonStyles = 'opacity-50 cursor-not-allowed';

  return (
    <nav aria-label="Page navigation">
      <ul className="flex items-center justify-center space-x-1 sm:space-x-2 px-2">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${baseButtonStyles} ${defaultButtonStyles} ${
              currentPage === 1 ? disabledButtonStyles : ''
            }`}
            aria-label="Previous Page"
          >
            <ArrowIcon direction="left" />
          </button>
        </li>

        {pageNumbers.map((number, index) =>
          typeof number === 'number' ? (
            <li key={`page-${number}`}>
              <button
                onClick={() => onPageChange(number)}
                className={`${baseButtonStyles} ${
                  currentPage === number
                    ? activeButtonStyles
                    : defaultButtonStyles
                }`}
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            </li>
          ) : (
            <li key={`ellipsis-${index}`}>
              <span
                className={`${baseButtonStyles} bg-card border-border text-muted-foreground`}
              >
                {number}
              </span>
            </li>
          )
        )}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${baseButtonStyles} ${defaultButtonStyles} ${
              currentPage === totalPages ? disabledButtonStyles : ''
            }`}
            aria-label="Next Page"
          >
            <ArrowIcon direction="right" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
