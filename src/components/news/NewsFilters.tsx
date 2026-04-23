import { useState } from 'react';
import { ListNewsQuery, NewsSortField } from '@/types/news';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { SortFilter } from './filters/SortFilter';
import { SentimentFilter } from './filters/SentimentFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { LocationFilter } from './filters/LocationFilter';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';

interface NewsFiltersProps {
  filters: ListNewsQuery;
  onFiltersChange: (filters: ListNewsQuery) => void;
  onReset: () => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  isFetching?: boolean;
}

export function NewsFilters({ 
  filters, 
  onFiltersChange, 
  onReset,
  searchInput,
  onSearchInputChange,
  isFetching
}: NewsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = !!(
    filters.categoryId || 
    filters.locationId || 
    filters.from || 
    filters.to || 
    filters.minSentiment !== undefined || 
    filters.maxSentiment !== undefined ||
    filters.sortBy !== NewsSortField.PUBLISHED_AT ||
    filters.sortOrder !== 'desc'
  );

  return (
    <div className="space-y-4">
      <SearchFilterBar 
        searchInput={searchInput}
        onSearchInputChange={onSearchInputChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        isFetching={isFetching}
      />

      {showFilters && (
        <FilterPanel onReset={onReset} hasFilters={hasFilters}>
          <SortFilter 
            sortBy={filters.sortBy} 
            sortOrder={filters.sortOrder}
            onChange={(field, order) => 
              onFiltersChange({ ...filters, sortBy: field, sortOrder: order, page: 1 })
            }
          />

          <CategoryFilter 
            value={filters.categoryId}
            onChange={(id) => onFiltersChange({ ...filters, categoryId: id, page: 1 })}
          />

          <LocationFilter 
            value={filters.locationId}
            onChange={(id) => onFiltersChange({ ...filters, locationId: id, page: 1 })}
          />

          <DateRangeFilter 
            from={filters.from}
            to={filters.to}
            onChange={(from, to) => onFiltersChange({ ...filters, from, to, page: 1 })}
          />

          <SentimentFilter 
            minSentiment={filters.minSentiment ?? -1} 
            maxSentiment={filters.maxSentiment ?? 1}
            onChange={(min, max) => 
              onFiltersChange({ ...filters, minSentiment: min, maxSentiment: max, page: 1 })
            }
          />
        </FilterPanel>
      )}
    </div>
  );
}
