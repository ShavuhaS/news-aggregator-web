import { ParserSource } from '@/types/parser';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SourceInfo } from './SourceInfo';
import { SourceStatus } from './SourceStatus';
import { SourceParsingInfo } from './SourceParsingInfo';
import { SourceActions } from './SourceActions';

const TYPE_STYLES: Record<string, string> = {
  RSS: "bg-blue-500/10 text-blue-600 border-blue-200",
  JSON: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  HTML: "bg-orange-500/10 text-orange-600 border-orange-200",
};

interface SourceRowProps {
  source: ParserSource;
  onTriggerParse: (id: string) => void;
  onToggleStatus: (source: ParserSource) => void;
  onDelete: (source: ParserSource) => void;
  onEdit: (source: ParserSource) => void;
  isTriggerPending: boolean;
  isStatusPending: boolean;
}

export function SourceRow({ 
  source, 
  onTriggerParse, 
  onToggleStatus, 
  onDelete, 
  onEdit,
  isTriggerPending,
  isStatusPending
}: SourceRowProps) {
  return (
    <tr className="hover:bg-muted/5 transition-colors group">
      <td className="px-6 py-4">
        <SourceInfo 
          name={source.name} 
          url={source.url} 
          logoUrl={source.logoUrl} 
        />
      </td>
      <td className="px-6 py-4 text-center">
        <Badge variant="outline" className={cn("px-2 py-0 h-5 font-black text-[9px] rounded", TYPE_STYLES[source.type])}>
          {source.type}
        </Badge>
      </td>
      <td className="px-6 py-4 text-center">
        <SourceStatus 
          active={source.active} 
          onToggle={() => onToggleStatus(source)} 
          disabled={isStatusPending}
        />
      </td>
      <td className="px-6 py-4">
        <SourceParsingInfo 
          lastParsedAt={source.lastParsedAt} 
          nextRunAt={source.nextRunAt} 
          active={source.active} 
        />
      </td>
      <td className="px-6 py-4 text-right">
        <SourceActions 
          active={source.active}
          onTriggerParse={() => onTriggerParse(source.id)}
          onEdit={() => onEdit(source)}
          onToggleStatus={() => onToggleStatus(source)}
          onDelete={() => onDelete(source)}
          isTriggerPending={isTriggerPending}
          isStatusPending={isStatusPending}
        />
      </td>
    </tr>
  );
}
