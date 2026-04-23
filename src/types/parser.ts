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
  active: boolean;
  lastParsedAt: string | null;
  logoUrl: string | null;
}

export interface ListParsingErrorsQuery {
  page?: number;
  pageSize?: number;
  sourceId?: string;
}
