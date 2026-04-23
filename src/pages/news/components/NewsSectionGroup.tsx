import { LucideIcon } from 'lucide-react';

interface NewsSectionGroupProps {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function NewsSectionGroup({ label, icon: Icon, children }: NewsSectionGroupProps) {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-muted" />
        <div className="flex items-center gap-2 text-muted-foreground px-4 py-2 border rounded-full bg-muted/20 backdrop-blur-sm">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div className="h-px flex-1 bg-muted" />
      </div>
      
      <div className="space-y-16">
        {children}
      </div>
    </div>
  );
}
