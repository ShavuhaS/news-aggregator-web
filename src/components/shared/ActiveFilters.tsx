import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';

export interface ActiveFilterItem {
  key: string;
  label: string;
  displayValue: string;
}

interface ActiveFiltersProps {
  items: ActiveFilterItem[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  title?: string;
}

export function ActiveFilters({ items, onRemove, onClearAll, title = 'Активні фільтри:' }: ActiveFiltersProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-left-1 duration-300">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
        {title}
      </span>

      {items.map((item) => (
        <Badge 
          key={item.key} 
          variant="secondary" 
          className="pl-2 pr-1 py-1 gap-1 text-xs font-medium bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 transition-colors"
        >
          <span className="opacity-70 font-bold">{item.label}:</span>
          <span>{item.displayValue}</span>
          <button 
            onClick={() => onRemove(item.key)} 
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors ml-0.5"
            aria-label={`Видалити фільтр ${item.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-transparent"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Очистити
      </Button>
    </div>
  );
}
