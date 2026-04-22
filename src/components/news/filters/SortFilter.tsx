import { Badge } from '@/components/ui/badge';
import { ArrowUpAz } from 'lucide-react';
import { NewsSortField, SortOrder } from '@/types/news';

const SORT_OPTIONS = [
  { label: 'А-Я', field: NewsSortField.TITLE, order: SortOrder.ASC },
  { label: 'Я-А', field: NewsSortField.TITLE, order: SortOrder.DESC },
  { label: 'Нові', field: NewsSortField.PUBLISHED_AT, order: SortOrder.DESC },
  { label: 'Старі', field: NewsSortField.PUBLISHED_AT, order: SortOrder.ASC },
  { label: 'Позитивні', field: NewsSortField.SENTIMENT, order: SortOrder.DESC },
  { label: 'Негативні', field: NewsSortField.SENTIMENT, order: SortOrder.ASC },
];

interface SortFilterProps {
  sortBy?: NewsSortField;
  sortOrder?: SortOrder;
  onChange: (field: NewsSortField, order: SortOrder) => void;
}

export function SortFilter({ sortBy, sortOrder, onChange }: SortFilterProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <ArrowUpAz className="h-4 w-4 text-primary" /> Сортування
      </label>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((sort) => (
          <Badge
            key={`${sort.field}-${sort.order}`}
            variant={sortBy === sort.field && sortOrder === sort.order ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => onChange(sort.field, sort.order)}
          >
            {sort.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
