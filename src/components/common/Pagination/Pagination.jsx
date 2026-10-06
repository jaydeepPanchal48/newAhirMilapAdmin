import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.scss';

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const availablePageSizes = [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b);

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.leftMeta}>
        <span>
          Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
        </span>
        <div className={styles.pageSizeSelector}>
          <label htmlFor="pageSizeSelect">Show</label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {availablePageSizes.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.pageButtons}>
        <button
          type="button"
          className={styles.navBtn}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className={styles.numberList}>
          {getPageNumbers().map((num, idx) =>
            num === '...' ? (
              <span key={`dots-${idx}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={num}
                type="button"
                className={`${styles.pageNumberBtn} ${currentPage === num ? styles.active : ''}`}
                onClick={() => onPageChange(num)}
              >
                {num}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
