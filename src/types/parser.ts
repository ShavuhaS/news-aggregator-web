export type ParserSourceType = 'RSS' | 'JSON' | 'HTML';

export enum ParserSourceSortField {
  ID = 'id',
  NAME = 'name',
  TYPE = 'type',
  ACTIVE = 'active',
  LAST_PARSED_AT = 'last_parsed_at',
  NEXT_RUN_AT = 'next_run_at',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum ParserSortDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface HTTPConfig {
  headers?: Record<string, string>;
}

export interface HTMLMapping {
  itemsSelector: string;
  titleSelector: string;
  titleAttr?: string;
  descriptionSelector?: string;
  descriptionAttr?: string;
  linkSelector: string;
  linkAttr?: string;
  imageUrlSelector?: string;
  imageUrlAttr?: string;
  publishedAtSelector?: string;
  publishedAtAttr?: string;
  dateFormat?: string[];
}

export interface JSONMapping {
  itemsPath?: string;
  titlePath: string;
  descriptionPath?: string;
  linkPath: string;
  imageUrlPath?: string;
  publishedAtPath?: string;
  dateFormat?: string[];
  logoPath?: string;
}

export interface ParserSourceConfig {
  http: HTTPConfig;
  mapping?: HTMLMapping | JSONMapping;
}

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
  configuration: ParserSourceConfig;
  lastParsedAt: string | null;
  nextRunAt: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListSourcesQuery {
  page?: number;
  pageSize?: number;
  active?: boolean;
  types?: ParserSourceType[];
  search?: string;
  sortBy?: ParserSourceSortField;
  sortDir?: ParserSortDir;
}

export interface ListParsingErrorsQuery {
  page?: number;
  pageSize?: number;
  sourceId?: string;
}
