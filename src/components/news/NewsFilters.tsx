import { useState } from 'react';
import { ListNewsQuery, NewsSortField, SortOrder } from '@/types/news';
import { FilterPanel } from './FilterPanel';
import { SearchFilterBar } from './filters/SearchFilterBar';

interface NewsFiltersProps {
  filters: ListNewsQuery;
  onFiltersChange: (filters: ListNewsQuery) => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  isFetching?: boolean;
}

export function NewsFilters({
  filters,
  onFiltersChange,
  searchInput,
  onSearchInputChange,
  isFetching,
}: NewsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const resetFilters = () => {
    onFiltersChange({
      page: 1,
      pageSize: 12,
      search: '',
      categoryId: undefined,
      locationId: undefined,
      from: undefined,
      to: undefined,
      minSentiment: -1,
      maxSentiment: 1,
      sortBy: NewsSortField.PUBLISHED_AT,
      sortOrder: SortOrder.DESC,
    });
    onSearchInputChange('');
  };

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
        <FilterPanel 
          filters={filters} 
          onFiltersChange={onFiltersChange} 
          onReset={resetFilters} 
        />
      )}
    </div>
  );
}
