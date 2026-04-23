import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { ParserParsingError, ListParsingErrorsQuery } from '@/types/parser';

export function useParserErrors(query: ListParsingErrorsQuery) {
  const { page = 1, pageSize = 12, sourceId } = query;

  return useQuery({
    queryKey: ['parser-errors', page, pageSize, sourceId],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sourceId) params.append('sourceId', sourceId);
      
      return apiFetch<PaginatedResponse<ParserParsingError>>(`/parser/sources/errors?${params.toString()}`);
    },
  });
}
