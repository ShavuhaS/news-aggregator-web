import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { NewsGrid } from '@/components/news/NewsGrid';
import { Pagination } from '@/components/shared/Pagination';
import { NewsEmptyState } from '@/components/news/NewsEmptyState';
import { Badge } from '@/components/ui/badge';
import { Navigation } from 'lucide-react';
import { PaginatedResponse } from '@/types/api';
import { NewsArticle } from '@/types/news';
import { useDebounce } from '@/hooks/useDebounce';
import { NearbyMap } from './components/NearbyMap';
import { NearbyControls } from './components/NearbyControls';
import { DEFAULT_NEARBY_DISTANCE, KYIV_COORDS } from '@/constants/news';

export function NearbyNewsPage() {
  const [lat, setLat] = useState(KYIV_COORDS.lat);
  const [lon, setLon] = useState(KYIV_COORDS.lon);
  const [dist, setDist] = useState(DEFAULT_NEARBY_DISTANCE);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const debouncedDist = useDebounce(dist, 400);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      });
    }
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['news-nearby', lat, lon, debouncedDist, debouncedSearch, page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        dist: debouncedDist.toString(),
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      return apiFetch<PaginatedResponse<NewsArticle>>(`/news/nearby?${params.toString()}`);
    },
  });

  const handleLocationSelect = (newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
    setPage(1);
  };

  const handleUserLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
      });
    }
  };

  const handleReset = () => {
    setSearch('');
    setDist(DEFAULT_NEARBY_DISTANCE);
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight italic flex items-center gap-3 text-primary">
          <Navigation className="h-10 w-10" />
          Поблизу
        </h1>
        <p className="text-muted-foreground text-lg font-medium">Шукайте новини навколо обраної локації</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <NearbyMap 
          lat={lat} 
          lon={lon} 
          dist={dist} 
          onLocationSelect={handleLocationSelect} 
          onUserLocate={handleUserLocate} 
        />

        <NearbyControls 
          search={search}
          onSearchChange={setSearch}
          isFetching={isFetching}
          dist={dist}
          onDistChange={(v) => {
            setDist(v);
            setPage(1);
          }}
          lat={lat}
          lon={lon}
          onReset={handleReset}
        />
      </div>

      <div className="space-y-6 pt-8 border-t border-muted/50">
        <h2 className="text-2xl font-bold tracking-tight px-2 flex items-center gap-3">
          Знайдені новини
          {data?.totalCount ? (
            <Badge variant="secondary" className="h-6 text-xs px-2.5 font-black bg-primary/10 text-primary border-primary/20">
              {data.totalCount}
            </Badge>
          ) : null}
        </h2>
        
        {!isLoading && data?.data.length === 0 ? (
          <NewsEmptyState onReset={handleReset} />
        ) : (
          <div className="space-y-8">
            <NewsGrid 
              articles={data?.data || []} 
              isLoading={isLoading} 
              variant="default"
              skeletonCount={pageSize}
            />

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
        )}
      </div>
    </div>
  );
}
