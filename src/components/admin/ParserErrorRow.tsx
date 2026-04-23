import { ParserParsingError } from '@/types/parser';
import { AlertCircle, Clock, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface ParserErrorRowProps {
  error: ParserParsingError;
}

export function ParserErrorRow({ error }: ParserErrorRowProps) {
  return (
    <tr className="hover:bg-muted/10 transition-colors group border-b border-muted/30 last:border-0">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <Clock className="h-3 w-3" />
          {error.createdAt ? format(new Date(error.createdAt), 'dd.MM.yy, HH:mm', { locale: uk }) : '—'}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-foreground line-clamp-1">
            {error.sourceName || 'Невідоме джерело'}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded border border-muted w-fit group-hover:bg-background transition-colors">
            <Hash className="h-2.5 w-2.5 opacity-50" />
            {error.sourceId}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3 text-destructive font-medium leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />
          <span className="break-all">{error.errorMessage || 'Невідома помилка'}</span>
        </div>
      </td>
    </tr>
  );
}
