import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { ParserParsingError, ParserSource } from '@/types/parser';
import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, AlertCircle } from 'lucide-react';
import { ParserErrorRow } from './ParserErrorRow';
import { ComboboxFilter } from '@/components/shared/ComboboxFilter';

export function ParserErrorsPanel() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sourceId, setSourceId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['parser-errors', page, pageSize, sourceId],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sourceId) params.append('sourceId', sourceId);
      return apiFetch<PaginatedResponse<ParserParsingError>>(`/parser/sources/errors?${params.toString()}`);
    },
  });

  const { data: selectedSource } = useQuery({
    queryKey: ['parser-source', sourceId],
    queryFn: () => apiFetch<ParserSource>(`/parser/sources/${sourceId}`),
    enabled: !!sourceId,
  });

  return (
    <Card className="border-muted/60 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Лог помилок
            </CardTitle>
            <CardDescription>Журнал технічних проблем під час збору новин</CardDescription>
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
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted/50">
                <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground w-40">Час</th>
                <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground w-48">Джерело</th>
                <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Повідомлення</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-24 text-center text-muted-foreground italic font-medium bg-muted/5">
                    Помилок не знайдено
                  </td>
                </tr>
              ) : (
                data?.data.map((error) => (
                  <ParserErrorRow key={error.id} error={error} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="p-6 bg-muted/5 border-t border-muted/50">
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
      </CardContent>
    </Card>
  );
}
