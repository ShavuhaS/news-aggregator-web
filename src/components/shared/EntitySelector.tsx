import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus, Loader2, Search } from 'lucide-react';
import { PaginatedResponse } from '@/types/api';

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
    queryKey: [queryKey, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      apiFetch<PaginatedResponse<any>>(
        `${searchEndpoint}?search=${encodeURIComponent(debouncedSearch)}&pageSize=10&page=${pageParam}`
      ),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  const preferredIds = new Set(preferredItems.map((i) => i.id));
  const allFoundItems = searchData?.pages.flatMap((page) => page.data) || [];
  const otherItems = allFoundItems.filter((item) => !preferredIds.has(item.id));

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
                className="hover:text-destructive transition-colors disabled:opacity-50"
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
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {otherItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => toggleMutation.mutate({ id: item.id, action: 'add' })}
                disabled={toggleMutation.isPending}
              >
                {toggleMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="mr-1 h-3 w-3" />
                )}
                {item[labelKey]}
              </Button>
            ))}

            {hasNextPage && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Plus className="h-3 w-3 mr-1" />
                )}
                Завантажити ще
              </Button>
            )}

            {search && !isLoading && otherItems.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">
                Нічого не знайдено за запитом "{search}"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
