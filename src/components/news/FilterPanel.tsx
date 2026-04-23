import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListNewsQuery } from '@/types/news';
import { SortFilter } from './filters/SortFilter';
import { SentimentFilter } from './filters/SentimentFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { LocationFilter } from './filters/LocationFilter';
import { DateRangeFilter } from './filters/DateRangeFilter';

interface FilterPanelProps {
  filters: ListNewsQuery;
  onFiltersChange: (filters: ListNewsQuery) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  return (
    <Card className="bg-muted/30 border-muted p-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        <SortFilter 
          sortBy={filters.sortBy} 
          sortOrder={filters.sortOrder}
          onChange={(field, order) => 
            onFiltersChange({ ...filters, sortBy: field, sortOrder: order, page: 1 })
          }
        />

        <CategoryFilter 
          value={filters.categoryId}
          onChange={(id) => onFiltersChange({ ...filters, categoryId: id, page: 1 })}
        />

        <LocationFilter 
          value={filters.locationId}
          onChange={(id) => onFiltersChange({ ...filters, locationId: id, page: 1 })}
        />

        <DateRangeFilter 
          from={filters.from}
          to={filters.to}
          onChange={(from, to) => onFiltersChange({ ...filters, from, to, page: 1 })}
        />

        <SentimentFilter 
          minSentiment={filters.minSentiment ?? -1} 
          maxSentiment={filters.maxSentiment ?? 1}
          onChange={(min, max) => 
            onFiltersChange({ ...filters, minSentiment: min, maxSentiment: max, page: 1 })
          }
        />

        <div className="flex items-end justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-dotted font-bold uppercase text-[10px] tracking-widest h-8 cursor-pointer"
            onClick={onReset}
          >
            Скинути все
          </Button>
        </div>
      </div>
    </Card>
  );
}
