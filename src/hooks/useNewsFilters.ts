import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListNewsQuery, NewsSortField, SortOrder } from '@/types/news';

export function useNewsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialFilters = (): ListNewsQuery => {
    return {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 12,
      search: searchParams.get('search') || '',
      categoryId: searchParams.get('categoryId') || undefined,
      locationId: searchParams.get('locationId') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      minSentiment: searchParams.get('minSentiment') !== null ? Number(searchParams.get('minSentiment')) : -1,
      maxSentiment: searchParams.get('maxSentiment') !== null ? Number(searchParams.get('maxSentiment')) : 1,
      sortBy: (searchParams.get('sortBy') as NewsSortField) || NewsSortField.PUBLISHED_AT,
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || SortOrder.DESC,
    };
  };

  const [filters, setFilters] = useState<ListNewsQuery>(getInitialFilters());
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (key === 'page' && value === 1) return;
        if (key === 'pageSize' && value === 12) return;
        if (key === 'minSentiment' && value === -1) return;
        if (key === 'maxSentiment' && value === 1) return;
        
        params[key] = value.toString();
      }
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilters(prev => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  const resetAll = () => {
    setFilters({
      page: 1,
      pageSize: 12,
      search: '',
      minSentiment: -1,
      maxSentiment: 1,
      sortBy: NewsSortField.PUBLISHED_AT,
      sortOrder: SortOrder.DESC,
    });
    setSearchInput('');
  };

  return {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    handlePageChange,
    handlePageSizeChange,
    resetAll,
  };
}
