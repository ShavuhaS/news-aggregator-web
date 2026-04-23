import { LucideIcon, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'ghost';
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500",
        variant === 'default' && "py-20 px-6 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/50",
        variant === 'compact' && "py-12 px-4",
        variant === 'ghost' && "py-8",
        className
      )}
    >
      <div className={cn(
        "p-4 rounded-full mb-4",
        variant === 'default' ? "bg-background shadow-sm border border-muted" : "bg-muted/30"
      )}>
        <Icon className={cn(
          "text-muted-foreground/40",
          variant === 'default' ? "h-10 w-10" : "h-8 w-8"
        )} />
      </div>
      
      <h3 className="text-xl font-bold tracking-tight text-foreground/80">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground text-sm max-w-[300px] mt-2 mb-6 leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="h-10 px-6 gap-2 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
