export type ParserSourceType = 'RSS' | 'JSON' | 'HTML';

export interface ParserParsingError {
  id: string;
  sourceId: string;
  sourceName: string | null;
  errorMessage: string | null;
  createdAt: string | null;
}

export interface ParserSource {
  id: string;
  name: string;
  url: string;
  type: ParserSourceType;
  active: boolean;
  schedule: string | null;
  lastParsedAt: string | null;
  nextRunAt: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListParsingErrorsQuery {
  page?: number;
  pageSize?: number;
  sourceId?: string;
}
