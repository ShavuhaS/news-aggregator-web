import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsFilters } from '@/components/news/NewsFilters';
import { Pagination } from '@/components/shared/Pagination';
import { NewsEmptyState } from '@/components/news/NewsEmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginatedResponse } from '@/types/api';
import { NewsArticle } from '@/types/news';
import { useNewsFilters } from '@/hooks/useNewsFilters';

export function NewsFeedPage() {
  const {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    handlePageChange,
    handlePageSizeChange,
    resetAll,
  } = useNewsFilters();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['news', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value.toString());
        }
      });
      return apiFetch<PaginatedResponse<NewsArticle>>(`/news?${params.toString()}`);
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight italic">Новини</h1>
        <p className="text-muted-foreground text-lg font-medium">Останні події, проаналізовані для вас</p>
      </div>

      <NewsFilters 
        filters={filters}
        onFiltersChange={setFilters}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        isFetching={isFetching}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: filters.pageSize || 12 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-2xl" />
              <div className="space-y-2 px-2">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {data?.data.length === 0 ? (
            <NewsEmptyState onReset={resetAll} />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.data.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              <Pagination 
                page={filters.page!} 
                pageSize={filters.pageSize!}
                totalPages={data?.totalPages || 0} 
                totalCount={data?.totalCount || 0}
                onPageChange={handlePageChange} 
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
