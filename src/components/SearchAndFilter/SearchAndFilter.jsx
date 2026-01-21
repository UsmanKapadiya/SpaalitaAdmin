import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import CloseIcon from '@mui/icons-material/Close';
import './SearchAndFilter.css';

/**
 * SearchAndFilter Component - Reusable search and filter functionality
 */
const SearchAndFilter = memo(({
    searchValue = '',
    onSearchChange,
    filterValue = '',
    onFilterChange,
    filterOptions = [],
    placeholder = 'Search...',
    filterPlaceholder = 'All',
    showFilter = true,
    className = '',
    disabled = false
}) => {
    const handleSearchChange = useCallback((e) => {
        onSearchChange?.(e.target.value);
    }, [onSearchChange]);

    const handleFilterChange = useCallback((e) => {
        onFilterChange?.(e.target.value);
    }, [onFilterChange]);

    const handleSearchClear = useCallback(() => {
        onSearchChange?.('');
    }, [onSearchChange]);

    const handleFilterClear = useCallback(() => {
        onFilterChange?.('');
    }, [onFilterChange]);

    return (
        <div className={`search-filter ${className}`}>
            <div className="search-filter__search">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        className="search-input"
                        disabled={disabled}
                        aria-label="Search"
                    />
                    <div className="search-input__icons">
                        {searchValue && (
                            <Button
                                type="button"
                                onClick={handleSearchClear}
                                className="clear-search"
                                aria-label="Clear search"
                                disabled={disabled}
                            >
                                <CloseIcon />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {showFilter && filterOptions.length > 0 && (
                <div className="search-filter__filter">
                    <div className="filter-wrapper">
                        <select
                            value={filterValue}
                            onChange={handleFilterChange}
                            className="filter-select"
                            disabled={disabled}
                            aria-label="Filter options"
                        >
                            <option value="">{filterPlaceholder}</option>
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {filterValue && (
                            <Button
                                type="button"
                                onClick={handleFilterClear}
                                className="clear-search"
                                style={{marginRight:15}}
                                aria-label="Clear filter"
                                disabled={disabled}
                            >
                                 <CloseIcon />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

SearchAndFilter.propTypes = {
    searchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    filterValue: PropTypes.string,
    onFilterChange: PropTypes.func,
    filterOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    placeholder: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    showFilter: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

SearchAndFilter.displayName = 'SearchAndFilter';

export default SearchAndFilter;