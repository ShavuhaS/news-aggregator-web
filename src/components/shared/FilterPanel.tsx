import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterPanelProps {
  children: ReactNode;
  onReset: () => void;
  hasFilters: boolean;
}

export function FilterPanel({ children, onReset, hasFilters }: FilterPanelProps) {
  return (
    <Card className="bg-muted/30 border-muted p-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {children}
        </div>
        
        {hasFilters && (
          <div className="flex justify-end pt-2 border-t border-muted/50">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive underline underline-offset-4 decoration-dotted font-bold uppercase text-[10px] tracking-widest h-8 cursor-pointer gap-2 transition-colors"
              onClick={onReset}
            >
              <RotateCcw className="h-3 w-3" />
              Скинути все
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
