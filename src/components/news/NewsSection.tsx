import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { NewsArticle } from '@/types/news';
import { PaginatedResponse } from '@/types/api';
import { NewsCard } from './NewsCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsSectionProps {
  id?: string;
  title: string;
  icon: LucideIcon;
  queryParam: string;
  queryValue: string;
  href: string;
  isNearby?: boolean;
  nearbyParams?: { lat: number; lon: number; dist: number };
}

export function NewsSection({ 
  id,
  title, 
  icon: Icon, 
  queryParam, 
  queryValue, 
  href, 
  isNearby,
  nearbyParams 
}: NewsSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['news-section', queryParam, queryValue, isNearby],
    queryFn: () => {
      const endpoint = isNearby ? '/news/nearby' : '/news';
      const params = new URLSearchParams({
        pageSize: '4',
        ...(isNearby && nearbyParams 
          ? { lat: nearbyParams.lat.toString(), lon: nearbyParams.lon.toString(), dist: nearbyParams.dist.toString() } 
          : { [queryParam]: queryValue }
        ),
      });
      return apiFetch<PaginatedResponse<NewsArticle>>(`${endpoint}?${params.toString()}`);
    },
  });

  if (!isLoading && data?.data.length === 0) return null;

  return (
    <section id={id} className="space-y-4 scroll-mt-24 transition-all">
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <Button variant="ghost" size="sm" asChild className="font-bold uppercase text-[10px] tracking-widest gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
          <Link to={href}>
            Дивитись всі
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) : (
          data?.data.map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))
        )}
      </div>
    </section>
  );
}
