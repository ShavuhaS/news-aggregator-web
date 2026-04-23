import { NewsArticle } from '@/types/news';
import { NewsCard } from './NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface NewsGridProps {
  articles: NewsArticle[];
  isLoading: boolean;
  variant?: 'default' | 'compact';
  skeletonCount?: number;
  className?: string;
  renderCard?: (article: NewsArticle) => React.ReactNode;
}

export function NewsGrid({ 
  articles, 
  isLoading, 
  variant = 'default', 
  skeletonCount = 8,
  className,
  renderCard
}: NewsGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className={cn(
              "h-[240px] w-full rounded-3xl",
              variant === 'compact' && "h-[200px]"
            )} />
            <div className="space-y-2 px-2">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {articles.map((article) => (
        renderCard ? renderCard(article) : (
          <NewsCard key={article.id} article={article} variant={variant} />
        )
      ))}
    </div>
  );
}
