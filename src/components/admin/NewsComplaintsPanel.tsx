import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { NewsWithComplaintsCount } from '@/types/news';
import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquareWarning } from 'lucide-react';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsGrid } from '@/components/news/NewsGrid';

export function NewsComplaintsPanel() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data, isLoading } = useQuery({
    queryKey: ['news-complaints-admin', page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      return apiFetch<PaginatedResponse<NewsWithComplaintsCount>>(`/news/complaints?${params.toString()}`);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Скарги на новини</h2>
          <p className="text-muted-foreground text-sm">Список новин з активними скаргами, відсортований за пріоритетом</p>
        </div>
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/5">
          <CardContent className="h-60 flex flex-col items-center justify-center gap-3">
            <div className="bg-background p-4 rounded-full shadow-sm border border-muted">
              <MessageSquareWarning className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium italic text-center">Активних скарг не знайдено</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          <NewsGrid 
            articles={data?.data || []} 
            isLoading={isLoading} 
            variant="compact"
            skeletonCount={pageSize}
            renderCard={(article) => (
              <NewsCard 
                key={article.id}
                article={article} 
                variant="compact" 
                complaintsCount={(article as NewsWithComplaintsCount).complaintsCount}
              />
            )}
          />

          <div className="pt-6 border-t border-muted/50">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalPages={data?.totalPages || 0}
              totalCount={data?.totalCount || 0}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}
    </div>
  );
}
