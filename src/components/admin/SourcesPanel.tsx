import { useState, useMemo } from 'react';
import { ParserSource, ParserSourceSortField, ParserSortDir, ListSourcesQuery, ParserSourceType } from '@/types/parser';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Database, Plus, Power, PowerOff, ListOrdered, SortAsc, SortDesc, RotateCcw } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { SourceRow } from './sources/SourceRow';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { ActiveFilters, ActiveFilterItem } from '@/components/shared/ActiveFilters';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { SourceEditDialog } from './sources/edit/SourceEditDialog';
import { useSources } from '@/hooks/api/useSources';
import { useSourceMutations } from '@/hooks/api/useSourceMutations';
import { DataTable, DataTableColumn } from '@/components/shared/DataTable';
import { ToggleFilter, ToggleFilterOption } from '@/components/shared/ToggleFilter';
import { EmptyState } from '@/components/shared/EmptyState';

const COLUMNS: DataTableColumn[] = [
  { header: 'Джерело', className: 'w-1/3' },
  { header: 'Тип', className: 'text-center w-32' },
  { header: 'Статус', className: 'text-center w-32' },
  { header: 'Моніторинг' },
  { header: 'Дії', className: 'text-right w-40' },
];

const STATUS_OPTIONS: ToggleFilterOption[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'On', icon: Power, activeClass: 'data-[state=on]:bg-emerald-700' },
  { value: 'inactive', label: 'Off', icon: PowerOff, activeClass: 'data-[state=on]:bg-amber-700' },
];

const TYPE_OPTIONS: ToggleFilterOption[] = [
  { value: 'RSS', label: 'RSS' },
  { value: 'JSON', label: 'JSON' },
  { value: 'HTML', label: 'HTML' },
];

const SORT_OPTIONS: ToggleFilterOption[] = [
  { value: ParserSourceSortField.NAME, label: 'Назва' },
  { value: ParserSourceSortField.LAST_PARSED_AT, label: 'Був запуск' },
  { value: ParserSourceSortField.NEXT_RUN_AT, label: 'План запуску' },
  { value: ParserSourceSortField.CREATED_AT, label: 'Додано' },
];

const DIR_OPTIONS: ToggleFilterOption[] = [
  { value: ParserSortDir.ASC, label: 'Asc', icon: SortAsc },
  { value: ParserSortDir.DESC, label: 'Desc', icon: SortDesc },
];

export function SourcesPanel() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Omit<ListSourcesQuery, 'page' | 'pageSize' | 'search'>>({
    sortBy: ParserSourceSortField.LAST_PARSED_AT,
    sortDir: ParserSortDir.DESC,
  });
  
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useSources({
    page,
    pageSize,
    search: debouncedSearch,
    ...filters
  });

  const { triggerParse, toggleStatus, deleteSource } = useSourceMutations();

  const handleAdd = () => {
    setSelectedSourceId(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (source: ParserSource) => {
    setSelectedSourceId(source.id);
    setEditDialogOpen(true);
  };

  const handleToggleStatus = (source: ParserSource) => {
    const action = source.active ? 'вимкнути' : 'активувати';
    if (confirm(`Ви впевнені, що хочете ${action} джерело "${source.name}"?`)) {
      toggleStatus.mutate({ id: source.id, active: !source.active });
    }
  };

  const handleReset = () => {
    setSearch('');
    setFilters({
      sortBy: ParserSourceSortField.LAST_PARSED_AT,
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

  const hasFilters = Boolean(search !== '' || filters.active !== undefined || (filters.types && filters.types.length > 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Джерела новин
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Керування сайтами-джерелами та конфігурацією парсерів</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-10 gap-2 font-bold uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-primary/20 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
        >
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
            <ToggleFilter
              label="Статус"
              options={STATUS_OPTIONS}
              value={filters.active === undefined ? 'all' : filters.active ? 'active' : 'inactive'}
              onChange={(val) => {
                setFilters({ 
                  ...filters, 
                  active: val === 'all' ? undefined : val === 'active' 
                });
                setPage(1);
              }}
            />

            <ToggleFilter
              label="Типи джерел"
              multiple
              options={TYPE_OPTIONS}
              value={filters.types || []}
              onChange={(val) => {
                setFilters({ ...filters, types: val as ParserSourceType[] });
                setPage(1);
              }}
            />

            <ToggleFilter
              label="Сортувати за"
              icon={ListOrdered}
              options={SORT_OPTIONS}
              value={filters.sortBy || ParserSourceSortField.LAST_PARSED_AT}
              onChange={(val) => {
                setFilters({ ...filters, sortBy: val as ParserSourceSortField });
                setPage(1);
              }}
            />
            
            <ToggleFilter
              label="Напрямок"
              options={DIR_OPTIONS}
              value={filters.sortDir || ParserSortDir.DESC}
              onChange={(val) => {
                setFilters({ ...filters, sortDir: val as ParserSortDir });
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

      <DataTable
        columns={COLUMNS}
        data={data?.data}
        isLoading={isLoading}
        skeletonCount={pageSize}
        emptyState={
          <EmptyState
            variant="ghost"
            title="Джерел не знайдено"
            description="Спробуйте змінити параметри пошуку або скинути фільтри"
            action={{
              label: "Скинути фільтри",
              icon: RotateCcw,
              onClick: handleReset
            }}
          />
        }
        renderRow={(source) => (
          <SourceRow 
            key={source.id} 
            source={source}
            onTriggerParse={(id) => triggerParse.mutate(id)}
            onToggleStatus={handleToggleStatus}
            onDelete={(s) => {
              if (confirm(`Ви впевнені, що хочете видалити джерело "${s.name}"?`)) {
                deleteSource.mutate(s.id);
              }
            }}
            onEdit={handleEdit}
            isTriggerPending={triggerParse.isPending}
            isStatusPending={toggleStatus.isPending}
          />
        )}
      />

      {data && data.totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      <SourceEditDialog 
        sourceId={selectedSourceId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
