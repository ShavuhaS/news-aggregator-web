import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SourceStatusProps {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function SourceStatus({ active, onToggle, disabled }: SourceStatusProps) {
  return (
    <button 
      onClick={onToggle}
      disabled={disabled}
      className="cursor-pointer hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
    >
      <Badge 
        variant={active ? "default" : "secondary"} 
        className="h-6 px-2 gap-1.5 font-black uppercase text-[9px] tracking-wider rounded-lg border-2 border-transparent hover:border-muted-foreground/20 shrink-0"
      >
        {active ? (
          <>
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Активне
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 text-muted-foreground" />
            Неактивне 
          </>
        )}
      </Badge>
    </button>
  );
}
