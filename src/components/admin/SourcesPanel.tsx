import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { ParserSource, ParserSourceSortField, ParserSortDir, ListSourcesQuery } from '@/types/parser';
import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Plus, FilterX } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { SourceRow } from './sources/SourceRow';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { ActiveFilters, ActiveFilterItem } from '@/components/shared/ActiveFilters';
import { SourceStatusFilter } from './sources/filters/SourceStatusFilter';
import { SourceTypeFilter } from './sources/filters/SourceTypeFilter';
import { SourceSortFilter } from './sources/filters/SourceSortFilter';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';

export function SourcesPanel() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Omit<ListSourcesQuery, 'page' | 'pageSize' | 'search'>>({
    sortBy: ParserSourceSortField.CREATED_AT,
    sortDir: ParserSortDir.DESC,
  });
  
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-sources', page, pageSize, debouncedSearch, filters],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: debouncedSearch,
      });

      if (filters.active !== undefined) params.append('active', filters.active.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDir) params.append('sortDir', filters.sortDir);
      filters.types?.forEach(t => params.append('types', t));
      
      return apiFetch<PaginatedResponse<ParserSource>>(`/parser/sources?${params.toString()}`);
    },
  });

  const triggerParseMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/parser/sources/${id}/parse`, { method: 'POST' }),
    onSuccess: () => toast.success('Запит на парсинг надіслано'),
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => 
      apiFetch(`/parser/sources/${id}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ active }) 
      }),
    onSuccess: () => {
      toast.success('Статус джерела оновлено');
      queryClient.invalidateQueries({ queryKey: ['admin-sources'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/parser/sources/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Джерело видалено');
      queryClient.invalidateQueries({ queryKey: ['admin-sources'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleToggleStatus = (source: ParserSource) => {
    const action = source.active ? 'вимкнути' : 'активувати';
    if (confirm(`Ви впевнені, що хочете ${action} джерело "${source.name}"?`)) {
      statusMutation.mutate({ id: source.id, active: !source.active });
    }
  };

  const handleReset = () => {
    setSearch('');
    setFilters({
      sortBy: ParserSourceSortField.CREATED_AT,
      sortDir: ParserSortDir.DESC,
    });
    setPage(1);
  };

  const activeFilterItems = useMemo(() => {
    const items: ActiveFilterItem[] = [];
    if (search) items.push({ key: 'search', label: 'Пошук', displayValue: search });
    if (filters.active !== undefined) {
      items.push({ 
        key: 'active', 
        label: 'Статус', 
        displayValue: filters.active ? 'Активні' : 'Неактивні' 
      });
    }
    if (filters.types && filters.types.length > 0) {
      items.push({ 
        key: 'types', 
        label: 'Типи', 
        displayValue: filters.types.join(', ') 
      });
    }
    return items;
  }, [search, filters]);

  const removeFilter = (key: string) => {
    if (key === 'search') setSearch('');
    if (key === 'active') setFilters({ ...filters, active: undefined });
    if (key === 'types') setFilters({ ...filters, types: [] });
    setPage(1);
  };

  const hasFilters = search !== '' || filters.active !== undefined || (!!filters.types && filters.types.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Джерела новин
          </h2>
          <p className="text-muted-foreground text-sm">Керування сайтами-джерелами та конфігурацією парсерів</p>
        </div>
        <Button className="h-10 gap-2 font-bold uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-primary/20 cursor-pointer transition-all hover:scale-105 active:scale-95">
          <Plus className="h-4 w-4" />
          Додати джерело
        </Button>
      </div>

      <div className="space-y-4">
        <SearchFilterBar 
          searchInput={search}
          onSearchInputChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          isFetching={isFetching}
        />

        {showFilters && (
          <FilterPanel onReset={handleReset} hasFilters={hasFilters}>
            <SourceStatusFilter 
              value={filters.active} 
              onChange={(val) => {
                setFilters({ ...filters, active: val });
                setPage(1);
              }} 
            />

            <SourceTypeFilter 
              value={filters.types || []} 
              onChange={(val) => {
                setFilters({ ...filters, types: val });
                setPage(1);
              }} 
            />

            <SourceSortFilter 
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              onChange={(field, dir) => {
                setFilters({ ...filters, sortBy: field, sortDir: dir });
                setPage(1);
              }}
            />
          </FilterPanel>
        )}

        <ActiveFilters 
          items={activeFilterItems} 
          onRemove={removeFilter} 
          onClearAll={handleReset} 
        />
      </div>

      <Card className="border-muted/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-muted/50">
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground w-1/3">Джерело</th>
                  <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground w-32">Тип</th>
                  <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground w-32">Статус</th>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Моніторинг</th>
                  <th className="px-6 py-4 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground w-40">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/40">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-full rounded-lg" /></td>
                      <td className="px-6 py-4"><Skeleton className="mx-auto h-6 w-16 rounded-md" /></td>
                      <td className="px-6 py-4"><Skeleton className="mx-auto h-6 w-20 rounded-md" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-32 rounded-lg" /></td>
                      <td className="px-6 py-4"><Skeleton className="ml-auto h-8 w-24 rounded-lg" /></td>
                    </tr>
                  ))
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <FilterX className="h-10 w-10 opacity-20" />
                        <p className="font-medium italic text-lg">Нічого не знайдено за такими фільтрами</p>
                        <Button variant="link" onClick={handleReset} className="text-primary font-bold uppercase text-[10px] tracking-widest">
                          Очистити все
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.data.map((source) => (
                    <SourceRow 
                      key={source.id} 
                      source={source}
                      onTriggerParse={(id) => triggerParseMutation.mutate(id)}
                      onToggleStatus={handleToggleStatus}
                      onDelete={(s) => {
                        if (confirm(`Ви впевнені, що хочете видалити джерело "${s.name}"?`)) {
                          deleteMutation.mutate(s.id);
                        }
                      }}
                      onEdit={(s) => console.log('Edit source', s)}
                      isTriggerPending={triggerParseMutation.isPending}
                      isStatusPending={statusMutation.isPending}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
