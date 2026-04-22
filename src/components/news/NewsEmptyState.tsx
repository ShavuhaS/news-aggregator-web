import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsEmptyStateProps {
  onReset: () => void;
}

export function NewsEmptyState({ onReset }: NewsEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-muted/10 rounded-[2rem] border-2 border-dashed border-muted flex flex-col items-center gap-4">
      <div className="bg-background p-4 rounded-full shadow-sm">
        <Search className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <div className="space-y-1">
        <p className="text-xl font-bold">Нічого не знайдено</p>
        <p className="text-sm text-muted-foreground">Спробуйте змінити параметри пошуку або фільтри</p>
      </div>
      <Button
        variant="outline"
        onClick={onReset}
        className="mt-2 font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Очистити все
      </Button>
    </div>
  );
}
