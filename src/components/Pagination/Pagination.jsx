import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './Pagination.css';

/**
 * Pagination Component - Reusable pagination with customizable options
 */
const Pagination = memo(({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showInfo = true,
  showJumper = false,
  className = '',
  disabled = false,
  maxVisiblePages = 7
}) => {
  const [jumpToPage, setJumpToPage] = useState('');

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange?.(page);
    }
  }, [currentPage, totalPages, onPageChange, disabled]);

  const handleJumpToPage = useCallback((e) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setJumpToPage('');
    }
  }, [jumpToPage, totalPages, handlePageChange]);

  const getVisiblePages = useCallback(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sidePages = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - sidePages);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`pagination ${className}`}>
      {showInfo && (
        <div className="pagination__info">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <div className="pagination__controls">
        <Button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || disabled}
          className="pagination__btn pagination__btn--first"
          variant="secondary"
          aria-label="First page"
        >
          ⏮
        </Button>

        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="pagination__btn pagination__btn--prev"
          variant="secondary"
          aria-label="Previous page"
        >
          ◀
        </Button>

        <div className="pagination__pages">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className={`pagination__btn pagination__btn--page ${
                  page === currentPage ? 'pagination__btn--active' : ''
                }`}
                variant={page === currentPage ? 'primary' : 'secondary'}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="pagination__btn pagination__btn--next"
          variant="secondary"
          aria-label="Next page"
        >
          ▶
        </Button>

        <Button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className="pagination__btn pagination__btn--last"
          variant="secondary"
          aria-label="Last page"
        >
          ⏭
        </Button>
      </div>

      {showJumper && totalPages > 10 && (
        <form onSubmit={handleJumpToPage} className="pagination__jumper">
          <label htmlFor="page-jumper" className="pagination__jumper-label">
            Go to:
          </label>
          <input
            id="page-jumper"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="pagination__jumper-input"
            placeholder="Page"
            disabled={disabled}
          />
          <Button
            type="submit"
            disabled={!jumpToPage || disabled}
            className="pagination__jumper-btn"
            variant="primary"
          >
            Go
          </Button>
        </form>
      )}
    </div>
  );
});

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showInfo: PropTypes.bool,
  showJumper: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  maxVisiblePages: PropTypes.number
};

Pagination.displayName = 'Pagination';

export default Pagination;