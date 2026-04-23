import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Complaint } from '@/types/news';
import { PaginatedResponse } from '@/types/api';
import { Pagination } from '@/components/shared/Pagination';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface NewsComplaintsAdminProps {
  newsId: string;
  onNewsDeleted: () => void;
  onUpdate?: () => void;
}

export function NewsComplaintsAdmin({ newsId, onNewsDeleted, onUpdate }: NewsComplaintsAdminProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['news-complaints', newsId, page, pageSize],
    queryFn: () => apiFetch<PaginatedResponse<Complaint>>(`/news/${newsId}/complaints?page=${page}&pageSize=${pageSize}`),
  });

  const resolveMutation = useMutation({
    mutationFn: () => apiFetch(`/news/${newsId}/complaints/resolve`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Новину видалено, скарги вирішено');
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-complaints-admin'] });
      onNewsDeleted();
      onUpdate?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: () => apiFetch(`/news/${newsId}/complaints/reject`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Всі скарги відхилено');
      queryClient.invalidateQueries({ queryKey: ['news-complaints-admin'] });
      refetch();
      onUpdate?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const complaints = data?.data || [];

  return (
    <div className="space-y-6">
      {complaints.length > 0 ? (
        <>
          <div className="flex gap-3">
            <Button 
              variant="destructive" 
              className="flex-1 font-black uppercase text-[10px] tracking-[0.1em] h-11 shadow-lg shadow-destructive/10 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => resolveMutation.mutate()}
              disabled={resolveMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Видалити та закрити
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 font-bold uppercase text-[10px] tracking-[0.1em] h-11 cursor-pointer hover:bg-accent transition-all"
              onClick={() => rejectMutation.mutate()}
              disabled={rejectMutation.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" /> Відхилити всі
            </Button>
          </div>

          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-4 rounded-2xl bg-muted/20 border border-muted hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-background px-2 py-0.5 rounded border border-muted">
                    {format(new Date(complaint.createdAt), 'dd.MM.yy, HH:mm', { locale: uk })}
                  </span>
                </div>
                <p className="text-sm italic text-foreground/80 leading-relaxed pl-2 border-l-2 border-primary/30">
                  "{complaint.reason}"
                </p>
              </div>
            ))}
          </div>
          
          <Pagination 
            page={page}
            pageSize={pageSize}
            totalPages={data?.totalPages || 0}
            totalCount={data?.totalCount || 0}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-[2.5rem] border-muted/50 bg-muted/5">
          <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Активних скарг немає</p>
        </div>
      )}
    </div>
  );
}
