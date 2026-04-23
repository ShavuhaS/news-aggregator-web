import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Loader2, Search } from 'lucide-react';
import { PaginatedResponse } from '@/types/api';
import { EntityList } from './EntityList';

interface EntitySelectorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  searchPlaceholder: string;
  searchEndpoint: string;
  addEndpoint: (id: string) => string;
  removeEndpoint: (id: string) => string;
  preferredItems: Array<{ id: string; label: string }>;
  queryKey: string;
  labelKey: string;
  onUpdate: () => void;
}

export function EntitySelector({
  title,
  description,
  icon,
  searchPlaceholder,
  searchEndpoint,
  addEndpoint,
  removeEndpoint,
  preferredItems,
  queryKey,
  labelKey,
  onUpdate,
}: EntitySelectorProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: searchData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [queryKey, 'infinite', debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      apiFetch<PaginatedResponse<any>>(
        `${searchEndpoint}?search=${encodeURIComponent(debouncedSearch)}&pageSize=10&page=${pageParam}`
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.page === undefined) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const preferredIds = new Set(preferredItems.map((i) => i.id));
  
  const allFoundItems = searchData?.pages 
    ? searchData.pages.flatMap((page) => page.data || []) 
    : [];
    
  const otherItems = allFoundItems.filter((item) => item && !preferredIds.has(item.id));

  const toggleMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'add' | 'remove' }) =>
      apiFetch(action === 'add' ? addEndpoint(id) : removeEndpoint(id), {
        method: action === 'add' ? 'POST' : 'DELETE',
      }),
    onSuccess: () => {
      onUpdate();
      if (search) setSearch('');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {preferredItems.map((item) => (
            <Badge key={item.id} variant="secondary" className="px-3 py-1 text-sm gap-1">
              {item.label}
              <button
                onClick={() => toggleMutation.mutate({ id: item.id, action: 'remove' })}
                className="hover:text-destructive transition-colors disabled:opacity-50 cursor-pointer"
                disabled={toggleMutation.isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {preferredItems.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Нічого не вибрано</p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Додати нові:</p>
            {(isLoading || isFetchingNextPage) && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <EntityList
            items={otherItems}
            labelKey={labelKey}
            onAdd={(id) => toggleMutation.mutate({ id, action: 'add' })}
            isPending={toggleMutation.isPending}
            hasNextPage={!!hasNextPage}
            onLoadMore={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            emptyMessage={search ? `Нічого не знайдено за запитом "${search}"` : "Почніть пошук..."}
          />
        </div>
      </CardContent>
    </Card>
  );
}
