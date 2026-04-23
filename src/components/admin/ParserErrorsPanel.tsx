import { useState } from 'react';
import { Database, AlertCircle } from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';
import { ComboboxFilter } from '@/components/shared/ComboboxFilter';
import { DataTable, DataTableColumn } from '@/components/shared/DataTable';
import { ParserErrorRow } from './ParserErrorRow';
import { useParserErrors } from '@/hooks/api/useParserErrors';
import { useSourceDetail } from '@/hooks/api/useSources';

const COLUMNS: DataTableColumn[] = [
  { header: 'Час', className: 'w-40' },
  { header: 'Джерело', className: 'w-48' },
  { header: 'Повідомлення' },
];

export function ParserErrorsPanel() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sourceId, setSourceId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useParserErrors({
    page,
    pageSize,
    sourceId,
  });

  const { data: selectedSource } = useSourceDetail(sourceId || null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Лог помилок
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Журнал технічних проблем під час збору новин</p>
        </div>
        
        <div className="w-full md:w-80">
          <ComboboxFilter
            icon={Database}
            label="Фільтр за джерелом"
            value={sourceId}
            onChange={(val) => {
              setSourceId(val || undefined);
              setPage(1);
            }}
            placeholder="Оберіть джерело..."
            searchPlaceholder="Пошук джерела..."
            emptyMessage="Джерел не знайдено"
            allLabel="Всі джерела"
            searchEndpoint="/parser/sources"
            queryKey="admin-sources-filter"
            labelKey="name"
            displayValue={selectedSource?.name}
          />
        </div>
      </div>
      
      <DataTable
        columns={COLUMNS}
        data={data?.data}
        isLoading={isLoading}
        skeletonCount={pageSize}
        emptyState={
          <div className="flex flex-col items-center gap-3 text-muted-foreground py-12">
            <AlertCircle className="h-10 w-10 opacity-20" />
            <p className="font-medium italic text-lg text-center">Помилок не знайдено</p>
            {sourceId && (
              <button 
                onClick={() => setSourceId(undefined)}
                className="text-primary font-bold uppercase text-[10px] tracking-widest hover:underline cursor-pointer"
              >
                Скинути фільтр
              </button>
            )}
          </div>
        }
        renderRow={(error) => (
          <ParserErrorRow key={error.id} error={error} />
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
    </div>
  );
}
