import { apiFetch } from '@/lib/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { PaginatedResponse } from '@/types/api';
import { Complaint, ComplaintStatus } from '@/types/news';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const STATUS_CONFIG = {
  [ComplaintStatus.PENDING]: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Очікує' },
  [ComplaintStatus.RESOLVED]: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Вирішено' },
  [ComplaintStatus.REJECTED]: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Відхилено' },
};

export function UserComplaints() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['user-complaints'],
    queryFn: ({ pageParam = 1 }) =>
      apiFetch<PaginatedResponse<Complaint>>(`/user/profile/complaints?page=${pageParam}&pageSize=10`),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => 
      apiFetch(`/user/profile/complaints/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Скаргу видалено');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const complaints = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Мої скарги
        </CardTitle>
        <CardDescription>Історія ваших повідомлень про некоректний контент</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {complaints.map((complaint) => {
          const config = STATUS_CONFIG[complaint.status];
          const StatusIcon = config.icon;

          return (
            <div 
              key={complaint.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${config.bg} ${config.color} border-none font-bold text-[10px] uppercase px-2`}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>

                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-tighter">Новина:</span>
                    {complaint.newsId ? (
                      <span className="text-foreground font-mono">{complaint.newsId.slice(0, 8)}...</span>
                    ) : (
                      <span className="text-destructive uppercase">Видалено</span>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider sm:ml-auto">
                    {format(new Date(complaint.createdAt), 'dd MMMM yyyy, HH:mm', { locale: uk })}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                  "{complaint.reason}"
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-center cursor-pointer"
                onClick={() => removeMutation.mutate(complaint.id)}
                disabled={removeMutation.isPending}
              >
                {removeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        })}

        {complaints.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Ви ще не подавали жодної скарги</p>
          </div>
        )}

        {hasNextPage && (
          <Button
            variant="outline"
            className="w-full h-10 font-bold uppercase text-[10px] tracking-widest mt-4 cursor-pointer"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Завантажити ще
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
