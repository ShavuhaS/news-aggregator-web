import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { NewsWithComplaintsCount } from '@/types/news';
import { Pagination } from '@/components/shared/Pagination';
import { MessageSquareWarning } from 'lucide-react';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsGrid } from '@/components/news/NewsGrid';
import { EmptyState } from '@/components/shared/EmptyState';

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
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-bold tracking-tight">Скарги на новини</h2>
        <p className="text-muted-foreground text-sm font-medium">Список новин з активними скаргами, відсортований за пріоритетом</p>
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={MessageSquareWarning}
          title="Активних скарг не знайдено"
          description="Усі скарги розглянуті або відсутні в системі"
        />
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

          <div className="pt-2">
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
