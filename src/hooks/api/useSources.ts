import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { ParserSource, ListSourcesQuery } from '@/types/parser';

export function useSources(query: ListSourcesQuery) {
  const { page = 1, pageSize = 12, search = '', active, types, sortBy, sortDir } = query;

  return useQuery({
    queryKey: ['admin-sources', page, pageSize, search, active, types, sortBy, sortDir],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });

      if (active !== undefined) params.append('active', active.toString());
      if (sortBy) params.append('sortBy', sortBy);
      if (sortDir) params.append('sortDir', sortDir);
      types?.forEach(t => params.append('types', t));
      
      return apiFetch<PaginatedResponse<ParserSource>>(`/parser/sources?${params.toString()}`);
    },
  });
}

export function useSourceDetail(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin-source-detail', id],
    queryFn: () => apiFetch<ParserSource>(`/parser/sources/${id}`),
    enabled: !!id && enabled,
  });
}
