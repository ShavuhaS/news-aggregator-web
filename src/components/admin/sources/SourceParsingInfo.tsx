import { Clock, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface SourceParsingInfoProps {
  lastParsedAt: string | null;
  nextRunAt: string | null;
  active: boolean;
}

export function SourceParsingInfo({ lastParsedAt, nextRunAt, active }: SourceParsingInfoProps) {
  return (
    <div className="flex flex-col gap-1 text-[10px]">
      <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
        <Clock className="h-3 w-3 text-primary/60" />
        <span>
          {lastParsedAt 
            ? format(new Date(lastParsedAt), 'dd.MM, HH:mm', { locale: uk }) 
            : 'ніколи'}
        </span>
      </div>
      {nextRunAt && active && (
        <div className="flex items-center gap-1.5 text-emerald-600/80 font-bold">
          <CalendarDays className="h-3 w-3" />
          <span>{format(new Date(nextRunAt), 'HH:mm', { locale: uk })}</span>
        </div>
      )}
    </div>
  );
}
