export interface NewsCategory {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  lemma: string;
  address: string;
  originalText: string;
  lat: number;
  lon: number;
}

export enum NewsSortField {
  SENTIMENT = 'sentimentScore',
  PUBLISHED_AT = 'publishedAt',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string | null;
  publishedAt: string | null;
  sentimentScore: number | null;
  sourceId: string;
  categoryId: string;
  category?: NewsCategory;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticleDetails extends NewsArticle {
  locations: Location[];
}

export interface ListNewsQuery {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  locationId?: string;
  minSentiment?: number;
  maxSentiment?: number;
  from?: string;
  to?: string;
  search?: string;
  sortBy?: NewsSortField;
  sortOrder?: SortOrder;
}
