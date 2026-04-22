import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

interface EntityListProps {
  items: any[];
  labelKey: string;
  onAdd: (id: string) => void;
  isPending: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
  emptyMessage: string;
}

export function EntityList({
  items,
  labelKey,
  onAdd,
  isPending,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  emptyMessage,
}: EntityListProps) {
  if (items.length === 0 && !isFetchingNextPage) {
    return <p className="text-xs text-muted-foreground py-2 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => onAdd(item.id)}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="mr-1 h-3 w-3" />
          )}
          {item[labelKey]}
        </Button>
      ))}

      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Plus className="h-3 w-3 mr-1" />
          )}
          Завантажити ще
        </Button>
      )}
    </div>
  );
}
