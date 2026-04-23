import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { ParserSource } from '@/types/parser';
import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Database, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { SourceRow } from './sources/SourceRow';

export function SourcesPanel() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sources', page, pageSize, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: debouncedSearch,
      });
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

  const handleDelete = (source: ParserSource) => {
    if (confirm(`Ви впевнені, що хочете видалити джерело "${source.name}"?`)) {
      deleteMutation.mutate(source.id);
    }
  };

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
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук джерел..."
              className="pl-9 h-10 rounded-xl"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button className="h-10 gap-2 font-bold uppercase text-[10px] tracking-widest px-4 shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="h-4 w-4" />
            Додати
          </Button>
        </div>
      </div>

      <Card className="border-muted/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-muted/50">
                  <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Джерело</th>
                  <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground">Тип</th>
                  <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground">Статус</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Парсинг</th>
                  <th className="px-6 py-4 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/40">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="mx-auto h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="mx-auto h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="ml-auto h-8 w-24" /></td>
                    </tr>
                  ))
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center text-muted-foreground italic font-medium">
                      Джерел не знайдено
                    </td>
                  </tr>
                ) : (
                  data?.data.map((source) => (
                    <SourceRow 
                      key={source.id} 
                      source={source}
                      onTriggerParse={(id) => triggerParseMutation.mutate(id)}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
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
