import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFilterBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  isFetching?: boolean;
}

export function SearchFilterBar({
  searchInput,
  onSearchInputChange,
  showFilters,
  onToggleFilters,
  isFetching,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative group flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Шукайте за ключовими словами..."
          className="pl-10 h-12 text-lg shadow-sm bg-background/50 backdrop-blur-sm border-muted focus-visible:ring-primary/20"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>
      <Button
        variant={showFilters ? 'secondary' : 'outline'}
        onClick={onToggleFilters}
        className="h-12 px-6 gap-2 font-bold uppercase tracking-wider shadow-sm shrink-0 w-full sm:w-auto"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Фільтри
      </Button>
    </div>
  );
}
