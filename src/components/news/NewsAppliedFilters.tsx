import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { ListNewsQuery, NewsSortField, SortOrder, SORT_OPTIONS } from '@/types/news';
import { ActiveFilters, type ActiveFilterItem } from '@/components/shared/ActiveFilters';

interface NewsAppliedFiltersProps {
  filters: ListNewsQuery;
  onRemove: (key: keyof ListNewsQuery | 'dateRange' | 'sentiment' | 'sort') => void;
  onClearAll: () => void;
}

export function NewsAppliedFilters({ filters, onRemove, onClearAll }: NewsAppliedFiltersProps) {
  const { data: category } = useQuery({
    queryKey: ['category', filters.categoryId],
    queryFn: () => apiFetch<any>(`/news/categories/${filters.categoryId}`),
    enabled: !!filters.categoryId,
  });

  const { data: location } = useQuery({
    queryKey: ['location', filters.locationId],
    queryFn: () => apiFetch<any>(`/news/locations/${filters.locationId}`),
    enabled: !!filters.locationId,
  });

  const activeItems: ActiveFilterItem[] = [];

  const isDefaultSort = filters.sortBy === NewsSortField.PUBLISHED_AT && filters.sortOrder === SortOrder.DESC;
  if (!isDefaultSort) {
    const currentSort = SORT_OPTIONS.find(
      (opt) => opt.field === filters.sortBy && opt.order === filters.sortOrder
    );
    if (currentSort) {
      activeItems.push({
        key: 'sort',
        label: 'Порядок',
        displayValue: currentSort.label,
      });
    }
  }

  if (filters.categoryId && category) {
    activeItems.push({ 
      key: 'categoryId', 
      label: 'Тема', 
      displayValue: category.name 
    });
  }

  if (filters.locationId && location) {
    activeItems.push({ 
      key: 'locationId', 
      label: 'Місце', 
      displayValue: location.address 
    });
  }

  if (filters.from || filters.to) {
    activeItems.push({
      key: 'dateRange',
      label: 'Період',
      displayValue: `${filters.from ? format(new Date(filters.from), 'dd.MM.yy') : '...'} — ${
        filters.to ? format(new Date(filters.to), 'dd.MM.yy') : '...'
      }`,
    });
  }

  if (filters.minSentiment !== undefined && filters.maxSentiment !== undefined && 
     (filters.minSentiment !== -1 || filters.maxSentiment !== 1)) {
    activeItems.push({
      key: 'sentiment',
      label: 'Настрій',
      displayValue: `${filters.minSentiment.toFixed(1)} : ${filters.maxSentiment.toFixed(1)}`,
    });
  }

  return (
    <ActiveFilters 
      items={activeItems} 
      onRemove={(key) => onRemove(key as any)} 
      onClearAll={onClearAll} 
    />
  );
}
