import { Button } from '@/components/ui/button';
import { Play, Edit3, Trash2, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceActionsProps {
  active: boolean;
  onTriggerParse: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  isTriggerPending: boolean;
  isStatusPending: boolean;
}

export function SourceActions({
  active,
  onTriggerParse,
  onEdit,
  onToggleStatus,
  onDelete,
  isTriggerPending,
  isStatusPending,
}: SourceActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
        title="Запустити парсинг"
        onClick={onTriggerParse}
        disabled={isTriggerPending || !active}
      >
        <Play className="h-3.5 w-3.5 fill-current" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-primary hover:bg-primary/5 transition-all cursor-pointer"
        title="Редагувати"
        onClick={onEdit}
      >
        <Edit3 className="h-3.5 w-3.5" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "h-8 w-8 transition-all cursor-pointer",
          active ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"
        )}
        title={active ? "Вимкнути" : "Активувати"}
        onClick={onToggleStatus}
        disabled={isStatusPending}
      >
        <Power className="h-3.5 w-3.5" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
        title="Видалити"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
